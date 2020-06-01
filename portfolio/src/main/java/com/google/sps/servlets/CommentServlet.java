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

package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.sps.data.CommentSection;

/** Servlet for comment POST and GET request */
@WebServlet("/comments")
public class CommentServlet extends HttpServlet {
  private CommentSection commentSection = new CommentSection();

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String title = request.getParameter("input-title");
    String content = request.getParameter("input-content");
    long timestamp = System.currentTimeMillis();

    if(validInput(title) && validInput(content)) {
      commentSection.addComment(title, content, timestamp);
    }
    
    response.sendRedirect("/?");
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String comments = commentSection.getComments();
    response.setContentType("application/json;");
    response.getWriter().println(comments);
  }
  
  private boolean validInput(String str) {
    return str != null && !str.isEmpty();
  }
}
