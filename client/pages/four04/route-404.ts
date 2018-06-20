import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from "/imports/service/accountService"

import template from '/client/pages/four04/route-404.html';


@Component({
  selector: 'route-404',
  template
})



export class Four04Component implements OnInit, OnDestroy {

  // This variable can be used to show the URL that
  // is not accesssible .
  route404 : string;

  constructor(private route : ActivatedRoute, public accountService: AccountService) {

    // console.log(this.route.snapshot.url[0].path);
    this.route404 = this.route.snapshot.url[0].path;

  } //end of constructor

  ngOnInit() {

  } // end of ngOnInit


ngOnDestroy () {
} //end of ngOnDestroy


} // end of class Four04Component
