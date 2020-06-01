package com.google.sps.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.util.List;
import java.util.ArrayList;

/** Class that handles the saving and returning of comments, currently implemented with DataStore */
public class CommentSection {
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  public void addComment(String title, String content, long timestamp) {
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("title", title);
    commentEntity.setProperty("content", content);
    commentEntity.setProperty("timestamp", timestamp);
    datastore.put(commentEntity);
  }

  public String getComments() {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);
    List<Comment> comments = new ArrayList<Comment>();

    for (Entity entity : results.asIterable()) {
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
