const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({    //for this we can use default Javascript dataType
  title: {
    type: String,
    required: true      //Provides more constraints and reduces flexibility
  },                    //If you want more flexibility just dont use the constraints it is an option
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',   //ref is used to essentially make a reference or a relation between two models, if we use embedded document we dont need toexplicitly state it
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);  //model is what is used to create a actual model based on the schema

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;  //We use this ternary operator because if we do not it will create a new object which will be able to pass the if statement in save()
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       // Update the product
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this });  //updateOne takes two arguments. First{} acts like a filter based on which it will find which document needs to be updated. The second {} argument essentially used to define on which basis the update will be done. If we want to updaet the title only we write $set: {title: this.title}, whereas what we did is essentially like $set: {title: this.title, price: this.price and so on};
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(result => {
//         console.log('Deleted');
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;
