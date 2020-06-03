function getServletData() {
  fetch("/comments").then(response => response.json()).then((commentList) => {
  	const commentContainer = document.getElementById("comment-container");
    console.log(commentList);
    commentContainer.innerHTML = '';
    commentList.map((comment) => {
      createChildComment(commentContainer, comment);
    });
  });
}

function createChildComment(container, comment) {
  var div = document.createElement("div");
  container.appendChild(div);
  div.innerHTML =
  `
    <article class="media">  
      <div class="media-content">
        <p>
          <strong>${comment.title}</strong> <small>${comment.timestamp}</small>
          <br>
          ${comment.content}
        </p>
      </div>
      <div class="media-right">
        <button class="delete" name="delete" value="${comment.id}"></button>
      </div>
    </article>
  `
}

function updateMaxComments() {
  let val = document.getElementById("input-max-comments").value;
  document.getElementById("max-comments-form").setAttribute("action", "/edit?max_comments=" + val);
}
