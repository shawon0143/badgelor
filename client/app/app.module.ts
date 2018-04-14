import {NgModule, ErrorHandler} from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
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
import {HomepageBannerTop} from '/client/pages/homepage/homepageBannerTop/homepageBannerTop';
import {HowItWorks} from '/client/pages/homepage/howBadgelorWorks/howBadgelorWorks';
import {InfoGraphic} from '/imports/components/infoGraphic/infoGraphic';
import {ContactUs} from '/client/pages/homepage/contactUs/contactUs';
import {AboutUs} from '/client/pages/homepage/aboutUs/aboutUs';
import {Footer} from '/client/pages/homepage/footer/footer';

// ===============
// Applicant pages
// ===============
import {ApplicantProfile} from '/client/pages/applicant/applicantProfile';

// ********* Component *******
import {AppComponent} from './app.component';
import {Navbar} from '/imports/components/navbar/navbar';
import { LoginAndSignup } from '/imports/components/loginAndSignup/loginAndSignup';



// ======================
// Services and Providers
// ======================
import { AccountService } from "/imports/service/accountService";
import { AutoLogoutService } from "/imports/service/autoLogout";
import { AuthService } from "/imports/service/authService"; // no longer in use, we might use it if we can use angular httpClient

// global imports
import '/imports/startup/accounts-config.js';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';

const appRoutes: Routes = [
    {path: '', component: HomePage},
    {path: 'myprofile', component: ApplicantProfile}
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
        ContactUs,
        AboutUs,
        Footer,
        LoginAndSignup,
        // Applicant modules
        ApplicantProfile


    ],
    bootstrap: [AppComponent],
    entryComponents: [

    ],
    providers: [
      AccountService,
      AutoLogoutService,
      AuthService // no longer in use, we might use it if we can use angular httpClient
    ]
})
export class AppModule {
}
