package com.google.sps.data;

public final class Comment {
  private final long id;
  private final String title;
  private final String content;
  private final long timestamp;
  private final String sentiment;

  public Comment(long id, String title, String content, long timestamp, String sentiment) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.timestamp = timestamp;
    this.sentiment = sentiment;
  }
}
