// All applicant related API call methods are in this file
// This methods are used in the following files
// 1. applicantProfile.ts
// 2.
// 3.


import {MeteorObservable} from "meteor-rxjs";
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';

import { AppConfig } from '/server/startup/appconfig';

const apiUrl = 'https://openbadgefactory.com/v1/badge/NM70OHe7HCeO';

if (Meteor.isServer) {

  Meteor.methods({

    // ==================================
    // ======= Get all earnable_id ======
    // ==================================

    'getEarnableIdList'() {
        this.unblock();
        var badgelorAppConfig = new AppConfig();
        const apiUrlForEarnableBadge = 'https://openbadgefactory.com/v1/earnablebadge/NM70OHe7HCeO';
        let apiCall = function (apiUrlForEarnableBadge, callback) {
          try {
            let response = HTTP.call( "GET", apiUrlForEarnableBadge,
              {npmRequestOptions: {
                key: badgelorAppConfig.obfKey,
                cert: badgelorAppConfig.obfCertificate,
              }},
            ).content;
            callback(null, response);
          } catch (error) {
            let errorCode;
            let errorMessage;
            if (error.response) {
              errorCode = error.response.data.code;
              errorMessage = error.response.data.message;
            } else {
              errorCode = 500;
              errorMessage = 'Cannot access the API';
            }
            let myError = new Meteor.Error(errorCode, errorMessage);
            callback(myError, null);
          }
        }

        let response = Meteor.wrapAsync(apiCall)(apiUrlForEarnableBadge);
        response = response.trim();
        response = response.split(/\r\n/);
        response = response.join(',');
        response = "[" + response + "]";
        response = JSON.parse(response);

        // ================ for earnable_id =================

          let obj = [];

          for (let key in response) {

              obj.push({
                badge_id: response[key].badge_id,
                earnable_id: response[key].id,
                name: response[key].name
              })

          }

          return obj;

      },

      // =========================================
      // ======== Get all badge applications =====
      // =========================================
      // we get all application of an applicant
      // filtered by their email address

      'getAllBadgeApplication'(earnableID, userEmail) {
        console.log(userEmail);
        this.unblock();
        var badgelorAppConfig = new AppConfig();

        var apiUrlforBadgeApplication = "https://openbadgefactory.com/v1/earnablebadge/NM70OHe7HCeO" + "/"+ earnableID + "/application" ;
        // console.log(apiUrlToGetListOfBadgeData);

        let apiCall = function (apiUrlforBadgeApplication, callback) {
          try {
            let response = HTTP.call( "GET", apiUrlforBadgeApplication,
              {npmRequestOptions: {
                key: badgelorAppConfig.obfKey,
                cert: badgelorAppConfig.obfCertificate,
              }},
            ).content;
            callback(null, response);
          } catch (error) {
            let errorCode;
            let errorMessage;
            if (error.response) {
              errorCode = error.response.data.code;
              errorMessage = error.response.data.message;
            } else {
              errorCode = 500;
              errorMessage = 'Cannot access the API';
            }
            let myError = new Meteor.Error(errorCode, errorMessage);
            callback(myError, null);
          }
        }

        let response = Meteor.wrapAsync(apiCall)(apiUrlforBadgeApplication);
        response = response.trim();
        response = response.split(/\r\n/);
        response = response.join(',');
        response = "[" + response + "]";
        response = JSON.parse(response);

        response = response.filter(function (el) {
            return (el.email === userEmail);
        });


          return response;
        

      },

  }); // end Meteor.methods

} //end if (Meteor.isServer)
