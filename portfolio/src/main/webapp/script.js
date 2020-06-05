function getServletData() {
  fetch("/comments").then(response => response.json()).then((commentList) => {
  	const commentContainer = document.getElementById("comment-container");
    console.log(commentList);
    commentContainer.innerHTML = '';
    commentList.map((comment) => {
      createChildComment(commentContainer, comment);
    });
    drawGauge(commentList);
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
  date = date.toLocaleString('en-US', dateOptions);
  return date;
}

function getSentimentIcon(sentiment) {
  switch(sentiment) {
    case "positive" :
      return "🥰";
    case "negative" :
      return "🥱";
    default:
      return "🤔";
  }
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
          <strong>${comment.title}</strong> ${getSentimentIcon(comment.sentiment)}
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

google.charts.load('current', {'packages':['gauge']});

function getGaugeValue(commentList) {
  let rating = 50;
  commentList.forEach(comment => {
    if (comment.sentiment === "positive") {
      rating += 1;
    } else if (comment.sentiment === "negative") {
      rating -= 1;
    }
  });
  return rating;
}

function drawGauge(commentList) {
  
  let rating = getGaugeValue(commentList);
  let data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Comments Gauge', rating],
  ]);

  let options = {
    width: 100, height: 100,
    redFrom: 0, redTo: 25,
    yellowFrom: 25, yellowTo: 75,
    greenFrom: 75, greenTo: 100,
    minorTicks: 5
  };

  let chart = new google.visualization.Gauge(document.getElementById('gauge-chart'));

  chart.draw(data, options);
}

function updateMaxComments() {
  let val = document.getElementById("input-max-comments").value;
  document.getElementById("max-comments-form").setAttribute("action", "/edit?max_comments=" + val);
}
