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
import { HomepageBannerTop } from '/imports/components/homepage/homepageBannerTop/homepageBannerTop';
import { HowItWorks } from '/imports/components/homepage/howBadgelorWorks/howBadgelorWorks';
import { InfoGraphic } from '/imports/components/homepage/infoGraphic/infoGraphic';
import { ContactUs } from '/imports/components/homepage/contactUs/contactUs';
import { AboutUs } from '/imports/components/homepage/aboutUs/aboutUs';
import { Footer } from '/imports/components/homepage/footer/footer';

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
import { DashboardHome } from '/client/pages/dashboard/dashboard-home';
import { DashboardStatistics } from '/imports/components/dashboard/statistics/statistics';
import { DashboardSidebar } from '/imports/components/dashboard/sidebar/sidebar';

import { UserManagement } from '/imports/components/dashboard/userManagement/userManagement';
import { CampusManagement } from '/imports/components/dashboard/campusManagement/campusManagement';
import { FacultyManagement } from '/imports/components/dashboard/facultyManagement/facultyManagement';
import { InstituteManagement } from '/imports/components/dashboard/instituteManagement/instituteManagement';
import { CourseManagement } from '/imports/components/dashboard/courseManagement/courseManagement';


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
import { SearchUserService } from "/imports/service/searchUserService";
import { TranslatorService } from "/imports/service/translatorService";
import { OnlyLoggedInUsersGuard } from "/imports/service/onlyLoggedInUsersGuard";
import { OnlyAuthorisedUserGuard } from "/imports/service/onlyAuthorisedUserGuard";
import { AutoLogoutService } from "/imports/service/autoLogout";
import { ApplicantProfileService } from "/imports/service/applicantProfileService";
import { BadgeService } from "/imports/service/badgeService";
import { CampusService } from "/imports/service/campusService";
import { FacultyService } from "/imports/service/facultyService";
import { InstituteService } from "/imports/service/instituteService";
import { CourseService } from "/imports/service/courseService";
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
      component: DashboardHome,
      canActivate: [OnlyAuthorisedUserGuard],
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview', component: DashboardStatistics },
        { path: 'users', component: UserManagement },
        // { path: 'issuerTools', component: IssuerTools },
        // { path: 'reports', component: Reports },
        { path: 'campus', component: CampusManagement },
        { path: 'faculty', component: FacultyManagement },
        { path: 'institutes', component: InstituteManagement },
        { path: 'courses', component: CourseManagement },
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
        DashboardHome,
        DashboardStatistics,
        DashboardSidebar,

        UserManagement,
        CampusManagement,
        FacultyManagement,
        InstituteManagement,
        CourseManagement,
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
      SearchUserService,
      TranslatorService,
      OnlyLoggedInUsersGuard,
      OnlyAuthorisedUserGuard,
      AutoLogoutService,
      ApplicantProfileService,
      BadgeService,
      CampusService,
      FacultyService,
      InstituteService,
      CourseService,
      AuthService, // no longer in use, we might use it if we can use angular httpClient

    ]
})
export class AppModule {
}
