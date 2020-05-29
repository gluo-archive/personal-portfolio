/**
*    WordGroup game. Pulls words from nouns.txt as base words, then uses them as search topics in the DataMuse API. 
*    The user clicks on words they think are associated.  
*/
import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {equalSets, randomInt, shuffle, flatten, containsElement, isIterable, readTxt, fetchJSON} from './utils.js';

export class GameComponent extends LitElement {
  static get properties() {
    return {
      boardLength: {type: Number},
      board: {type: Array},
      wordArrays: {type: Array}, 
      baseWords: {type: Array}, 
      selectedWords: {type: Set},
      selectedSet: {type: Set}, 
      groupsSolved: {type: Number},
      gamesSolved: {type: Number},
      solvedColors: {type: Array},
      defaultColor: {type: String},
      placeholder: {type: String},
      errorMessage: {type: String},
    };
  }

  constructor() {
    super();
    this.boardLength = 5;
    this.wordArrays = [];
    this.selectedWords = new Set();
    this.selectedSet = new Set();
    this.groupsSolved = 0;
    this.gamesSolved = 0;
    this.placeholder = "--";
    this.errorMessage = "";

    this.solvedColors = ["#e67e22", "#8e44ad", "#2ecc71", "#e74c3c", "#f1c40f", "#16a085", "#d35400", "#9b59b6", "#c0392b"];
    this.defaultColor = "#ffffff";
  
    this.initializeBaseWords();
    this.newBoard();
  }

  render() {
    const boardIndices = [...Array(this.boardLength).keys()];
    return html`        
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.2/css/bulma.css" />
      <link rel="stylesheet" href="style.css">            
      <div>
        <p class="title">WordGroup Game</p>
        <p>If you think that certain tiles are associated, click on them to create a group! 
        Groups range from size 1 to ${this.boardLength}. Please wait until the board has finished building 
        if the cards display ${this.placeholder}. </p>
        <p class="has-text-danger">${this.errorMessage}</p>
        <div id="board">
          <div class="columns">
            <div class="column">
              <p>Games solved: ${this.gamesSolved}</p>
              <p>Groups found this game: ${this.groupsSolved}</p>
            </div>
            <div class="column">
        		  <button class="button is-link is-pulled-right" @click=${this.clearGame}> New Game </button>
            </div>
          </div>
          ${boardIndices.map(i =>
            html`
              <div class="tile is-ancestor">
                ${boardIndices.map(j => {
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

  findGroup(newWord) {
    for(const wordArray of this.wordArrays) {
      if(containsElement(wordArray, newWord)) {
        this.selectedSet = new Set(wordArray);
      }
    }
    this.colorTile(newWord);
    console.log(this.selectedSet);
  }

  changeGroup(action, group) {
    if (isIterable(group)) {
      for (const word of group) {
        let tile = this.shadowRoot.getElementById(word);
        if (tile) {
          if (action === "lock") {
            tile.disabled = true;
          } else if (action === "void") {
            tile.style.background = this.defaultColor;
            tile.disabled = false;
          }
        }
      }
    }
    this.selectedWords = new Set();
    this.selectedSet = new Set();
  }

  lockGroup() {
    this.changeGroup("lock", this.selectedWords);
    this.groupsSolved += 1;
  }

  colorTile(newWord) {
    let tileColor = this.solvedColors[this.groupsSolved % this.solvedColors.length];
    let tile = this.shadowRoot.getElementById(newWord);
    tile.style.background = tileColor;
  }

  voidGroup() {
    this.changeGroup("void", this.selectedWords);
  }

  finishGame() {
    this.gamesSolved += 1;
    this.changeGroup("void", this.board);
    this.newBoard();
  }

  clearGame() {
    this.changeGroup("void", this.board);
    this.newBoard();
  }

  handleSelection(newWord) {
    if (newWord !== this.placeholder) {
      this.selectedWords.add(newWord);
      if(this.selectedSet.size === 0) {
        this.findGroup(newWord);
      } else if (equalSets(this.selectedWords, this.selectedSet)) {
        this.colorTile(newWord);
        this.lockGroup();
      } else if (containsElement(this.selectedSet, newWord)) {
        this.colorTile(newWord);
      } else {
        this.voidGroup();
      }
      if (this.groupsSolved === this.wordArrays.length) {
        this.finishGame();
      }
    }
  }

  initializeBaseWords() {
    let nounList = readTxt("../assets/nouns.txt");
    this.baseWords = nounList.split("\n");
    this.baseWords = shuffle(this.baseWords);
  }

  async collectWords(url) {
    try {
      let wordArray = await fetchJSON(url);
      let words = wordArray.map(wordInfo => wordInfo["word"]);
      return words;
    } catch(e) {
      this.errorMessage = "Oh no! We couldn't fetch the words from the database. Please try again in 10 minutes.";
    }
  }	
  
  async createwordArrays() {
    let numFreeTiles = this.boardLength * this.boardLength;
    for (const topic of this.baseWords) {
      if (numFreeTiles > 0) {
        let maxSize = Math.min(numFreeTiles, randomInt(2, this.boardLength)); 
        let groupURL = "https://api.datamuse.com/words?topics=" + topic + "&max=" + maxSize; 
        let newGroup = await this.collectWords(groupURL);
        this.wordArrays.push(newGroup);
        numFreeTiles -= newGroup.length;
        const index = this.baseWords.indexOf(topic);
        this.baseWords.splice(index, 1);
      }
    }
  } 

  async newBoard() {
    this.groupsSolved = 0;
    this.board = [];
    for (let i=1; i<=this.boardLength * this.boardLength; i++) {
      this.board.push(this.placeholder)
    }
    this.baseWords = shuffle(this.baseWords);
    await this.createwordArrays();
    this.board = flatten(this.wordArrays);
    this.board = shuffle(this.board);
  }
  
}
customElements.define('game-component', GameComponent);
