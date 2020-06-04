package com.google.sps.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.util.List;
import java.util.ArrayList;

/** Class that handles the saving and returning of comments, currently implemented with DataStore */
public class CommentSection {
  private DatastoreService datastore;
  private int queryLimit;
  private int initialQueryLimit = 20;

  public CommentSection() {
    datastore = DatastoreServiceFactory.getDatastoreService();
    queryLimit = initialQueryLimit;
  }

  public void addComment(String title, String content, long timestamp) {
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("title", title);
    commentEntity.setProperty("content", content);
    commentEntity.setProperty("timestamp", timestamp);
    datastore.put(commentEntity);
  }

  public void editMaxComments(int max) {
    if (max < initialQueryLimit) {
      this.queryLimit = max;
    } else {
      this.queryLimit = initialQueryLimit;
    }
  }

  public void deleteComment(long id) {
    Key taskEntityKey = KeyFactory.createKey("Comment", id);
    datastore.delete(taskEntityKey);
  }

  public String getComments() {
    FetchOptions options = FetchOptions.Builder.withLimit(this.queryLimit);
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    QueryResultList<Entity> results = datastore.prepare(query).asQueryResultList(options);
    List<Comment> comments = new ArrayList<Comment>();

    for (Entity entity : results) {
      long id = entity.getKey().getId();
      String title = (String) entity.getProperty("title");
      String content = (String) entity.getProperty("content");
      long timestamp = (long) entity.getProperty("timestamp");

      Comment comment = new Comment(id, title, content, timestamp);
      comments.add(comment);
    }
    
    return convertToJson(comments);
  }

  private String convertToJson(List lst) {
    Gson gson = new Gson();
    String json = gson.toJson(lst);
    return json;
  }
}
