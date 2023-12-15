const mongoose = require('mongoose');

const { Schema, ObjectId, model } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/project', {
  serverSelectionTimeoutMS: 5000
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const ItemSchema = new mongoose.Schema({
  id: Number,
  displayName: String,
  assignedUser: Number,
  cartId: Number
});

const ItemModel = mongoose.model("Item", ItemSchema);

const CartSchema = new mongoose.Schema({
  id: Number,
  displayName: String,
  items: [],
});
const CartModel = mongoose.model("Cart", CartSchema);


const UserSchema = new mongoose.Schema({
  id: Number,
  type: String,
  displayName: String,
  cart: Number,
  img: String
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {ItemModel, CartModel, UserModel};