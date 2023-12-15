const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.argv.slice(2)[0];
const app = express();
const { CartModel } = require('../items/database')

app.use(bodyParser.json());

// const carts = [
//   {
//     id: 5,
//     displayName: 'Bob Cart',
//     items: [0, 1],
//   },
//   {
//     id: 6,
//     type: 'user',
//     displayName: 'Yulia Cart',
//     items: [0, 2],
//   },
//   {
//     id: 7,
//     displayName: 'Max Cart',
//     items: [1, 2, 3]
//   },
//   {
//     id: 8,
//     displayName: 'Anna Cart',
//     items: [0, 2],
//   },
// ];
/*
app.get('/carts', (req, res) => {
  console.log('Returning carts list');
  res.send(carts);
});



app.use('/img', express.static(path.join(__dirname,'img')));
*/


app.get('/carts', async (req, res) => {
  const cart = await CartModel.find({});
  console.log('Returning carts list');
  res.send(cart);
});

app.post("/add_cart", async (request, response) => {
  const cart = new CartModel(request.body);

  try {
    await cart.save();
    response.send(cart);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/cart/**', async (req, res) => {
  const cartId = parseInt(req.params[0]);
  console.log(req.params)
  const foundCart = await CartModel.findOneAndUpdate({id: cartId});
  console.log(foundCart)
 console.log(req.body)
  if (foundCart) {
    foundCart.items.push(parseInt(req.body.item))
    await foundCart.save()
    //res.status(202).send(foundCart);
   res.status(202).header({Location: `http://localhost:${port}/cart/${foundCart.id}`}).send(foundCart);
  } else {
      console.log(`cart not found.`);
      res.status(404).send();
  }
});

console.log(`carts service listening on port ${port}`);
app.listen(port);