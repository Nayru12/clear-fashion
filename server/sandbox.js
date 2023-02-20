/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimart');
const circlesportswearbrand = require('./eshops/circlesportswear');

//async function sandbox (eshop = 'https://shop.circlesportswear.com/collections/t-shirts-homme') {
async function sandbox (eshop, brand_rq) {
  //https://www.montlimart.com/99-vetements
  //https://www.dedicatedbrand.com/en/men/news'
  //https://shop.circlesportswear.com/collections/t-shirts-homme

  
  try {
    console.log(`======== 🕵️‍♀️  browsing ${eshop} eshop ========`);

    const brand = require('./eshops/' + brand_rq);
    const products = await brand.scrape(eshop);

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
  console.log('All done!');
}

//display();
const result_products = sandbox(eshop[2], brands[2]);

const json_file= JSON.stringify(result_products);

//console.log(json_file);

var fs = require('fs');
fs.writeFile("test.json", json_file);