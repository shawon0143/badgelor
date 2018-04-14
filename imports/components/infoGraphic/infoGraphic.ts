import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { AccountService } from '/imports/service/accountService';

import template from './infoGraphic.html';


@Component({
  selector: 'infoGraphic-component',
  template
})



export class InfoGraphic {
  // output is used to communicate from child to parent via event emitter
  // reference - https://www.concretepage.com/angular-2/angular-2-input-and-output-example#input
  @Output() signupButtonClicked = new EventEmitter<{}>();

  constructor(public accountService: AccountService,) {

  }

  signupNow() {
    this.signupButtonClicked.emit({});
  }

  ngOnInit() {

  }

} // end of class InfoGraphic
