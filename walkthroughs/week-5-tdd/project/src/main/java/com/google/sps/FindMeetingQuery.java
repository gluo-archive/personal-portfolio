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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class FindMeetingQuery {
  private String MANDATORY = "mandatory";
  private String OPTIONAL = "optional";

  /**Return collection of timeRanges that work given the events all invited attendees are going
   * to.*/
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<Event> eventsList = new ArrayList<Event>(events);
    Collections.sort(eventsList, Event.ORDER_BY_START);
    long duration = request.getDuration();

    List<TimeRange> mandatoryTimes = new ArrayList<TimeRange>();
    List<TimeRange> optionalTimes = new ArrayList<TimeRange>();

    Set<String> mandatoryAttendees = new HashSet<String>(request.getAttendees());
    Set<String> optionalAndMandatoryAttendees = new HashSet<String>(request.getOptionalAttendees());
    optionalAndMandatoryAttendees.addAll(mandatoryAttendees);

    HashMap<String, TimeRange> prevTime = new HashMap<String, TimeRange>();
    prevTime.put(MANDATORY, null);
    prevTime.put(OPTIONAL, null);
    for (Event currEvent : eventsList) {
      boolean addToMandatory = true;
      boolean addToOptional = true;
      TimeRange currTime = currEvent.getWhen();
      Set<String> currAttendees = currEvent.getAttendees();
      addToMandatory = markOverlappingAttendees(mandatoryAttendees, currAttendees)
          && markDisjointRanges(MANDATORY, prevTime, currTime);
      addToOptional = markOverlappingAttendees(optionalAndMandatoryAttendees, currAttendees)
          && markDisjointRanges(OPTIONAL, prevTime, currTime);
      addToList(MANDATORY, mandatoryTimes, prevTime, currTime, duration, addToMandatory);
      addToList(OPTIONAL, optionalTimes, prevTime, currTime, duration, addToOptional);
    }

    // Add the chunk from the last event to end of day
    addToList(MANDATORY, mandatoryTimes, prevTime, null, duration, true);
    addToList(OPTIONAL, optionalTimes, prevTime, null, duration, true);

    // Handle edge case where if there are no mandatory,
    // then all optional are treated like mandatory
    if (optionalTimes.isEmpty() && !mandatoryAttendees.isEmpty()) {
      return mandatoryTimes;
    } else {
      return optionalTimes;
    }
  }

  private boolean markOverlappingAttendees(Set<String> attendees, Set<String> currAttendees) {
    return !Collections.disjoint(attendees, currAttendees);
  }

  private boolean markDisjointRanges(
      String key, HashMap<String, TimeRange> prevTime, TimeRange currTime) {
    TimeRange prev = prevTime.get(key);
    TimeRange curr = currTime;
    boolean overlaps = prev != null && prev.overlaps(curr);
    if (overlaps) {
      prevTime.put(key, combineOverlappingRanges(prev, curr));
    }
    return !overlaps;
  }

  private void addToList(String key, List<TimeRange> lst, HashMap<String, TimeRange> prevTime,
      TimeRange currTime, long duration, boolean addTo) {
    TimeRange prev = prevTime.get(key);
    TimeRange curr = currTime;
    if (addTo) {
      int start = (prev == null) ? TimeRange.START_OF_DAY : prev.end();
      int end = (curr == null) ? TimeRange.END_OF_DAY : curr.start();
      addTime(lst, start, end, duration);
      prevTime.put(key, curr);
    }
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
