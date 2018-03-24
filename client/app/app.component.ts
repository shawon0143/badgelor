import 'zone.js';
import 'reflect-metadata';
import {Component} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import template from '/client/app/app.html'


@Component({
    selector: 'app-root',
    template
    
})
export class AppComponent {

    constructor(

      )
      {

      }

      ngOnInit() {

      } // end of ngOnInit
}
