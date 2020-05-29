/**
    Game. 
 */
import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class GameComponent extends LitElement {
  static get properties() {
    return {
      boardLength: {type: Number},
      boardIndices: {type: Array},
      board: {type: Array}, // 1D array of length boardSize * boardSize
      wordArrays: {type: Array},
      baseWords: {type: Array},
      selectedWords: {type: Set},
      selectedSet: {type: Set},
      numSolved: {type: Number},
      solvedColors: {type: Array},
      defaultColor: {type: String},
    };
  }

  constructor() {
    super();
    this.boardLength = 5;
    this.wordArrays = [];
    this.selectedWords = new Set();
    this.selectedSet = new Set();
    this.numSolved = 0;

    // The first color is the default tile color
    this.solvedColors = ["#e67e22", "#8e44ad", "#2ecc71", "#e74c3c", "#f1c40f", "#16a085", "#d35400", "#9b59b6", "#c0392b"];
    this.defaultColor = "#ffffff";
    this.boardIndices = [];
    for(let i=0; i<this.boardLength; i+=1) {
      this.boardIndices.push(i);
    }
  
  	this.initializeBaseWords();
    this.newBoard();
  }

  render() {
    return html`        
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.2/css/bulma.css" />
      <link rel="stylesheet" href="style.css">            
      <div>
      	<p class="title">WordSet Game</p>
        <p>If you think that certain tiles are associated, click on them to create a set! 
        Sets range from size 1 to ${this.boardLength}. Please wait until the board has finished building 
        if the cards display "--". </p>
      	<div id="board">
          ${this.boardIndices.map(i =>
            html`
              <div class="tile is-ancestor">
                ${this.boardIndices.map(j => {
                	let boardWord = this.board[this.boardLength*i+j];
                  return html`
                    <button class="tile card" id=${boardWord} @click=${() => this.handleSelection(this.board[this.boardLength*i+j])}>
                      <div class="card-content">
                        <p>${boardWord}</p>
                      </div>
                    </button>
                  `
                })}
           	  </div>
            `
          )}
        </div>
      </div>
    `;
  }

	initializeTiles(newWord) {
    for(const wordArray of this.wordArrays) {
      if(wordArray.indexOf(newWord) > -1) {
      	this.selectedSet = new Set(wordArray);
      }
    }
    this.colorTile(newWord);
    console.log(this.selectedSet);
  }

	allTiles(action) {
    for (const word of this.selectedWords) {
      let tile = this.shadowRoot.getElementById(word);
      if (action === "lock") {
        tile.disabled = true;
      } else if (action === "void") {
        tile.style.background = this.defaultColor;
      }
    }
    this.selectedWords = new Set();
    this.selectedSet = new Set();
  }

  lockTiles() {
    this.allTiles("lock");
    this.numSolved += 1;
  }

  colorTile(newWord) {
    let tileColor = this.solvedColors[this.numSolved % this.solvedColors.length];
    let tile = this.shadowRoot.getElementById(newWord);
    tile.style.background = tileColor;
  }

  voidTiles() {
    this.allTiles("void");
  }

  handleSelection(newWord) {
    this.selectedWords.add(newWord);
    if(this.selectedSet.size === 0) {
      this.initializeTiles(newWord);
    } else if (this.equalSets(this.selectedWords, this.selectedSet)) {
      this.colorTile(newWord);
      this.lockTiles();
    } else if (this.selectedSet.has(newWord)) {
      this.colorTile(newWord);
    } else {
      this.voidTiles();
    }
  }

	equalSets(setA, setB) {
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

	// Random int between min (inclusive) and max (exclusive)
	randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } 

  shuffle(arr) {
    return arr
      .map((item) => ({key: Math.random(), value: item}))
      .sort((itemOne, itemTwo) => itemOne.key - itemTwo.key)
      .map((item) => item.value)
  }

  readTxt(filePath){
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

	initializeBaseWords() {
    let nounList = this.readTxt("../assets/nouns.txt");
    this.baseWords = nounList.split("\n");
    this.baseWords = this.shuffle(this.baseWords);
  }

  retrieveJSON(url) {
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

  async collectWords(url) {
    let wordArray = await this.retrieveJSON(url);
    let words = wordArray.map(wordInfo => wordInfo["word"]);
    return words;
  }	
  
	async createwordArrays() {
    let numFreeTiles = this.boardLength * this.boardLength;
    for (const topic of this.baseWords) {
      if (numFreeTiles > 0) {
        let maxSize = Math.min(numFreeTiles, this.randomInt(2, this.boardLength)); 
        let setURL = "https://api.datamuse.com/words?topics=" + topic + "&max=" + maxSize; 
        let newSet = await this.collectWords(setURL);
        this.wordArrays.push(newSet);
        numFreeTiles -= newSet.length;
        const index = this.baseWords.indexOf(topic);
        this.baseWords.splice(index, 1);
      }
    }
  } 

	// Use async and await since retrieveJSON returns a Promise until resolved
  async newBoard() {
    this.board = [];
    for (let i=1; i<=this.boardLength * this.boardLength; i++) {
      this.board.push("--")
    }
	
    await this.createwordArrays();
    this.board = this.wordArrays.reduce(function(arrOne, arrTwo){return arrOne.concat(arrTwo);}, []); // Flatten 2D array
    this.board = this.shuffle(this.board);
  }
  
}
customElements.define('game-component', GameComponent);
