import 'zone.js';
import 'reflect-metadata';
import {Component} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import template from '/client/app/app.html'
import { AccountService } from '/imports/service/accountService';


@Component({
    selector: 'app-root',
    template

})
export class AppComponent {

    constructor(public accountService: AccountService) {

    }

    ngOnInit() {

    } // end of ngOnInit
}
