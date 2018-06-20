import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { AccountService } from '/imports/service/accountService';
import { TranslatorService } from '/imports/service/translatorService';

import { trigger, state, style, animate, transition } from '@angular/animations';


import template from './infoGraphic.html';


@Component({
  selector: 'infoGraphic-component',
  template,
  animations: [
  trigger('scrollAnimation', [
    state('show', style({
      opacity: 1,
      transform: "translateX(0)"
    })),
    state('hide',   style({
      opacity: 0,
      transform: "translateX(-100%)"
    })),
    transition('show => hide', animate('600ms ease-out')),
    transition('hide => show', animate('600ms ease-in'))
  ])
]
})



export class InfoGraphic {
  // output is used to communicate from child to parent via event emitter
  // reference - https://www.concretepage.com/angular-2/angular-2-input-and-output-example#input
  @Output() signupButtonClicked = new EventEmitter<{}>();

  state = 'hide';

  constructor(public accountService: AccountService,
              public el: ElementRef,
            public translatorService: TranslatorService) {

  }

  @HostListener('window:scroll', ['$event'])
   checkScroll() {
     const componentPosition = this.el.nativeElement.offsetTop
     const scrollPosition = window.pageYOffset

     if (scrollPosition+450 >= componentPosition) {
       this.state = 'show'
     } else if (scrollPosition+550 <= componentPosition){
       this.state = 'hide'
     }

   }

  signupNow() {
    this.signupButtonClicked.emit({});
  }

  ngOnInit() {

  }

} // end of class InfoGraphic
