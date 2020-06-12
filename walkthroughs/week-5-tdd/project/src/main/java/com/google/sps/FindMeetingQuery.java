// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class FindMeetingQuery {
  /**Return collection of timeRanges that work given the events all invited attendees are going
   * to.*/
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<TimeRange> withOptionalAttendees = findAvailableTimes(events, request, true);
    Collection<String> mandatoryAttendees = request.getAttendees();
    // If there are no mandatory attendees but all optional attendees, return requests
    // as if all optional are mandatory
    if (!mandatoryAttendees.isEmpty() && withOptionalAttendees.isEmpty()) {
      Collection<TimeRange> withoutOptionalAttendees = findAvailableTimes(events, request, false);
      return withoutOptionalAttendees;
    } else {
      return withOptionalAttendees;
    }
  }

  private Collection<TimeRange> findAvailableTimes(
      Collection<Event> events, MeetingRequest request, boolean withOptionalAttendees) {
    List<Event> eventsList = new ArrayList<Event>(events);
    Collections.sort(eventsList, Event.ORDER_BY_START);
    eventsList.add(null); // Run for loop additional time to account for EOD

    List<TimeRange> availableTimes = new ArrayList<TimeRange>();
    Set<String> requestAttendees = new HashSet<String>(request.getAttendees());
    if (withOptionalAttendees) {
      requestAttendees.addAll(request.getOptionalAttendees());
    }

    TimeRange prevEventTime = null;
    TimeRange currEventTime = null;
    for (Event currEvent : eventsList) {
      currEventTime = null;
      if (currEvent != null) {
        currEventTime = currEvent.getWhen();
        Set<String> currAttendees = currEvent.getAttendees();
        if (Collections.disjoint(requestAttendees, currAttendees)) {
          continue;
        } else if (prevEventTime != null && prevEventTime.overlaps(currEventTime)) {
          prevEventTime = combineOverlappingRanges(prevEventTime, currEventTime);
          continue;
        }
      }
      int start = (prevEventTime == null) ? TimeRange.START_OF_DAY : prevEventTime.end();
      int end = (currEventTime == null) ? TimeRange.END_OF_DAY : currEventTime.start();
      addTime(availableTimes, start, end, request.getDuration());
      prevEventTime = currEventTime;
    }

    return availableTimes;
  }

  /** Create one big range out of two overlapping ones. */
  private TimeRange combineOverlappingRanges(TimeRange range1, TimeRange range2) {
    int start = Math.min(range1.start(), range2.start());
    int end = Math.max(range1.end(), range2.end());
    return TimeRange.fromStartEnd(start, end, false);
  }

  /** Adds available time in a failsafe way. */
  private void addTime(List<TimeRange> lst, int start, int end, long minDuration) {
    boolean inclusive = (end == TimeRange.END_OF_DAY) ? true : false;
    if (hasSufficientTime(start, end, minDuration) && hasSensibleStartEnd(start, end)) {
      TimeRange newTime = TimeRange.fromStartEnd(start, end, inclusive);
      lst.add(newTime);
    }
  }

  private boolean hasSufficientTime(int start, int end, long minDuration) {
    return end - start >= minDuration;
  }

  private boolean hasSensibleStartEnd(int start, int end) {
    return start < end && start >= TimeRange.START_OF_DAY && end <= TimeRange.END_OF_DAY;
  }
}
