import {MeteorObservable} from "meteor-rxjs";
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
    // This method is used for login and search user
    // of University of Koblenz and Landau
    // Files using this method : accountService.ts
    // ///////////////////////////////////////

    'bindAndSearch'(data) {


      // Create our future instance.
      var Future = Npm.require( 'fibers/future' );
      var future = new Future();

      var clientFeedback= {
          error  : "no error",
          name   : "",
          eduPersonAffiliation : ""
        };

      var ldap = require('ldapjs');
      var client = ldap.createClient({
          url: 'ldap://ldap.uni-koblenz.de:389'
      });
      var opts = {
          filter: '(objectclass=*)',
          scope: 'base',
          attributes: ['mail', 'cn', 'eduPersonAffiliation'],
          //attributes: [],
          sizeLimit: 0 //0=unlimited
      };


      client.bind('uid=' + data.username + ',ou='+data.ou1+',ou='+data.ou2+',dc=Uni-Koblenz-landau,dc=de',  data.password ,
        function callback(err,response) {
            //assert.ifError(err);
            //console.log(response);
            if(err) {
              console.log('bind unsuccessful, in error block');
              clientFeedback.error = "Invalid password";
              future.return( clientFeedback );
            }

            if(!err) {
              if(response) {
                // console.log(response);
                // now bind is done
                // lets search

                client.search('uid=' + data.searchUserName + ',ou='+data.ou3+',ou='+data.ou4+',dc=Uni-Koblenz-landau,dc=de', opts, function(err, response) {
                    var assert = require('assert');
                    assert.ifError(err);
                    response.on('searchEntry', function callback(result) {
                      // console.log('entry: ' + JSON.stringify(result.object));
                      //console.log(result.object);
                      console.log("Hello : " + result.object.cn); // extract Full Name
                      console.log(result.object.mail); // extract email address
                      clientFeedback.name = result.object.cn;
                      if(result.object.eduPersonAffiliation)
                      {
                        clientFeedback.eduPersonAffiliation = result.object.eduPersonAffiliation[1];
                      } else {
                        clientFeedback.eduPersonAffiliation = "Alumni";
                      }

                      future.return( clientFeedback );
                    });
                    response.on('error', function(err) {
                      clientFeedback.error = "error";
                      console.error('error: ' + err.message);
                      future.return( clientFeedback );
                    });
                });

              } // end if(response)

            } //end if (!err)

        }); //end client.bind

        return future.wait();

    } // end of bindAndSearch() method

  }); // end Meteor.methods

} //end if (Meteor.isServer)
