package com.google.sps.data;
import java.util.Date;
import java.text.DateFormat; 
import java.text.SimpleDateFormat; 
import java.util.Date; 

public final class Comment {

  private final long id;
  private final String title;
  private final String content;
  private final String timestamp;

  public Comment(long id, String title, String content, long timestamp) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.timestamp = convertMillisToTimestamp(timestamp);
  }

  private String convertMillisToTimestamp(long timestamp) {
    Date date = new Date(timestamp);
    DateFormat dateFormat = new SimpleDateFormat("MMM dd yyyy hh:mm a"); 
    return dateFormat.format(timestamp);
  }
}