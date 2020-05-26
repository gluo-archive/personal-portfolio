/**
    Card that displays project experiences.
 */
import {ToggleCard} from './toggle-card.js';

export class ProjectCard extends ToggleCard {
    constructor() {
        super();
        this.items = 
            [
                {
                    "label":"Berkeleytime",
                    "description": "I have been working on Berkeleytime's frontend for the past two years. " + 
                        "I created a mobile version of the site (still in beta) with new components. " +
                        "In the process I worked with Redux for state management and built new Recharts graphs. " +
                        "I also created the landing page (with svg animation) and search bar component on the site. " +
                        "In the coming year I will be transitioning into product manager for Berkeleytime. ",
                    "tags": ["ReactJS","Redux","Recharts","Bootstrap", "Flexbox"]
                },
                {
                    "label":"CS189, Machine Learning",
                    "description": "I trained generative and discriminative models from scratch (ie only using Numpy) " +
                        "including Quadratic Discriminant Analysis, Logistic Regression, Random Forests, and Recurrent Neural Networks. " +
                        "I was ranked 17/733 in the course's Kaggle competition for the WINE dataset. ",
                    "tags": ["Gaussian Discriminant Analysis", "Regression","Decision Trees", "Neural Networks", "Numpy"]
                },
                {
                    "label":"CS170, Algorithms",
                    "description": "I created an approximation algorithm for the NP-hard problem " +
                        "of determining a dominating tree of a network with minimum pairwise distance. " +
                        "The algorithm was a modified version of Prim's combined with a local search postprocessing algorithm to escape from local optima. " +
                        "My team was ranked 23/309 in the course. ",
                    "tags": ["Greedy Algorithms", "NetworkX"]
                }
            ];
        this.label = this.items[0].label;
        this.description = this.items[0].description;
        this.tags = this.items[0].tags;
    }
}
customElements.define('project-card', ProjectCard);