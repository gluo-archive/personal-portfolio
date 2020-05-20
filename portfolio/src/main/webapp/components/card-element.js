/**
    Component that conditionally renders a project experience based on link clicked.
    The html includes a css reference since LitElement creates a shadow DOM that doesn't listen to any external css. 
 */
import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class CardElement extends LitElement {
    static get properties() {
        return {
            projects: {type: Array},
            org: {type: String},
            description: {type: String},
            tags: {type: Array}
        };
    }
    constructor() {
        super();
        this.projects = 
            [
                {
                    "org":"Berkeleytime",
                    "description": "I have been working on Berkeleytime's frontend for the past two years. " + 
                        "I created a mobile version of the site (still in beta) with new components. " +
                        "In the process I worked with Redux for state management and built new Recharts graphs. " +
                        "I also created the landing page (with svg animation) and search bar component on the site. " +
                        "In the coming year I will be transitioning into product manager for Berkeleytime. ",
                    "tags": ["ReactJS","Redux","Recharts","Bootstrap", "Flexbox"]
                },
                {
                    "org":"CS189, Machine Learning",
                    "description": "I trained generative and discriminative models from scratch (ie only using Numpy) " +
                        "including Quadratic Discriminant Analysis, Logistic Regression, Random Forests, and Recurrent Neural Networks. " +
                        "I was ranked 17/733 in the course's Kaggle competition for the WINE dataset. ",
                    "tags": ["Gaussian Discriminant Analysis", "Regression","Decision Trees", "Neural Networks", "Numpy"]
                },
                {
                    "org":"CS170, Algorithms",
                    "description": "I created an approximation algorithm for the NP-hard problem " +
                        "of determining a dominating tree of a network with minimum pairwise distance. " +
                        "The algorithm was a modified version of Prim's combined with a local search postprocessing algorithm to escape from local optima. " +
                        "My team was ranked 23/309 in the course. ",
                    "tags": ["Greedy Algorithms", "NetworkX"]
                }
            ]
        this.org = this.projects[0].org;
        this.description = this.projects[0].description;
        this.tags = this.projects[0].tags;
    }

    render() {
        return html`        
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.2/css/bulma.css" />            
            <div>
                <header class="card-header">
                    <p class="card-header-title">Project Experience</p>
                </header>
                <div class="card-content">
                    <div class="content">
                        <p><u>${this.org}</u></p>
                        <p>${this.description}</p>
                        <div class="tags">
                            ${this.tags.map(tag =>
                                html`<span class="tag is-link is-normal">${tag}</span>`
                            )}
                        </div>
                    </div>
                </div>
                <footer class="card-footer">
                    ${this.projects.map((project, index) =>
                        html`<a class="card-footer-item" @click=${() => this.toggleCard(index)}>${project.org}</a>`
                    )}
                </footer>
            </div>
        `;
    }

    toggleCard(index) {
        this.org = this.projects[index].org;
        this.description = this.projects[index].description;
        this.tags = this.projects[index].tags;
    }


}
customElements.define('card-element', CardElement);