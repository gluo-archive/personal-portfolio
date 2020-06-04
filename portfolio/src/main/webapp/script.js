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

function convertMillisToTimestamp(millis) {
  let date = new Date(millis);
  let dateOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  }
  date = date.toLocaleString('en-US', dateOptions)
  return date
}

function createChildComment(container, comment) {
  let div = document.createElement("div");
  container.appendChild(div);
  let timestamp = convertMillisToTimestamp(comment.timestamp);
  div.innerHTML =
  `
    <article class="media">  
      <div class="media-content">
        <p>
          <strong>${comment.title}</strong> 
          <br>
          <small class="has-text-grey-light">${timestamp}</small>
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
