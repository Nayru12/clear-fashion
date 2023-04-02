const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ines:1234@clustercf.42ufne6.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

//------------------------------------ CREATE DB ------------------------------------

async function createDB() {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);

  const products = require('./products2.json');
  const collection = db.collection('products');

  await collection.deleteMany({});
  const result = await collection.insertMany(products);

  console.log(result);

  client.close();  
}

//createDB();

//------------------------------------ QUERIES ------------------------------------

async function queries(){
  //------------Connect------------
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);

  const products = require('./products2.json');
  const collection = db.collection('products');


  //------------Given Brands------------
  const brand = 'Montlimart';
  const products_given = await collection.find({brand}).toArray();

  console.log(products_given);

  //------------Less than a price------------
  const price = 40;
  const products_price = await collection.find({ "price" : { $lt : price } }).toArray();

  console.log(products_price);

  //------------Sorted by price------------
  const products_sortedprice = await collection.aggregate([{$sort : {"price" : 1}}]).toArray();

  console.log(products_sortedprice);


  //------------Sorted by date------------
  const products_sorteddate = await collection.aggregate([{$sort : {"date" : 1}}]).toArray();

  console.log(products_sorteddate);


  //------------Scraped less than 2 weeks------------
  const dateVar = new Date();
  dateVar.setDate(dateVar.getDate()-14);

  const products_date = await collection.find({ "date" : { $gt : new Date(dateVar).toISOString() } }).toArray();

  console.log(products_date);


  //------------Close------------
  client.close();
}

queries();