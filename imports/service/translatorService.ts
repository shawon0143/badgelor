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
          "homepageBannerTextLine1": "Badgelor ist das Badge-System der Universität Koblenz-Landau. Mit Badgelor definieren, verwalten und verleihen Dozenten Badges",
          "homepageBannerTextLine2": "Studenten können Badges beantragen und im Internet teilen",

          "howBadgelorWorks": "Wie Badgelor funktioniert",

          "infoGraphicHeader": "Ihr Erfolg beginnt hier",
          "infoGraphicText": "Mit Badgelor zeigen Sie der Welt was Sie können !",

          "letsGetInTouch": "Ihr Kontakt zu uns!",
          "getInTouchMessage": "Möchten Sie uns etwas mitteilen? Super! Rufen Sie uns an oder schicken Sie eine eMail. Wir melden uns sobald möglich!",



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
          "homepageBannerTextLine1":"Badgelor is a badge system for University of Koblenz - Landau to create, issue and manage meaningful Badges",
          "homepageBannerTextLine2": "Students can apply, earn and share their badges to the badge community",
          "howBadgelorWorks": "How Badgelor Works",
          "infoGraphicHeader": "Your success story begins here",
          "infoGraphicText" : "Badgelor has everything you need to get your achievement recognised and share them with the world !",
          "letsGetInTouch" : "Let's Get In Touch!",
          "getInTouchMessage": "Have something to tell us? That's great! Give us a call or send us an email and we will get back to you as soon as possible!",


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
