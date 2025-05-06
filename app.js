const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('68195608783d1eedc6f3bf60')
    .then(user => {
      req.user = user;    //will actually get the mongoose model hennce all function will work on it
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://Ayush_Yadav_445:123445Ilmf@cluster0.0zoivgo.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
  .then(result => {
    User.findOne().then(user1 => {
      if(!user1) {
        const user = new User({
          name: 'Ayush',
          email: 'test@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    })
    //console.log(result);
    
    console.log('connected!');
    app.listen(3000);
  }).catch(err => {
    console.log(err);
  });
