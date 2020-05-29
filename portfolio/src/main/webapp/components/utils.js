export function equalSets(setA, setB) {
    if (setA.size !== setB.size) { 
      return false;
    }
    for (let a of setA) {
      if (!setB.has(a)) {
        return false;
      }
    }
    return true;
  }

// Return random int between min (inclusive) and max (exclusive)
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 

export function shuffle(arr) {
  return arr
    .map((item) => ({key: Math.random(), value: item}))
    .sort((itemOne, itemTwo) => itemOne.key - itemTwo.key)
    .map((item) => item.value)
}

export function flatten(arr) {
  return arr.reduce(function(arrOne, arrTwo){
    return arrOne.concat(arrTwo);
  }, []);
}

export function containsElement(obj, el) {
	if (obj.constructor === Array) {
    return obj.indexOf(el) > -1;
  } else if (obj.constructor === Set) {
    return obj.has(el);
  } else {
    throw new Error("Unimplemented data type for containsElement.");
  }
}

// Read a local txt
export function readTxt(filePath){
  let text = "";
  try {
    let request = new XMLHttpRequest();
    request.open("GET", filePath, false);
    request.send(null);
    text = request.responseText;
  } catch(error) {
    throw error;
  }
  return text;
}

// Fetch JSON from api call; use async and await since it returns a Promise until resolved
export function fetchJSON(url) {
  const proxyURL = "https://cors-anywhere.herokuapp.com/"; // Bypass 'Access-Control-Allow-Origin' error in development
  return fetch(proxyURL + url)
    .then(res => {
      return res.json()
    })
    .then((out) => {
      return out;
    })
    .catch(err => { 
      throw err; 
    });
}
