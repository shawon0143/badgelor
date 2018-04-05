import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { AccountService } from '/imports/service/accountService';

import template from './navbar.html';

@Component({
  selector: 'navbar-top',
  template,
  animations: [
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('fadeInAnimation', [
      // route 'enter' transition
      transition(':enter', [
        // css styles at start of transition
        style({ opacity: 0 }),
        // animation and styles at end of transition
        animate(".3s", style({ opacity: 1 }))
      ]),
      transition(":leave", [
        animate(".3s", style({ opacity: 0 }))
      ])
    ])
  ]

})



export class Navbar implements OnInit {


  constructor(public accountService: AccountService) {

  }

  ngOnInit() {

  } // end of ngOnInit


} // end of class Navbar
