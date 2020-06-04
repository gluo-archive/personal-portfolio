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
import com.google.sps.servlets.CommentServlet;

@WebServlet("/edit")
public class EditCommentServlet extends HttpServlet {
  private static CommentSection commentSection = CommentServlet.getCommentSection();

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String query = request.getQueryString();
    String[] queryArr = query.split("=");
    if (queryArr != null && queryArr.length > 1) {
      try {
        int queryLimit = Integer.parseInt(queryArr[1]);
        commentSection.editMaxComments(queryLimit);
      } catch(NumberFormatException e) {
        System.out.println("Please only enter numbers for max comments!");
      }
    }
    response.sendRedirect("/?");
  }
}
