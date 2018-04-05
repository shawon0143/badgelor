import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { LocalStorageService } from 'angular-2-local-storage';
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
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor( public accountService: AccountService,  public localStorageService: LocalStorageService) {

  }

  ngOnInit() {


  } // end of ngOnInit


} // end of class LoginAndSignup
