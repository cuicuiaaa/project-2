const express = require('express');
const bodyParser = require('body-parser');
const Chats = require('./../models/Chat');

console.log(Chats);
const router = express.Router();

router.route('/chat').get((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;

  const data = Chats.findOne({ message: 'Anonymous' });
  Chats.findOne({}).then(chat => {
    res.json(chat);
  });

  // connectdb.then(db => {
  //   
    
  // });
});

module.exports = router;
