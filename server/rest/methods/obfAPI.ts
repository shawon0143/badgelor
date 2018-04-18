import {MeteorObservable} from "meteor-rxjs";
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';

import { AppConfig } from '/server/startup/appconfig';

const apiUrl = 'https://openbadgefactory.com/v1/badge/NM70OHe7HCeO';
const apiUrlForEarnableBadge = 'https://openbadgefactory.com/v1/earnablebadge/NM70OHe7HCeO?visible=1';

if (Meteor.isServer) {

  Meteor.methods({


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






  }); // end Meteor.methods

} //end if (Meteor.isServer)
