// docs for meteor default methods : http://docs.meteor.com/api/passwords.html
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Mongo } from 'meteor/mongo';
import { MeteorObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';
import { ProfileDB } from "/imports/api/index";

if (Meteor.isServer) {

  Meteor.methods({

    'isUserExistInDB'(email) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = unknown email address.
      // 404 = Datbase level problem or Unknown error or exceptions
      // 100 = user already exists;
      // ---------------------------------------------------------------
      var response: any = {
        feedback: "Unknown error while processing request. Please try again.",
        code: 404
      }
      var user = Meteor.users.findOne({ "emails.address": email });

      if (user !== undefined) {
        // console.log("user found");
        //user found
        response.code = 100;
        response.feedback = "This email already registered in the system";
        return response;
      }
      else if (user == undefined) {
        // console.log("user not found");
        //user not found
        response.code = 999;
        response.feedback = "This email doesn't exist in DB";
        return response;
      }
      else {
        return response;
      }
    },

    'getExistingUserData'(email) {
      // --------------------------------------------------------------
      // the response object for client with feedback and data
      // codes :
      // 999 = unknown email address.
      // 404 = Datbase level problem or Unknown error or exceptions
      // 200 = user already exists;
      // ---------------------------------------------------------------
      var response: any = {
        feedback: "Unknown error while processing request. Please try again.",
        code: 404,
        userData: undefined
      }
      var user = Meteor.users.findOne({ "emails.address": email });

      if (user !== undefined) {
        // console.log("user found");
        //user found now we get user data from profileDB
        let userData = ProfileDB.findOne({"userAccountID": user._id});

        response.userData = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          occupation: userData.occupation,
          campus: userData.campus,
          role: user["role"],
          lastLogin: user["profile"]["lastLogin"]
        }
        response.code = 200;
        response.feedback = "User exist in Badgelor";
        return response;
      }
      else if (user == undefined) {
        // console.log("user not found");
        //user not found
        response.code = 999;
        response.feedback = "This email doesn't exist in DB";
        return response;
      }
      else {
        return response;
      }
    },

    'isUserTypeAdmin'() {
      // this method is needed for client to know if a user type is admin or not
      // user role will never be published to  client
      // codes :
      // 100 = user is an admin
      // 999 = not admin
      if (!this.userId) {
        return 999;
      }
      var dbAccessChecker = new Checkdbaccess();
      if (dbAccessChecker.isRoleAdmin(this.userId) === true) {
        return 100;
      }
      else {
        return 999;
      }
    }, // --- end of isUserTypeAdmin ---

    'isUserTypeApplicant'() {
      // this method is needed for client to know if a user type is applicant or not
      // user role will never be published to  client
      // codes :
      // 100 = user is an applicant
      // 999 = not applicant
      if (!this.userId) {
        return 999;
      }
      var dbAccessChecker = new Checkdbaccess();
      if (dbAccessChecker.isRoleApplicant(this.userId) === true) {
        return 100;
      }
      else {
        return 999;
      }
    }, // --- end of isUserTypeAdmin ---


    'createMyProfile'(data) {
      // add new user profile via signup form ( user: applicant )

      // TODO : this function is called when the user create new account and instanctly logs in for the first time.
      // we need to create another method - when admin creates a user from admin panel
      // (when new user is not singed in , so no valid userID)

      if (!this.userId) {
        return true;
      }

      //first finding the profile of this requesting user.
      var myProfileDB = ProfileDB.findOne({ "userAccountID": this.userId });
      //console.log(myProfileDB);

      if (myProfileDB === undefined) {
        //the ProfileDB for this user has not been created yet. so creating a new one
        var profileID = ProfileDB.collection.insert({
          userAccountID: this.userId
        });
        // now the db is created, so updating the data of this collection
        updateProfile(data, profileID);
        return true;

      }

      else {
        // profileDB exist for this user so making updates
        updateProfile(data, myProfileDB._id);
      }
      // the function to update the ProfileDB
      function updateProfile(data, profileID) {

        ProfileDB.collection.update(

          profileID,
          {
            $set: {
              firstName: data.firstName,
              lastName: data.lastName,
              campus: data.campus,
              occupation: data.occupation,
              imageURL: data.imageURL
            }
          }

        );
      } // end function updateProfile def

    },



    'addNewUserByAdmin'(registerData, profileData) {


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
      // admin can add any number of user
      // other type of users will have no access to this feature
      // --------------------------------------------------------
      // step 1: request validation, basic filtering
      if (!this.userId) {
        response.code = 999;
        response.feedback = "Access denied";
        return response;
      }
      check(registerData, Object);

      // step 2 : checking DB access rights

      // a flag to make sure this requesting user has the right access to modify this data
      var userHasAccessRights = false;

      var userIsAdmin = false;

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userHasAccessRights = userIsAdmin;



      if (userHasAccessRights === true) {
        try {

          var userId = Accounts.createUser({
            email: registerData.email,
            password: registerData.password,
            profile: {
              lastLogin: 'Never'
            }
          });
          // now setting up user role
          setUserRole(registerData.email, registerData.role);
          // next create a profile for the new user
          var profileID = ProfileDB.collection.insert({
            userAccountID: userId,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            campus: profileData.campus,
            occupation: profileData.occupation,
            imageURL: profileData.imageURL
          });

          response.code = 200;
          response.feedback = "new account created";
          return response;
        }
        catch (e) {
          response.code = 999;
          response.feedback = "Error: " + e;
          return response;
        }

      } // end if if(userHasAccessRights === true)
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }


      function setUserRole(email, role) {
        var userDB = Meteor.users.findOne({ "emails.address": email });

        Meteor.users.update(
          userDB._id,
          {
            $set: {
              "role": role
            }
          }
        )
      }


      return response;


    }, // 'addNewUserByAdmin'(data) ends here

    'deleteUserByAdmin'(profile) {

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
      // admin can add any number of user
      // other type of users will have no access to this feature
      // --------------------------------------------------------
      // step 1: request validation, basic filtering
      if (!this.userId) {
        response.code = 999;
        response.feedback = "Access denied";
        return response;
      }

      check(profile, Object);

      // step 2 : checking DB access rights

      // a flag to make sure this requesting user has the right access to modify this data
      var userHasAccessRights = false;

      var userIsAdmin = false;

      var dbAccessChecker = new Checkdbaccess();

      userIsAdmin = dbAccessChecker.isRoleAdmin(this.userId); //returns true if admin
      userHasAccessRights = userIsAdmin;



      if (userHasAccessRights === true) {
        try {

          Meteor.users.remove(profile.userAccountID);

          ProfileDB.remove(profile._id);

          response.code = 200;
          response.feedback = "User Deleted";
          return response;
        }
        catch (e) {
          response.code = 999;
          response.feedback = "Error: " + e;
          return response;
        }
      }
      else {
        // no Access right
        response.code = 999;
        response.feedback = "Access denied";
      }

      return response;

    },



    'setUserRole'(email, role) {
      var response: any = {
        feedback: "Unknown error while processing reset. Please try again.",
        code: 404
      }
      var userDB = Meteor.users.findOne({ "emails.address": email });

      if (userDB != undefined) {
        Meteor.users.update(
          userDB._id,
          {
            $set: {
              "role": role
            }
          }
        )
        response.feedback = role + " role assigned";
        response.code = 200;
        return response;
      }

      return response;
    }






  }); // END of meteor methods

} // END of Meteor.isServer
