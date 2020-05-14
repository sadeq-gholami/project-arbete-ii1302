/* 
    Internal database component.
    AUTHOR: Group 10 KTH
    VERSION: 2020-05-08-A
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define Display schema structure in database.
const displaySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    message: {
        text:{type:String, default:"Placeholder Message"}, 
        time:{type: Date, default: Date.now},
        overrides:{type: Date, default: Date.now}
    },
    scheduled:[{
        text:{type: String}, 
        time:{type: Date, default: Date.now}, 
        recurring:{type: String, default: "NEVER"} //NEVER, DAILY, WEEKLY
    }]
});
const DisplaySchema = mongoose.model('Display', displaySchema)

//Define User schema structure in database.
const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, unique:true, required: true, dropDups:true},
    hpwd: {type: String, required: true},
    displays:[{
        display:{type: mongoose.Schema.Types.ObjectId}, 
    }]
});
const UserSchema = mongoose.model('User', userSchema);

/*Finds out if a Scheduled message should replace the current message
  and returns a list of remaining scheduled messages and the new current message or null if none exist. */
function findDBScheduled(scheduled){
    let newScheduled = [];
    let maxScheduled = null;
    let now = new Date();
    for(v of scheduled){
      if(v.time < now){
        if(maxScheduled == null)
          maxScheduled = v;
        else if(v.time > maxScheduled.time)
          maxScheduled = v;
      }
      else{
        newScheduled.push(v);
      }
    }
    console.log(maxScheduled, newScheduled);
    return {scheduled:newScheduled, now:maxScheduled};
}

/*Updates the list of scheduled messages and current message*/
function updateDBSchedule(display, scheduled, current, callback, error) {
    if(current != null){
        DisplaySchema.findOneAndUpdate({_id: display}, {message:{text: current.text}, scheduled:scheduled}, (err, doc) => {
            if (err) 
                return error(err);
            callback(doc);
        });
    }
    else {
        DisplaySchema.findOneAndUpdate({_id: display}, {scheduled:scheduled}, (err, doc) => {
            if (err) 
                return error(err);
            callback(doc);
        });
    }
}

/*Updates database if a scheduled message replaces the current*/
function processSchedule(display, list, callback, error) {
    let {scheduled, now} = findDBScheduled(list);
    updateDBSchedule(display, scheduled, now, callback, error);
}

module.exports = {DisplaySchema: DisplaySchema, UserSchema: UserSchema, processSchedule:processSchedule};