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
  response.send({'ack': true,
                message: "API Clear Fashion d'Inès PEREZ aka Nayru"}
  );
});


app.listen(PORT);

console.log(`📡 Runniing on port ${PORT}`);



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

  const brands = await collection.distinct('brand');
  response.send(brands);
});

app.get('/colors', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');

  const colors = await collection.distinct('color', { 
    color: { 
      $nin: ['Adults', "You"],
      $regex: /^[A-Za-z]/
    }
  });
  response.send(colors);
});

/*app.get('/products', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);

  const collection = db.collection('products');

  const products = await collection.find({}).toArray();
  response.send(products);
});*/

app.get('/products', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  const size = parseInt(request.query.size) || 12 // default page size is 10
  const page = parseInt(request.query.page) || 1; // default page is 1
  
  const startIndex = (page - 1) * size;
  const endIndex = page * size;

  let filter = {};
  if (request.query.brand) {
    filter.brand = request.query.brand;
  }
  if (request.query.pricelt) {
    filter.price = {$lte: parseInt(request.query.pricelt)};
  }
  if (request.query.pricegt) {
    console.log(request.query.pricegt)
    filter.price = {$gte: parseInt(request.query.pricegt)};
  }
  if (request.query.date) {
    //filter.date = {$lte: request.query.date};

    const days = parseInt(request.query.date);
    const date = new Date();
    date.setDate(date.getDate() - days);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    const newDate = `${year}-${month}-${day}`;
  
    filter.date = {$gte: newDate};
  }

const options = {
    sort: {price: 1, date:1}
};

  const products = await collection.find(filter, options).skip(startIndex).limit(size).toArray();

  response.send({
    currentProducts: products,
    currentPagination: {currentPage: page, 
      currentSize: products.length,
      pageCount: Math.ceil(await collection.countDocuments(filter) / size)
    },
    totalNumber: await collection.countDocuments(filter),
    currentBrand: filter.brand
  });
});