/* eslint-disable no-console, no-process-exit */

/*const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimart');
const circlesportswearbrand = require('./eshops/circlesportswear');*/

//async function sandbox (eshop = 'https://shop.circlesportswear.com/collections/t-shirts-homme') {
  //https://www.montlimart.com/99-vetements
  //https://www.dedicatedbrand.com/en/men/news'
  //https://shop.circlesportswear.com/collections/t-shirts-homme


async function sandbox (eshop, brand_rq) {
  try {
    console.log(`======== 🕵️‍♀️  browsing ${eshop} eshop ========`);

    const brand = require('./eshops/' + brand_rq);
    const products = await brand.scrape(eshop);

    const json_products = products.map(product => JSON.stringify(product)).join('\n');

    var fs = require('fs');
    fs.appendFile("products.json", json_products, function(err, result) {
      if(err) console.log('error', err);
    });

    console.log(products);
    console.log('done');
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

//const [,, eshop] = process.argv;

const eshop = ['https://www.dedicatedbrand.com/en/men/all-men',
    'https://www.montlimart.com/99-vetements',
    'https://shop.circlesportswear.com/collections/collection-homme'];

const brands = ['dedicatedbrand',
    'montlimart',
    'circlesportswear'];


async function display() {
  for (let i = 0; i < eshop.length; i++) {
    await sandbox(eshop[i], brands[i]);
  }
};

var fs = require('fs');
    fs.writeFile("products.json", '', function(err, result) {
      if(err) console.log('error', err);
    });

display();
