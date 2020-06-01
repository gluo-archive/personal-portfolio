function getServletData() {
  console.log('running');
  fetch("/data").then(response => response.json()).then((commentList) => {
  	const commentContainer = document.getElementById("comment-container");
    console.log(commentList);
    commentContainer.innerHTML = '';
    commentList.map((comment) => {
      createChildComment(commentContainer, comment);
    });
  });
}

/** Create */
function createChildComment(container, comment) {
  var div = document.createElement("div");
  container.appendChild(div);
  div.innerHTML =
  `
    <article class="media">  
      <p>
        <strong>${comment.title}</strong> <small>${comment.timestamp}</small>
        <br>
        ${comment.content}
      </p>
    </article>
  `
}