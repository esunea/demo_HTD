import { Component } from '@angular/core';

/**
 * Generated class for the GraphComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'graph',
  templateUrl: 'graph.html'
})
export class GraphComponent {

  text: string;

  constructor() {
    console.log('Hello GraphComponent Component');
    this.text = 'Hello World';
  }

}
