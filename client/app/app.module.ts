import {NgModule, ErrorHandler} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AccountsModule} from 'angular2-meteor-accounts-ui';
import {LocalStorageModule} from 'angular-2-local-storage';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// modules for pages
import {HomePage} from '/client/pages/home';

import {AppComponent} from './app.component';


// global imports
import '/imports/startup/accounts-config.js';
import 'font-awesome/css/font-awesome.min.css';

const appRoutes: Routes = [
    {path: '', component: HomePage},
];

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        LocalStorageModule.withConfig({
            prefix: 'badgelor',
            storageType: 'localStorage'
        }),

        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        HomePage,

    ],
    bootstrap: [AppComponent],
    entryComponents: [

    ],
    providers: [

    ]
})
export class AppModule {
}
