// this class will have common functions to check db access rights for a user

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export class Checkdbaccess {

//userID : string;

constructor() {

}

// this function check if the passed userId belongs to an admin user (who has the role=admin)
// return true if the user is an admin
isRoleAdmin(userID){
  var userDB;
  try {
    userDB = Meteor.users.findOne({ "_id":userID });
    if (userDB["role"] === "admin") {
      // this user is an admin
      return true;
    }
    else{
      return false;
    }
  } catch (err) {
    // console.log(err);
    return false;
  }
} //end of isRoleAdmin



}// end of class
