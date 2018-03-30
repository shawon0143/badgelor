import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';

import { AccountService } from '/imports/service/accountService';

import template from './loginAndSignup.html';


@Component({
  selector: 'login-signup',
  template,
  animations: [
   trigger('loginViewAnimation', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
   ])
  ]
})



export class LoginAndSignup implements OnInit {


  constructor( public accountService: AccountService) {

  }

  ngOnInit() {


  } // end of ngOnInit


} // end of class LoginAndSignup
