import 'zone.js';
import 'reflect-metadata';
import './polyfills';
import 'bootstrap/dist/js/bootstrap.bundle'; // need to add this line for bootstrap4 to work properly


import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { AppModule } from '/client/app/app.module';
import {enableProdMode} from '@angular/core';
//enableProdMode();

  Meteor.startup(() => {

    if (Meteor.isProduction) {
      enableProdMode();
    }

    platformBrowserDynamic().bootstrapModule(AppModule);

  });
