import { MeteorObservable } from "meteor-rxjs";
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';

// modules for ldap and asynch method return
import Future from 'fibers/future';
import assert from 'assert';
import ldap from 'ldapjs';


if (Meteor.isServer) {

  Meteor.methods({



    // ///////////////////////////////////////
    //=========== LDAP access Method =========
    // This method is used for search user
    // of University of Koblenz and Landau
    // Files using this method : accountService.ts
    // ///////////////////////////////////////

    'bindAndSearch'(data) {


      // Create our future instance.
      var Future = Npm.require('fibers/future');
      var future = new Future();

      var clientFeedback = {
        error: "no error",
        firstName: "",
        lastName: "",
        eduPersonAffiliation: ""
      };

      var ldap = require('ldapjs');
      var client = ldap.createClient({
        url: 'ldap://ldap.uni-koblenz.de:389'
      });
      var opts = {
        filter: '(objectclass=*)',
        scope: 'base',
        // attributes: ['mail', 'cn', 'eduPersonAffiliation'],
        attributes: [],
        sizeLimit: 0 //0=unlimited
      };


      client.bind('uid=' + data.username + ',ou=' + data.ou1 + ',ou=' + data.ou2 + ',dc=Uni-Koblenz-landau,dc=de', data.password,
        function callback(err, response) {
          //assert.ifError(err);
          //console.log(response);
          if (err) {
            console.log('bind unsuccessful, in error block');
            clientFeedback.error = "Invalid password";
            future.return(clientFeedback);
          }

          if (!err) {
            if (response) {
              // console.log(response);
              // now bind is done
              // lets search

              client.search('uid=' + data.searchUserName + ',ou=' + data.ou3 + ',ou=' + data.ou4 + ',dc=Uni-Koblenz-landau,dc=de', opts, function(err, response) {
                var assert = require('assert');
                assert.ifError(err);
                response.on('searchEntry', function callback(result) {
                  // console.log('entry: ' + JSON.stringify(result.object));
                  // console.log(result.object);
                  console.log("Hello : " + result.object.givenName); // extract First Name
                  console.log(result.object.mail); // extract email address
                  clientFeedback.firstName = result.object.givenName;
                  clientFeedback.lastName = result.object.sn;
                  if (result.object.eduPersonAffiliation) {
                    clientFeedback.eduPersonAffiliation = result.object.eduPersonAffiliation[1];
                  } else {
                    clientFeedback.eduPersonAffiliation = "Alumni";
                  }

                  future.return(clientFeedback);
                });
                response.on('error', function(err) {
                  clientFeedback.error = "User not found in the database!";
                  console.error('error: ' + err.message);
                  future.return(clientFeedback);
                });
              });

            } // end if(response)

          } //end if (!err)

        }); //end client.bind

      return future.wait();

    }, // end of bindAndSearch() method

    // we are going to use onlyLogin method for login purpose
    // instead of bind and search method. It performs faster
    // ///////////////////////////////////////
    //=========== LDAP access Method =========
    // This method is used for login user
    // of University of Koblenz and Landau
    // Files using this method : accountService.ts
    // ///////////////////////////////////////

    'onlyLogin'(data) {

      // Create our future instance.
      var Future = Npm.require('fibers/future');
      var future = new Future();

      var clientFeedback = {
        feedback: "error",
        name: "",
        eduPersonAffiliation: ""
      };
      var ldap = require('ldapjs');
      var client = ldap.createClient({
        url: 'ldap://ldap.uni-koblenz.de:389'
      });

      client.bind('uid=' + data.username + ',ou=' + data.ou1 + ',ou=' + data.ou2 + ',dc=Uni-Koblenz-landau,dc=de', data.password,
        function callback(err, response) {
          // assert.ifError(err);
          // console.log(response);
          if (err) {
            console.log('bind unsuccessful, in error block');
            clientFeedback.feedback = "Invalid password";
            future.return(clientFeedback);
          }
          if (!err) {
            if (response) {
              clientFeedback.feedback = "Login successful";
              future.return(clientFeedback);
            }
          }
        });
      return future.wait();
    }


  }); // end Meteor.methods

} //end if (Meteor.isServer)
