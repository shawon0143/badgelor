import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { AccountService } from '/imports/service/accountService';

import template from './sidebar.html';

@Component({
  selector: 'dashboard-sidebar',
  template

})



export class DashboardSidebar implements OnInit {

  constructor(public accountService: AccountService) {


  }

  ngOnInit() {


  } // end of ngOnInit



} // end of class DashboardSidebar
