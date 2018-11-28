import {MeteorObservable} from "meteor-rxjs";
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';
import Future from 'fibers/future';

import { AppConfig } from '/server/startup/appconfig';

const apiUrl = 'https://openbadgefactory.com/v1/badge/NM70OHe7HCeO';
const apiUrlForEarnableBadge = 'https://openbadgefactory.com/v1/earnablebadge/NM70OHe7HCeO?visible=1';

if (Meteor.isServer) {

  Meteor.methods({

    // ******************************************************
    //  ========== create new badge =========================
    // ******************************************************

    'createBadge'(data) {
          this.unblock();

          var badgelorAppConfig = new AppConfig();

          let apiCall = function (apiUrl, callback) {
            try {
              let response = HTTP.call( "POST", apiUrl,
                {npmRequestOptions: {
                  key: badgelorAppConfig.obfKey,
                  cert: badgelorAppConfig.obfCertificate,
                },data},
              );
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

          let response = Meteor.wrapAsync(apiCall)(apiUrl);

          return response;


      },


    'getEarnableBadges'() {
        this.unblock();

        var badgelorAppConfig = new AppConfig();

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

        // let apiUrl = 'https://openbadgefactory.com/v1/badge/NM70OHe7HCeO';
        let response = Meteor.wrapAsync(apiCall)(apiUrlForEarnableBadge);
        response = response.trim();
        response = response.split(/\r\n/);
        response = response.join(',');
        response = "[" + response + "]";
        response = JSON.parse(response);

        return response;

        // =================== for earnable badge_id =======
        // var a = [];
        // for (let key in response) {
        //   a.push(response[key].badge_id);
        // }
        // let b = a.join("|");
        // console.log(b);
        // return b;
        // ==================================================

      },

      // **********************************
      //  get a single badge
      // **********************************

      'getSingleBadge'(badge_id) {
        this.unblock();

        let badgelorAppConfig = new AppConfig();
        let apiUrlForSingleBadge = apiUrl+'/'+badge_id;

        let apiCall = function (apiUrlForSingleBadge, callback) {
          try {
            let response = HTTP.call( "GET", apiUrlForSingleBadge,
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

        let response = Meteor.wrapAsync(apiCall)(apiUrlForSingleBadge);
        response = response.trim();
        response = response.split(/\r\n/);
        response = response.join(',');
        response = JSON.parse(response);

        return response;
        },


      // **********************************
      //  get list of badges by id
      // **********************************
      'getBadgesByID'(listOfBadgeID) {

            this.unblock();
            var badgelorAppConfig = new AppConfig();

            var apiUrlToGetListOfBadgeData = apiUrl + "/?id="+ listOfBadgeID;
            // console.log(apiUrlToGetListOfBadgeData);

            let apiCall = function (apiUrlToGetListOfBadgeData, callback) {
              try {
                let response = HTTP.call(
                  "GET",
                  apiUrlToGetListOfBadgeData,
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

            // let apiUrl = 'https://openbadgefactory.com/v1/badge/NM70OHe7HCeO';
            let response = Meteor.wrapAsync(apiCall)(apiUrlToGetListOfBadgeData);
            response = response.trim();
            response = response.split(/\r\n/);
            response = response.join(',');
            response = "[" + response + "]";
            response = JSON.parse(response);
            return response;
      },


      // **********************************
      //  get all badges for admin
      // **********************************

      'getAllBadges' : function() {
        this.unblock();
        var badgelorAppConfig = new AppConfig();

        let apiCall = function (apiUrl, callback) {
          try {
            let response = HTTP.call(
              "GET",
              apiUrl,
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

        // let apiUrl = 'https://openbadgefactory.com/v1/badge/NM70OHe7HCeO';
        let response = Meteor.wrapAsync(apiCall)(apiUrl);
        response = response.trim();
        response = response.split(/\r\n/);
        response = response.join(',');
        response = "[" + response + "]";
        response = JSON.parse(response);
        
        return response;

      },



  }); // end Meteor.methods

} //end if (Meteor.isServer)
