/* 
    Public REST message API.
    AUTHOR: Group 10 KTH
    VERSION: 2020-05-08-A
*/

const express = require('express');
const router = express.Router();
const {DisplaySchema} = require('../../db/db');
const {checkDisplay} = require('../../account/account');
const mongoose = require('mongoose');

/*
    Set current message.
    Route POST /message/set/
    BODY: { display, message, session }
    ACCEPTED RESPONSE: { accepted, echo:{ display, message } }
    ERROR RESPONSE: { accepted, error }
*/
router.post('/set', (req, res) => {
  const { display, message, session } = req.body;
  if(!display || !message || !session)
    return res.status(500).json({accepted:false, error:"Missing parameter.", echo:{ display:display, message:message }});
  
  checkDisplay(session, display, (data) => {
    DisplaySchema.findByIdAndUpdate(display, {message: {text: message}}, (err, doc) => {
      if (err) 
        return res.status(500).json({accepted:false, error:err, echo:{ display:display, message:message }});
      return res.status(200).json({accepted:true, echo:{ display:display, message:message }});
      })
    }, (err) => {
      return res.status(500).json({accepted:false, error:err, echo:{ display:display, message:message }});
  });
});

/*
    Schedule a message.
    Route POST /message/schedule/
    BODY: { display, message, time, session }
    ACCEPTED RESPONSE: { accepted, echo:{ display, message, time } }
    ERROR RESPONSE: { accepted, error }
*/
router.post('/schedule', (req, res) => {
  const { display, message, time, session } = req.body;
  if(!display || !message || !time || !session)
    return res.status(500).json({accepted:false, error:"Missing parameter.", echo:{ display:display, message:message, time:time||Date.now() }});
    
  checkDisplay(session, display, (data) => {
    DisplaySchema.findOneAndUpdate({_id: display}, {$push: {scheduled:{text: message, time: time||Date.now()}}}, (err, doc) => {
      if (err) 
        return res.status(500).json({accepted:false, error:err, echo:{ display:display, message:message, time:time||Date.now() }});
      return res.status(200).json({accepted:true, echo:{ display:display, message:message, time:time||Date.now() }});
    })
    }, (err) => {
      return res.status(500).json({accepted:false, error:err, echo:{ display:display, message:message, time:time||Date.now() }});
  });
});


    
module.exports = router;