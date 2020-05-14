/* 
    Public REST display API.
    AUTHOR: Group 10 KTH
    VERSION: 2020-05-08-A
*/

const express = require('express');
const {DisplaySchema, processSchedule} = require('../../db/db');
const {check, addDisplay, getUserDisplays, checkDisplay} = require('../../account/account');
const mongoose = require('mongoose');
const router = express.Router();


/*
    Get all information about a display.
    Route GET /display/get/<DisplayID>/
    ACCEPTED RESPONSE: { accepted, display }
    ERROR RESPONSE: { accepted, error }
*/
router.get('/get/:displayId', (req, res, next)=>{
    const id = req.params.displayId;
    if(!id)
        return res.status(500).json({accepted:false, error:"Missing parameter."});

    DisplaySchema.findById(id)
    .select('_id name message scheduled')
    .exec()
    .then(doc => {
        if(doc){
            let scheduled = doc.scheduled;
            processSchedule(id, scheduled, (doc) => {
                res.status(200).json({
                    accepted:true, 
                    display:{
                        id: doc._id,
                        name: doc.name,
                        message: doc.message,
                        scheduled: scheduled,
                        now: new Date()
                    }
                });
            }, (err) => {
                res.status(500).json({accepted:false, error:err});
            })
        } else{
            res.status(404).json({accepted:false, error:"The is no display mapped to this id."});
        }
    })
    .catch(err => {
        res.status(500).json({accepted:false, error:err});
    });
});

/*
    Create a new display.
    Route POST /display/new/
    BODY: { name, session }
    ACCEPTED RESPONSE: { accepted, display, echo:{ name } }
    ERROR RESPONSE: { accepted, error }
*/
router.post('/new', (req, res, next)=>{
    const {name, session} = req.body;
    if(!name || !session)
        return res.status(500).json({accepted:false, error:"Message parameter."});

    check(session, (data) => {
        let id = new mongoose.Types.ObjectId();
        const n = new DisplaySchema({_id: id, name: name, message: {text: "Hello World!"}});
        n.save().then(() => {
            addDisplay(data.id, id, 
                (m) => {
                    res.status(200).json({accepted:true, display:m.display, echo:{name:name}})
                }, (err) => {
                    res.status(500).json(err)
                })
        }).catch((err) => {
            res.status(500).json({accepted:false, error:err})
        });

    }, (err) => {
        res.status(500).json({accepted:false, error:err})
    })
    
});

/*
    Get name of a display.
    Route GET /display/name/get/<DisplayID>/
    ACCEPTED RESPONSE: { accepted, display: { id, name } }
    ERROR RESPONSE: { accepted, error }
*/
router.get('/name/get/:displayId', (req, res, next)=>{
    const id = req.params.displayId;
    if(!id)
        return res.status(500).json({accepted:false, error:"Missing parameter."});
    DisplaySchema.findById(id)
    .select('name')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                accepted:true, 
                display:{
                    id: id,
                    name: doc.name
                }
            });
        } else{
            res.status(500).json({accepted:false, error:"The is no display mapped to this id."});
        }
    })
    .catch(err => {
        res.status(500).json({accepted:false, error:err});
    });
});

/*
    Post action to get all displays associated with account session.
    Route POST /display/get/all/
    BODY: { session }
    ACCEPTED RESPONSE: { accepted, displays: { _id, name } }
    ERROR RESPONSE: { accepted, error }
*/
router.post('/get/all/', (req, res, next)=>{
    const session = req.body.session;
    if(!session)
        return res.status(500).json({accepted:false, error:"Missing parameter."});

    getUserDisplays(session, (ids) => {
        let pa = [];
        for(let d of ids) {
            let p = DisplaySchema.findById(d.display).select('name').exec();
            pa.push(p);
        }
            
        Promise.all(pa).then(doc => {
            if(doc){
                res.status(200).json({
                    accepted:true, 
                    displays:doc
                });
            } else{
                res.status(500).json({accepted:false, error:"The is no display mapped to this id."});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({accepted:false, error:err});
        });
    }, (err) => {
        console.log(err);
        res.status(500).json({accepted:false, error:err});
    })
    
});
/*
    Post action to set name of Display.
    Route POST /display/name/set/
    BODY: { id, name, session }
    ACCEPTED RESPONSE: { accepted, echo:{ id, name } }
    ERROR RESPONSE: { accepted, error, echo:{ id, name } }
*/
router.post('/name/set', (req, res) => {
    const { id, name, session } = req.body;
    if(!id || !name || !session)
        return res.status(500).json({accepted:false, error:"Missing parameters.", echo:{ id:id, name:name }});
    checkDisplay(session, id, (data) => {
      DisplaySchema.findByIdAndUpdate(id, {name: name}, (err, doc) => {
        if (err) 
          return res.status(500).json({accepted:false, error:err, echo:{ id:id, name:doc.name }});
        return res.status(200).json({accepted:true,  echo:{ id:id, name:name, old:doc.name }});
      })
    }, (err) => {
        return res.status(500).json({accepted:false, error:err, echo:{ id:id, name:name }});
    });
  });

module.exports = router;