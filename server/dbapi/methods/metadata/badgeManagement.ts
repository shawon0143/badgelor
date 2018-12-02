import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Mongo } from 'meteor/mongo';
import { MeteorObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';
import { MetadataDB } from "/imports/api/index";


if (Meteor.isServer) {

  Meteor.methods({
    'insertMetadataToLocalDB'(data) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = access denied.
      // 404 = Datbase level problem or Unknown error or exceptions
      // 200 = success;
      // ---------------------------------------------------------------

      var response: any = {
        feedback: "Unknown error while processing. Please try again.",
        code: 404
      }

      // -------------------------------------------------------
      // access rules :
      // admin and creator can add any number of badges
      // other type of users will have no access to this feature
      // --------------------------------------------------------
      // step 1: request validation, basic filtering
      if (!this.userId) {
        response.code = 999;
        response.feedback = "Access denied";
        return response;
      }
      check(data, Object);

      // step 2 : checking DB access rights

      // a flag to make sure this requesting user has the right access to modify this data
      var userHasAccessRights = false;

      var userIsAdmin = false;
      var userIsCreator = false;

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userIsCreator = dbAccessChecker.isRoleCreator(this.userId); //returns true if creator

      if (userIsAdmin || userIsCreator) {
        userHasAccessRights = true;
      }
      // userHasAccessRights = userIsAdmin;

      if (userHasAccessRights === true) {

        // step : 3 updating data into the DB
        MetadataDB.collection.insert({

          badge_id: data.badge_id,
          courses: data.courses,
          issuers: data.issuers,
          keywords: data.keywords,
          levelID: data.levelID,
          competencyID: data.competencyID,
          tools: data.tools,
          creator: data.creator,
          applicants: data.applicants,
          earners: data.earners,
          createdAt: new Date()

        }); //end insert
        response.code = 200;
        response.feedback = "New Badge Creation successful!";
        return response;
      } // end if if(userHasAccessRights === true)
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }
      return response;

    },

    'updateMetadata'(data) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = access denied.
      // 404 = Datbase level problem or Unknown error or exceptions
      // 200 = success;
      // ---------------------------------------------------------------

      var response: any = {
        feedback: "Unknown error while processing. Please try again.",
        code: 404
      }

      // -------------------------------------------------------
      // access rules :
      // admin and creator can add any number of badges
      // other type of users will have no access to this feature
      // --------------------------------------------------------
      // step 1: request validation, basic filtering
      if (!this.userId) {
        response.code = 999;
        response.feedback = "Access denied";
        return response;
      }
      check(data, Object);

      // step 2 : checking DB access rights

      // a flag to make sure this requesting user has the right access to modify this data
      var userHasAccessRights = false;

      var userIsAdmin = false;
      var userIsCreator = false;

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userIsCreator = dbAccessChecker.isRoleCreator(this.userId); //returns true if creator

      if (userIsAdmin || userIsCreator) {
        userHasAccessRights = true;
      }
      // userHasAccessRights = userIsAdmin;

      if (userHasAccessRights === true) {
        // step : 3 updating data into the DB
        console.log(data);
        var badgeDB = MetadataDB.findOne({"badge_id":data.badge_id});
        if (badgeDB != undefined) {
          MetadataDB.collection.update(
            badgeDB._id,
            {
              $set:
                {
                  courses: data.courses,
                  issuers: data.issuers,
                  keywords: data.keywords,
                  levelID: data.levelID,
                  competencyID: data.competencyID,
                  tools: data.tools,
                  creator: data.creator,
                  applicants: data.applicants,
                  earners: data.earners,
                  createdAt: new Date()
                }
            }); // end update
        }




        response.code = 200;
        response.feedback = "Badge Update successful!";
        return response;


      } // end if if(userHasAccessRights === true)
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }
      return response;
    },

    'importNewBadgeFromOBF'(data) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = access denied.
      // 404 = Datbase level problem or Unknown error or exceptions
      // 200 = success;
      // ---------------------------------------------------------------

      var response: any = {
        feedback: "Unknown error while processing. Please try again.",
        code: 404
      }

      // -------------------------------------------------------
      // access rules :
      // admin and creator can add any number of badges
      // other type of users will have no access to this feature
      // --------------------------------------------------------
      // step 1: request validation, basic filtering
      if (!this.userId) {
        response.code = 999;
        response.feedback = "Access denied";
        return response;
      }
      check(data, Object);

      // step 2 : checking DB access rights

      // a flag to make sure this requesting user has the right access to modify this data
      var userHasAccessRights = false;

      var userIsAdmin = false;
      var userIsCreator = false;

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userIsCreator = dbAccessChecker.isRoleCreator(this.userId); //returns true if creator

      if (userIsAdmin || userIsCreator) {
        userHasAccessRights = true;
      }

      if (userHasAccessRights === true) {

        // step : 3 updating data into the DB
        MetadataDB.collection.insert({

          badge_id: data.badge_id,
          courses: data.courses,
          issuers: data.issuers,
          keywords: data.keywords,
          levelID: data.levelID,
          competencyID: data.competencyID,
          tools: data.tools,
          creator: data.creator,
          applicants: data.applicants,
          earners: data.earners,
          createdAt: new Date()

        }); //end insert
        response.code = 200;
        response.feedback = "New Badge Import successful!";
        return response;
      } // end if if(userHasAccessRights === true)
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }
      return response;
    },

    'getNumberOfBadges'() {
      return MetadataDB.collection.find().count();
    },

    'missingMetadataCount'() {
        return MetadataDB.collection.find({"levelID":""}).count();
    }


  }); // END of meteor methods

} // END of Meteor.isServer
