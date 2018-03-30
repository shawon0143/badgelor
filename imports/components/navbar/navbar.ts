import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';

import { AccountService } from '/imports/service/accountService';

import template from './navbar.html';

@Component({
  selector: 'navbar-top',
  template
})



export class Navbar implements OnInit {


  constructor(public accountService: AccountService) {

  }

  ngOnInit() {

  } // end of ngOnInit


} // end of class Navbar
