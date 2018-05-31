import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MarkdownModule } from 'angular2-markdown';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//==================
// modules for pages
//==================
// ******* Homepage **********
import { HomePage } from '/client/pages/homepage/home';
import { HomepageBannerTop } from '/client/pages/homepage/homepageBannerTop/homepageBannerTop';
import { HowItWorks } from '/client/pages/homepage/howBadgelorWorks/howBadgelorWorks';
import { InfoGraphic } from '/imports/components/infoGraphic/infoGraphic';
import { ContactUs } from '/client/pages/homepage/contactUs/contactUs';
import { AboutUs } from '/client/pages/homepage/aboutUs/aboutUs';
import { Footer } from '/client/pages/homepage/footer/footer';

// ===============
// Applicant pages
// ===============
import { ApplicantProfile } from '/client/pages/applicant/applicantProfile';
import { AccountOverview } from '/imports/components/applicant/accountOverview/accountOverview';
import { BadgeApplications } from '/imports/components/applicant/badgeApplications/badgeApplications';
import { EarnedBadges } from '/imports/components/applicant/earnedBadges/earnedBadges';
import { ShareBadge } from '/imports/components/applicant/shareBadge/shareBadge';
import { BadgeWishList } from '/imports/components/applicant/badgeWishlist/badgeWishlist';
import { ProfileSettings } from '/imports/components/applicant/profileSettings/profileSettings';

// =====================
// Badge related pages
// =====================
import { EarnableBadges } from '/client/pages/badges/earnableBadges';
import { SingleBadgeModal } from "/imports/components/badge/singleBadgeModal/singleBadgeModal";
import { ApplyBadgeModal } from "/imports/components/badge/applyBadgeModal/applyBadgeModal";


// =====================
// Dashboard Panel =====
// =====================
import { DashboardOverview } from '/client/pages/dashboard/overview/dashboard-overview';
import { UserManagement } from '/client/pages/dashboard/userManagement/userManagement';

import { DashboardStatistics } from '/imports/components/dashboard/statistics/statistics';
import { DashboardSidebar } from '/imports/components/dashboard/sidebar/sidebar';


// ===============
// 404 not found
// ===============
import { Four04Component } from '/client/pages/four04/route-404';

// ********* Component *******
import { AppComponent } from './app.component';
import { Navbar } from '/imports/components/navbar/navbar';
import { LoginAndSignup } from '/imports/components/loginAndSignup/loginAndSignup';




// ======================
// Services and Providers
// ======================
import { AccountService } from "/imports/service/accountService";
import { OnlyLoggedInUsersGuard } from "/imports/service/onlyLoggedInUsersGuard";
import { OnlyAuthorisedUserGuard } from "/imports/service/onlyAuthorisedUserGuard";
import { AutoLogoutService } from "/imports/service/autoLogout";
import { ApplicantProfileService } from "/imports/service/applicantProfileService";
import { BadgeService } from "/imports/service/badgeService";
import { AuthService } from "/imports/service/authService"; // no longer in use, we might use it if we can use angular httpClient


// ========================
// Custom Pipes ===========
// ========================
import { SafePipe } from "/imports/pipes/fixIframe.pipe.ts";


// global imports
import '/imports/startup/accounts-config.js';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';

const appRoutes: Routes = [
    {path: '', component: HomePage},
    // ==============================
    // all my profile related routes
    // ==============================
    { path: 'myprofile/:id',
      component: ApplicantProfile,
      // for canActivate to work properly we build OnlyLoggedInUsersGuard service
      canActivate: [OnlyLoggedInUsersGuard],
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview', component: AccountOverview },
        { path: 'applications', component: BadgeApplications },
        { path: 'earnedbadges', component: EarnedBadges },
        { path: 'shareBadge', component: ShareBadge },
        { path: 'wishlist', component: BadgeWishList },
        { path: 'settings', component: ProfileSettings }
    ] },
    // =============================
    // All badge related routes ====
    // =============================
    { path: 'earnableBadges', component: EarnableBadges },

    // =============================
    // All Dashboard related routes
    // =============================
    { path: 'dashboard',
      component: DashboardOverview,
      canActivate: [OnlyAuthorisedUserGuard],
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview', component: DashboardStatistics },
        { path: 'users', component: UserManagement },
        // { path: 'issuerTools', component: IssuerTools },
        // { path: 'reports', component: Reports },
        // { path: 'campus', component: CampusManagement },
        // { path: 'faculty', component: FacultyManagement },
        // { path: 'institutes', component: InstitutesManagement },
        // { path: 'courses', component: CoursesManagement },
        // { path: 'levels', component: LevelsManagement },
        // { path: 'competency', component: CompetencyManagement },
        // { path: 'tools', component: ToolsManagement },
        // { path: 'createNewBadge', component: AddNewBadge },
        // { path: 'importBadge', component: ImportBadge },
        // { path: 'viewAllBadge', component: ViewAllBadge }
      ] },

    // =============================
    // 404 Component
    // =============================
    { path: 'not-found', component: Four04Component },
    { path: '**', redirectTo: "/not-found" }
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
        BrowserAnimationsModule,
        MarkdownModule.forRoot(),
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
        // badge related module
        EarnableBadges,
        SingleBadgeModal,
        ApplyBadgeModal,
        // Applicant modules
        ApplicantProfile,
        AccountOverview,
        BadgeApplications,
        EarnedBadges,
        ShareBadge,
        BadgeWishList,
        ProfileSettings,
        // Dashboard modules
        DashboardOverview,
        UserManagement,
        DashboardStatistics,
        DashboardSidebar,
        //Pipes
        SafePipe,
        // 404
        Four04Component


    ],
    bootstrap: [AppComponent],
    entryComponents: [

    ],
    providers: [
      AccountService,
      OnlyLoggedInUsersGuard,
      OnlyAuthorisedUserGuard,
      AutoLogoutService,
      ApplicantProfileService,
      BadgeService,
      AuthService, // no longer in use, we might use it if we can use angular httpClient

    ]
})
export class AppModule {
}
