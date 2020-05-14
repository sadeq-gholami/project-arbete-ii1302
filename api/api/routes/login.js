/* 
    Public REST login API.
    AUTHOR: Group 10 KTH
    VERSION: 2020-05-08-A
*/

const express = require('express');
const {login, create} = require('../../account/account');
const router = express.Router();

/*
    Login using username and password.
    Route POST /display/new/
    BODY: { username, pwd }
    ACCEPTED RESPONSE: { accepted, session }
    ERROR RESPONSE: { accepted, error }
*/
router.post('/', (req, res, next) => {
    const {username, pwd} = req.body;
    if(!username || !pwd)
        return res.status(200).json({accepted:false, error:"Missing required post body fields: 'username', 'pwd'"});

    login(username, pwd, (r) => {
        res.status(200).json(r);
    })
});

/*
    Create a new account.
    Route POST /login/create/
    BODY: { username, pwd }
    ACCEPTED RESPONSE: { accepted, display, echo:{ name } }
    ERROR RESPONSE: { accepted, error }
*/
router.post('/create/', (req, res, next) => {
    const {username, pwd} = req.body;
    if(!username || !pwd)
        return res.status(200).json({accepted:false, error:"Missing required post body fields: 'username', 'pwd'"});

    create(username, pwd, (r) => {
        res.status(200).json(r);
    })
});

module.exports = router;