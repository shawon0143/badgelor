// This file contains all the declarations for mongo database/collections
// modules of this file will need to be imported in both server and client scripts - whenever a DB access is needed.
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';

//here campus is the name of mongo collection in the database and CampusDB points to that collection.
export const CampusDB = new MongoObservable.Collection('campus');
export const FacultyDB = new MongoObservable.Collection('faculty');
export const InstituteDB = new MongoObservable.Collection('institute');
export const CourseDB = new MongoObservable.Collection('course');
export const LevelDB = new MongoObservable.Collection('level');
export const CompetencyDB = new MongoObservable.Collection('competency');
export const ToolDB = new MongoObservable.Collection('tool');

export const ProfileDB = new MongoObservable.Collection('profile');



if (Meteor.isServer) {


} // end if (Meteor.isServer)
