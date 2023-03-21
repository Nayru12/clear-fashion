const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;
const {ObjectID} = require('bson');
var ObjectId= require('mongodb').ObjectId;
const app = express();


const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ines:1234@clustercf.42ufne6.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';


module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);



//641048bc94ccbc2e08b66abd
//http://localhost:8092/products/search?limit=10&brand=Dedicated&price=30


app.get('/products/search', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');
  const query = {};

  // limit
  const limit = parseInt(request.query.limit) || 12;

  // brand
  if (request.query.brand) {
      query.brand = request.query.brand;
  }

  // price
  if (request.query.price) {
      query.price = {$lte: parseInt(request.query.price)};
  }

  const options = {
      sort: {price: 1},
      limit: limit
  };

  const products = await collection.find(query, options).toArray();
  response.send(products);
});

app.get('/products/:id', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');

  const product = await collection.find({_id: new ObjectId(request.params.id)}).toArray();
  response.send(product);
});

app.get('/brands', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');

  const products = await collection.distinct('brand');
  response.send(products);
});

app.get('/products', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');

  const products = await collection.find({}).toArray();
  response.send(products);
});