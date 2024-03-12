const express = require('express');
const router = express.Router();

router.get('/usernames', (req, res) => {
  if (req.users) {
    let usernames = req.users.map(user => ({ id: user.id, username: user.username }));
    res.send(usernames);
  } else {
    res.status(404).json({
      error: { message: 'Users not found', status: 404 }
    });
  }
});

router.get('/username/:name', (req, res) => {
    const username = req.params.name; // Get the username from request parameters
    const user = req.users.find(user => user.username === username); // Find user by username
    if (user) {
      req.userEmail = user.email; // Add user's email to request object
      res.status(200).json([{ email: user.email }]);
    } else {
      res.status(404).json({ error: { message: 'User not found', status: 404 } });
    }
  });

module.exports = router;
