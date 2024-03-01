const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) throw err;
  users = JSON.parse(data);
})

const addMsgToRequest = function (req, res, next) {
  if(users) {
    req.users = users;
    next();
  }
  else {
    return res.json({
        error: {message: 'users not found', status: 404}
    });
  }
  
}

app.use(
  cors({origin: 'http://localhost:3000'})
);
app.use('/read/usernames', addMsgToRequest);

app.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.send(usernames);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req, res) => {
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



app.use('/read/username/:name', addMsgToRequest);
const getUserByUsername = function (req, res) {
  console.log("getUserByUsername");
  const username = req.params.name; // Get the username from request parameters
  const user = req.users.find(user => user.username === username); // Find user by username
  console.log(user);
  if (user) {
    req.userEmail = user.email; // Add user's email to request object
    return res.status(200).json(
      [{
        email: user.email
      }]
    )
  } else {
    return res.status(404).json({
      error: { message: 'User not found', status: 404 }
    });
  }
};

app.get('/read/username/:name', getUserByUsername);
// Middleware function to extract user's email based on username
