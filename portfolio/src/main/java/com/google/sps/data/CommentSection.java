package com.google.sps.data;

import com.google.gson.Gson;
import java.util.ArrayList;

public class CommentSection {
  private ArrayList<String> comments = new ArrayList<String>();

  public void addComment(String comment) {
    comments.add(comment);
  }

  public String getComments() {
    return convertToJson(comments);
  }

  private String convertToJson(ArrayList<String> lst) {
    Gson gson = new Gson();
    String json = gson.toJson(lst);
    return json;
  }
}