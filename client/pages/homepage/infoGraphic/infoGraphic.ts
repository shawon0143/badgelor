import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';

import template from './infoGraphic.html';


@Component({
  selector: 'infoGraphic-component',
  template
})



export class InfoGraphic implements OnInit {
  // output is used to communicate from child to parent via event emitter
  @Output() signupButtonClicked = new EventEmitter<{}>();

  constructor() {

  }

  signupNow() {
    this.signupButtonClicked.emit({});
  }

  ngOnInit() {

  }

} // end of class InfoGraphic
