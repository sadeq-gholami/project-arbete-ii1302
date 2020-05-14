/* 
    Internal account component.
    AUTHOR: Group 10 KTH
    VERSION: 2020-05-08-A
*/

const {UserSchema, DisplaySchema} = require('../db/db');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let usercache = {};

//Add hours to a Date instance.
//Source: https://stackoverflow.com/questions/1050720/adding-hours-to-javascript-date-object
Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
 }

 //Add a user session to the session list.
 function addUserSession(id, time=new Date().addHours(1)){
   let sid = makeSessionId(12);
   usercache[sid] = {id:id, expires:time, session:sid};
   return sid;
 }

 //Authenticates a user.
function login(username, pwd, callback){
   UserSchema.find()
   .where('username').equals(username)
   .select('_id username hpwd displays')
   .exec()
   .then(doc => {
      console.log(username);
       if(doc && doc.length > 0){
          if(doc.length > 1)
            callback ({
               accepted: false,
               message:"Internal server error.",
               error:"500"
            });
            doc = doc[0];
            bcrypt.compare(pepper(pwd), doc.hpwd).then((result) => {
               if(result) {
                  let sid = addUserSession(doc._id);
                  callback ({
                     accepted: true,
                     message:"Login successful.",
                     session: sid
                 });
               } else {
                  callback ({
                     accepted: false,
                     message:"Incorrect username or password."
                  });
               }
            });
       } else {
         callback ({
            accepted: false,
            message:"Incorrect username or password."
         });
         
       }
   })
   .catch(err => {
      callback({accepted:false, error:err, message:"Internal server error."});
   });
   sessionsCleaner();
}

//Creates a new account in the database.
function create(username, pwd, callback) {
   let id = new mongoose.Types.ObjectId();
   bcrypt.hash(pepper(pwd), saltRounds).then((hash) => {
      const n = new UserSchema({_id: id, username: username, hpwd: hash});
      n.save().then(() => {
         callback({username: username, accepted: true})
      }).catch((e) => {
         callback({error:e, accepted: false})
      });
   });
}

//Checks whether a session is valid.
function check(session, callback, err) {
   let data = usercache[session] || null;
   if(data) {
      callback(data);
   }
   else {
      err("Session has expired.");
   }
}

//Checks whether a session user owns display.
function checkDisplay(session, display, callback, error) {
   getUserDisplays(session, (displays) => {
      for(v of displays){
         console.log("Find:", v, display);
         if(v.display == display){
            callback(true);
            return;
         }
      }
      error("Display is not owned by user.");
   }, error)
}

//Adds a display to owned list in user and checks session.
function addDisplaySession(session, displayID, callback, error){
   check(session, (data) => {
      UserSchema.findOneAndUpdate({_id: data.id}, {$push: {displays:{display:displayID}}}, (err, doc) => {
         if (err) 
            error({accepted:false, error:err, echo:{ id:userID, display:displayID }});
         else
            callback({accepted:true, echo:{ id:userID, display:displayID }});
      })
   }, (err) => {
      error({accepted:false, error:err});
   })
}
//Adds a display to owned list in user.
function addDisplay(userID, displayID, callback, error){
   UserSchema.findOneAndUpdate({_id: userID}, {$push: {displays:{display:displayID}}}, (err, doc) => {
      if(err) {
         error(err);
      }
      else {
         callback({display:displayID});
      }
   })
}

//Get a list of owned displays from user.
function getUserDisplays(session, callback, error) {
   check(session, (data) => {
      UserSchema.findOne({"_id":data.id})
      .select('username displays')
      .exec()
      .then(doc => {
         if(doc){
            callback(doc.displays);
         } else {
            error("The is no user with this id.");
         }
      })
      .catch(err => {
         error(err);
      });
   }, (err) => {
      error(err);
   })
}

//Return the password hash pepper.
function pepper(pwd){
   return (pwd+process.env.HASH_PEPPER);
}

//Removes sessions that has expired.
function sessionsCleaner(now=new Date()) {
   for(v of Object.keys(usercache)){
      if(usercache[v].expires < now){
         delete usercache[v];
      }
   }
}

//Generates a random string of characters and numbers.
/*Source: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript*/
function makeSessionId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++)
       result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
}

module.exports = {login:login, create:create, check:check, addDisplay:addDisplay, getUserDisplays:getUserDisplays, addDisplaySession:addDisplaySession, addUserSession:addUserSession, sessionsCleaner:sessionsCleaner, checkDisplay:checkDisplay};