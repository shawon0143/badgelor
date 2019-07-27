import {Injectable} from '@angular/core';
import {CurrencyPipe, DecimalPipe} from '@angular/common';

@Injectable()
export class TranslatorService {

    currencyDE: any = "EUR";
    currencySymbolDE: any = '&euro;'; // for currency currencySymbol
    selectedLanguage: any;
    DE: any; // variable for german text
    EN: any; // for english text
    selectedLanguageShortCode: string;

    constructor() {

        this.DE = {
          "home": "Startseite",
          "homepageBannerTextLine1": "Badgelor ist das Badge-System der Universität Koblenz-Landau. Mit Badgelor definieren, verwalten und verleihen Dozenten Badges",
          "homepageBannerTextLine2": "Studenten können Badges beantragen und im Internet teilen",
          "howBadgelorWorks": "Wie Badgelor funktioniert",
          "infoGraphicHeader": "Ihre Erfolgsgeschichte beginnt hier",
          "infoGraphicText": "Badgelor bietet alles, was Sie benötigen, um auf Ihre Errungenschaften aufmerksam zu machen und sie mit der Welt zu teilen.!",
          "letsGetInTouch": "Ihr Kontakt zu uns!",
          "getInTouchMessage": "Möchten Sie uns etwas mitteilen? Super! Rufen Sie uns an oder schicken Sie eine eMail. Wir melden uns sobald möglich!",
          "getStarted": "Erste Schritte",
          "myProfile": "Mein Profil",
          "login": "Einloggen",
          "signup": "Registrierung",
          "search": "Suchen",
          "howItWorksLine1": "Durchsuchen Sie den Badge-Katalog und finden Sie die Anforderungen heraus.",
          "apply": "Bewerben",
          "howItWorksLine2": "Schließen Sie den notwendigen Kompetenztest wie beschrieben ab und bewerben Sie sich für Ihre Badges.",
          "earn": "Erwerben",
          "howItWorksLine3": "Nach erfolgreichem Bestehen der Prüfung wird Ihnen der Badge verliehen.",
          "share": "Teilen",
          "howItWorksLine4": "Erworbene Badges können mit sämtlichen Badge Communities oder Portfolio-Management-Systemen geteilt werden.",
          "findBadge": "Badge finden",
          "signupNow": "Jetzt registrieren",
          "address": "Anschrift",
          "badgeSearchPlaceholder": "Welchen Badge möchten Sie erwerben?",
          "searchHelpText": "Suchen Sie nach einem beliebigen Keyword, Badge-Namen, Kursnamen und so weiter.",
          "level": "Niveau",
          "levels": "Niveaus",
          "competency": "Kompetenzniveau",
          "tool": "Werkzeug",
          "tools": "Werkzeuge",
          "view": "Ansehen",
          "users": "Benutzer",
          "overview": "Übersicht",
          "totalUsers": "Nutzer insgesamt",
          "totalBadges": "Badges insgesamt",
          "badgesToImport": "Zu importierende Badges",
          "missingMetadata": "Fehlende Metadaten",
          "viewAll": "Alle anzeigen",
          "metadataManagement": "Metadatenverwaltung",
          "badgeManagement": "Badgeverwaltung",
          "newBadge": "Neuer Badge",
          "importBadges" : "Badges importieren",
          "updateMetadata": "Metadaten aktualisieren",
          "courses": "Kurse",
          "institutes": "Institute",
          "faculty": "Fakultät",

          "Learn more": "Mehr erfahren",
          "Welcome to Badgelor": "Willkommen bei Badgelor",
          "Welcome": "Willkommen",
          "Role": "Rolle",
          "Employee": "Mitarbeiter",
          "Courses": "Kurse",
          "Manage Courses": "Kurse verwalten",
          "New Badge": "Badge anlegen",
          "Modify Badge": "Badge ändern",
          "View all": "Alle ansehen",
          "Issue Badge": "Badge verleihen",
          "Review Application": "Antrag bearbeiten",
          "Manage Badgelor Users": "Benutzer verwalten",

        };


        // end of german static language texts

        //  ----------------------------------------------------------------------


        // language static text in english
        this.EN = {
          "home": "Home",
          "homepageBannerTextLine1":"Badgelor is a badge system for University of Koblenz - Landau to create, issue and manage meaningful Badges",
          "homepageBannerTextLine2": "Students can apply, earn and share their badges to the badge community",
          "howBadgelorWorks": "How Badgelor Works",
          "infoGraphicHeader": "Your success story begins here",
          "infoGraphicText" : "Badgelor has everything you need to get your achievement recognised and share them with the world !",
          "letsGetInTouch" : "Let's Get In Touch!",
          "getInTouchMessage": "Have something to tell us? That's great! Give us a call or send us an email and we will get back to you as soon as possible!",
          "getStarted": "Get Started",
          "myProfile": "My Profile",
          "login": "Login",
          "signup": "Sign Up",
          "search": "Search",
          "howItWorksLine1": "Search through entire badge catalogue and figure out the skill requirements.",
          "apply": "Apply",
          "howItWorksLine2": "Complete required competency test as described and apply for your badges.",
          "earn": "Earn",
          "howItWorksLine3": "After successfully passing the assessment test you will be awarded the badge.",
          "share": "Share",
          "howItWorksLine4": "Earned badges can be shared to any badge community or portfolio management system.",
          "findBadge": "Find Badge",
          "signupNow": "Signup now",
          "address": "Address",
          "badgeSearchPlaceholder": "What badge do you want to earn?",
          "searchHelpText": "Search any keyword, badge name, course name and so on.",
          "level": "Level",
          "levels": "Levels",
          "competency": "Competency",
          "tool": "Tool",
          "tools": "Tools",
          "view": "View",
          "users": "Users",
          "overview": "Overview",
          "totalUsers": "Total users",
          "totalBadges": "Total badges",
          "badgesToImport": "Badges to impport",
          "missingMetadata": "Missing Metadata",
          "viewAll": "View All",
          "metadataManagement": "Metadata Management",
          "badgeManagement": "Badge Management",
          "newBadge": "New Badge",
          "importBadges" : "Import Badges",
          "updateMetadata": "Update Metadata",
          "courses": "Courses",
          "institutes": "Institutes",
          "faculty": "Faculty",



        };

        // END of english language variables


        //  ------------------------------------------------------------------------
        // dictionary Initialization is done. so now setting the Default language
        this.setSiteLanguage("DE");
        this.selectedLanguage = this.DE;
        this.selectedLanguageShortCode = "DE";
        // setting German language as Default
        //console.log(this.selectedLanguage);

    } //End of constructor

    setSiteLanguage(LanguageShortCode: string) {
        // TODO: make an interface of available langulage. and before setting a site langulage, check if that shortcode exists.
        // if not set Default
        if (LanguageShortCode == "DE") {
            this.selectedLanguage = this.DE;
            this.selectedLanguageShortCode = "DE";
        }
        else if (LanguageShortCode == "EN") {
            this.selectedLanguage = this.EN; //eg : "DE", "EN"
            this.selectedLanguageShortCode = "EN";
        }
        else {
            //langulage not available yet
            //setting EN as Default
            this.selectedLanguage = this.EN;
            this.selectedLanguageShortCode = "EN";
        }

    } // end of setSiteLanguage

} // END OF TranslatorService
