const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this); //We can also just use basic return statement instead of using promise here as we can use promise where we get this return
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }
    // const updatedCartItems = [];  //
    // updatedCartItems.push({
    //   productId: new ObjectId(product._id),
    //   quantity: 1
    // });    //
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    })
    return db.collection('products').find({_id: {$in: productIds}})      //$in takes a array of which we want to compare in this case _id. and returns a cursor of products that satisfies it.
    .toArray()
    .then(products => {
      return products.map(p => {
        return{...p, 
          quantity: this.cart.items.find(i => {     //this function does is to repopulate the product with the quantity that the user has in cart
            return i.productId.toString() === p._id.toString();     //for this it maps through it finds where product id match and return the product
          }).quatity    //whereas this ensures that from the product in cart we onnly capture the quantity
              //In mongodb this is the only way through which we can manually put JOIN on the collection
        };
      })
    })
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: {items: updatedCartItems } } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })  //////This next is used because we deal with a cursor here, we can also use findOne and just not deal with it
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
