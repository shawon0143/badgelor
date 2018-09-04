// docs for meteor default methods : http://docs.meteor.com/api/passwords.html
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Mongo } from 'meteor/mongo';
import { MeteorObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';
import { ToolDB } from "/imports/api/index";


if (Meteor.isServer) {

  Meteor.methods({


    'isToolExistInDB'(toolName) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = unknown name.
      // 404 = Datbase tool problem or Unknown error or exceptions
      // 200 = tool name already exists;
      // ---------------------------------------------------------------
      var response: any = {
        feedback: "Unknown error while processing request. Please try again.",
        code: 404
      }

      var toolNameinDB = ToolDB.findOne({ "name": toolName });


      if (toolNameinDB !== undefined) {
        response.code = 200;
        response.feedback = "This Tool is already registered in the system";
        return response;
      }
      else if (toolNameinDB === undefined) {
        response.code = 999;
        response.feedback = "This Tool is not registered in the system";
        return response;
      }
      else {
        return response;
      }
    },

    'addNewTool'(data) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = access denied.
      // 404 = Datbase tool problem or Unknown error or exceptions
      // 200 = success;
      // ---------------------------------------------------------------

      var response: any = {
        feedback: "Unknown error while processing. Please try again.",
        code: 404
      }

      // -------------------------------------------------------
      // access rules :
      // admin can add any number of tool
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

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userHasAccessRights = userIsAdmin;

      if (userHasAccessRights === true) {

        // step : 3 updating data into the DB
        ToolDB.collection.insert({

          name: data.name,
          description: data.description,
          createdBy: Meteor.user().emails[0].address,
          createdAt: new Date(),

        }); //end insert
        response.code = 200;
        response.feedback = "New Tool Creation successfull!";
        return response;
      } // end if if(userHasAccessRights === true)
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }
      return response;



    },

    'updateTool'(data) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = access denied.
      // 404 = Datbase tool problem or Unknown error or exceptions
      // 200 = success;
      // ---------------------------------------------------------------

      var response: any = {
        feedback: "Unknown error while processing. Please try again.",
        code: 404
      }

      // -------------------------------------------------------
      // access rules :
      // admin can edit any number of tool
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

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userHasAccessRights = userIsAdmin;

      if (userHasAccessRights === true) {

        // step : 3 updating data into the DB
        ToolDB.collection.update(
          data._id,
          {
            $set:
              {
                name: data.name,
                description: data.description,
                createdBy: Meteor.user().emails[0].address,
                createdAt: new Date(),
              }
          }); // end update


        response.code = 200;
        response.feedback = "Tool Update successfull!";
        return response;
      } // end if if(userHasAccessRights === true)
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }
      return response;
    },

    'deleteTool'(data) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = access denied.
      // 404 = Datbase tool problem or Unknown error or exceptions
      // 200 = success;
      // ---------------------------------------------------------------

      var response: any = {
        feedback: "Unknown error while processing. Please try again.",
        code: 404
      }

      // -------------------------------------------------------
      // access rules :
      // admin can edit any number of tool
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

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userHasAccessRights = userIsAdmin;

      if (userHasAccessRights === true) {
        ToolDB.collection.remove(data._id);

        response.code = 200;
        response.feedback = "Tool delete successfull!";
        return response;
      }
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }
      return response;
    },

    'getAllToolName'() {
      return ToolDB.find({}).fetch();
    }


  }); // END of meteor methods

} // END of Meteor.isServer
