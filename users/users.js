const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.argv.slice(2)[0];
const app = express();
const { UserModel } = require('../items/database')

app.use(bodyParser.json());

const skills = [
  { id: 0, name: 'reading item' },
  { id: 1, name: 'creation item' },
  { id: 2, name: 'editing item' },
];

app.get('/users', async (req, res) => {
  const users = await UserModel.find({});
  console.log('Returning users list');
  res.send(users);
});
app.get('/user', async (req, res) => {
  const item = await UserModel.find({id: req.body.userId});
  console.log(req.body.userId)
  console.log('Returning user');
  res.send(item[0]);
});
app.get('/skills', (req, res) => {
  console.log('Returning skills list');
  res.send(skills);
});

app.post("/add_user", async (request, response) => {
  const user = new UserModel(request.body);

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/user/**', async (req, res) => {
  const userId = parseInt(req.params[0]);
  const foundUser = await UserModel.findOneAndUpdate({id: userId});

  if (foundUser) {
      for (let attribute in foundUser) {
          if (req.body[attribute]) {
              foundUser[attribute] = req.body[attribute];
              await foundUser.save()
              console.log(`Set ${attribute} to ${req.body[attribute]} in user: ${userId}`);
          }
      }
      res.status(202).header({Location: `http://localhost:${port}/user/${foundUser.id}`}).send(foundUser);
  } else {
      console.log(`user not found.`);
      res.status(404).send();
  }
});

app.use('/img', express.static(path.join(__dirname,'img')));

console.log(`users service listening on port ${port}`);
app.listen(port);