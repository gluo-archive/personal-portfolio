/**
 *    Card that toggles between different text descriptions based on the link
 * clicked. The html includes a css reference since LitElement creates a shadow
 * DOM that doesn't listen to any external css. Description must fit within a
 * 200px tall box.
 */
import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class ToggleCard extends LitElement {
  static get properties() {
    return {
      items: {type: Array},
      label: {type: String},
      description: {type: String},
      tags: {type: Array}
    };
  }

  constructor() {
    super();
    this.items = [];
    this.label = '';
    this.description = '';
    this.tags = [];
  }

  render() {
    return html`        
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.2/css/bulma.css" />
      <link rel="stylesheet" href="style.css">               
      <div>
        <header class="card-header">
          <p class="card-header-title">Project Experience</p>
        </header>
        <div class="card-content">
          <div class="content">
            <p><u>${this.label}</u></p>
            <p class="toggle-description">${this.description}</p>
            <div class="tags">
              ${
        this.tags.map(
            tag => html`<span class="tag is-link is-normal">${tag}</span>`)}
            </div>
          </div>
        </div>
        <footer class="card-footer">
          ${
        this.items.map(
            (item, index) => html`<a class="card-footer-item" @click=${
                () => this.toggle(index)}>${item.label}</a>`)}
        </footer>
      </div>
    `;
  }

  toggle(index) {
    this.label = this.items[index].label;
    this.description = this.items[index].description;
    this.tags = this.items[index].tags;
  }
}
customElements.define('toggle-card', ToggleCard);
