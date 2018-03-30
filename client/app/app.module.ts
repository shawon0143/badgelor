import {NgModule, ErrorHandler} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AccountsModule} from 'angular2-meteor-accounts-ui';
import {LocalStorageModule} from 'angular-2-local-storage';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//==================
// modules for pages
//==================
// ******* Homepage **********
import {HomePage} from '/client/pages/homepage/home';
import {Navbar} from '/imports/components/navbar/navbar';
import {HomepageBannerTop} from '/client/pages/homepage/homepageBannerTop/homepageBannerTop';
import {HowItWorks} from '/client/pages/homepage/howBadgelorWorks/howBadgelorWorks';
import {InfoGraphic} from '/client/pages/homepage/infoGraphic/infoGraphic';

// ********* Component *******
import { LoginAndSignup } from '/imports/components/loginAndSignup/loginAndSignup';

import {AppComponent} from './app.component';

// ======================
// Services and Providers
// ======================
import {AccountService} from "/imports/service/accountService";

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
        AccountsModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        // homepage modules
        HomePage,
        Navbar,
        HomepageBannerTop,
        HowItWorks,
        InfoGraphic,

        LoginAndSignup,


    ],
    bootstrap: [AppComponent],
    entryComponents: [

    ],
    providers: [
      AccountService
    ]
})
export class AppModule {
}
