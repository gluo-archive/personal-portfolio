function getServletData() {
  console.log('running');
  fetch("/data").then(response => response.json()).then((commentList) => {
  	const commentListElement = document.getElementById("comment-container");
    console.log(commentList);
    commentListElement.innerHTML = '';
    commentList.map((comment) => {
      commentListElement.appendChild(
          createListElement(comment));
      });
    });
}

/** Create an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement("li");
  liElement.innerText = text;
  return liElement;
}