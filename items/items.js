const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const port = process.argv.slice(2)[0];
const app = express();
const { ItemModel, CartModel } = require('./database')

app.use(bodyParser.json());


const usersService = 'http://localhost:8081';
const cartService = 'http://localhost:8083';

app.get('/items', async (req, res) => {
    const items = await ItemModel.find({});
    console.log('Returning items list');
    res.send(items);
});
app.get('/item', async (req, res) => {
    const item = await ItemModel.find({id: req.body.itemId});
    console.log(req.body.itemId)
    console.log('Returning item');
    res.send(item[0]);
});

app.post("/add_item", async (request, response) => {
    const item = new ItemModel(request.body);
    try {
      await item.save();
      response.send(item);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.post('/assignment', (req, res) => {
    request.post({
        headers: { 'content-type': 'application/json' },
        url: `${usersService}/user/${req.body.userId}`,
        body: `{
          "cart": ${req.body.cartId}
      }`
    }, async (err, userResponse, body) => {
        if (!err) {
            const itemId = parseInt(req.body.itemId);
              
            const item = await ItemModel.findOneAndUpdate({id: itemId});
            item.assignedUser = req.body.userId;
            await item.save();
            res.status(202).send(item);
        } else {
            res.status(400).send({ problem: `user Service responded with issue ${err}` });
        }
    });
});

app.post('/cart', async (req, res) => {
    const items = await ItemModel.find({})
    console.log(req.body.itemId)
    request.post({
        headers: { 'content-type': 'application/json' },
        url: `${cartService}/cart/${req.body.cartId}`,
        body: `{
            "item": ${req.body.itemId}
      }`
    }, async (err, reserveResponse, body) => {
        if (!err) {
            const itemId = parseInt(req.body.itemId);
            const updatedItem = await CartModel.findOneAndUpdate(
                { cartId: req.body.cartId },
                { $set: { items: req.body.itemId } },
                { new: true }
              );
              res.status(202).send(updatedItem);
        } else {
            res.status(400).send({ problem: `cart Service responded with issue ${err}` });
        }
    });
});

app.use('/img', express.static(path.join(__dirname, 'img')));

console.log(`items service listening on port ${port}`);
app.listen(port);
