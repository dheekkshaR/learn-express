const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/adduser', (req, res) => {
  if (!req.users) {
    return res.status(404).json({
      error: { message: 'Users not found', status: 404 }
    });
  }

  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) {
      console.log('Failed to write');
      res.status(500).send('Failed to write');
    } else {
      console.log('User Saved');
      res.send('done');
    }
  });
});

module.exports = router;
