function getServletData() {
  fetch('/data')
  	.then(response => response.text())
    .then((message) => {
    	document.getElementById('message-container').innerText = message;
  	});
}