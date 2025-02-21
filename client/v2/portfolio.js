// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
let allFetchBrands = [];
let allFetchColors = [];

let currentBrand = {};
let favorites = [];
let allProducts = {};
let currentNumber;
let pricelt;
let pricegt;
let date;
let size;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const selectPrice = document.querySelector('#price-select');
const spanNbBrands = document.querySelector('#nbBrands');
const spanNbNews = document.querySelector('#nbNews');
const spanNbPrice50 = document.querySelector('#nbPrice50');
const spanNbPrice90 = document.querySelector('#nbPrice90');
const spanNbPrice95 = document.querySelector('#nbPrice95');
const spanLastReleased = document.querySelector('#lastReleased');
const selectFavorite = document.querySelector('#favProducts-select');
const selectDate = document.querySelector('#date-select');
const spanNbFavorites = document.querySelector('#nbFavorites');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
/*const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  //currentProducts = currentProducts.map(product => {return {...product, favorite:"false"}});
  currentProducts.forEach((product, index) => {
    currentProducts[index] = {...product, favorite : false};
  })
  currentPagination = meta;
};*/

/*const setBrands = ({result}) => {
  allBrands = result;
};*/

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */

//`https://clear-fashion-api.vercel.app?page=${page}&size=${size}`

const fetchProducts = async (page = 1, size = 12, brand='', pricelt='', pricegt='', date='') => {
  try {
    const response = await fetch(
      `https://clear-fashion-nlp1.vercel.app/products?page=${page}&size=${size}&brand=${brand}&pricelt=${pricelt}&pricegt=${pricegt}&date=${date}`
    );
    const body = await response.json();
    
    currentProducts = body.currentProducts;
    currentPagination = body.currentPagination;
    currentBrand = body.currentBrand;
    currentNumber = body.totalNumber;
    size = size;
    pricegt = pricegt;
    pricelt = pricelt;
    date = date;

    if(body == null){
      console.error(body);
      return {currentProducts, currentPagination, currentBrand};
    }
    return {currentProducts, currentPagination, currentBrand};
  } catch (error) {
      console.error(error);
      return {currentProducts, currentPagination, currentBrand};
    }
    /*if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }*/
};

const fetchAllProducts = async (size = 1576) => {
  try {
    const response = await fetch(
      `https://clear-fashion-nlp1.vercel.app/products?size=${size}`
    );
    const body = await response.json();
    
    allProducts = body;

    if(body == null){
      console.error(body);
      return {allProducts};
    }
    return {allProducts};
  } catch (error) {
      console.error(error);
      return {allProducts};
    }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-nlp1.vercel.app/brands`
    );
    const body = await response.json();
    allFetchBrands = body;

    return {allFetchBrands};/*
    if (body.success !== true) {
      console.error(body);
      return {allBrands};
    }

    return body.data;*/
  } catch (error) {
    console.error(error);
    return {allFetchBrands};
  }
};

/*const fetchColors = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-nlp1.vercel.app/colors`
    );
    const body = await response.json();
    allFetchColors = body;

    return {allFetchColors};
    if (body.success !== true) {
      console.error(body);
      return {allBrands};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {allFetchColors};
  }
};*/

/**
 * Render list of products
 * @param  {Array} products
 * adding Feature 12: Open product link
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.classList.add('wrapper');
  const template = products
    .map(product => {
      const isFavorite = favorites.includes(product._id) ? 'favorite' : 'no_favorite';
      if (isFavorite === 'favorite') {
        product.favorite = true;
      }
      return `
      <div class="product" id=${product._id}>
        <a target="_blank" rel="noopener noreferrer" href="${product.link}"> <img src=${product.image}><br/>
        <span class="brand">${product.brand}</span>
        <span class="date">${product.date}</span><br/>
        <span class="name">${product.name}<br/></span></a>
        <span class="price">${product.price}€</span>
        <button id="favorite-select" class=${isFavorite}>Favori</button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = `<h2>Products - ${currentPagination.currentSize} out of ${currentNumber} results</h2>`;
  sectionProducts.appendChild(fragment);
};


/**
 * Render page selector
 * @param  {Object} pagination
 */

const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 * @param  {Array} products
 */

const renderIndicators = (products, pagination) => {
  const {currentSize} = pagination;

  spanNbProducts.innerHTML = allProducts.totalNumber;


  //Feature 8 : Number of brands indicator
  var {length} = allFetchBrands;
  
  spanNbBrands.innerHTML = length;


  //Feature 9 : Number of recent products indicator
  
  const {length : recent_length} =  allProducts.currentProducts.filter(product =>
    ((new Date() - new Date(product.date))/(1000*60*60*24) < 30));
    
  spanNbNews.innerHTML = recent_length;


  //Feature 10 : p50, p90 and p95 price value indicator
  allProducts.currentProducts.sort((product1, product2) => product1.price - product2.price);
  spanNbPrice50.innerHTML = allProducts.currentProducts[Math.round(50/100 * (allProducts.currentProducts.length+1))-1].price;
  spanNbPrice90.innerHTML = allProducts.currentProducts[Math.round(90/100 * (allProducts.currentProducts.length+1))-1].price;
  spanNbPrice95.innerHTML = allProducts.currentProducts[Math.round(95/100 * (allProducts.currentProducts.length+1))-1].price;


  //Feature 11 : Last released date indicator
  allProducts.currentProducts.sort((product1, product2) => new Date(product2.date) - new Date(product1.date));
  spanLastReleased.innerHTML = allProducts.currentProducts[0].date;

};

/**
 * Render brands selector
 * @param  {Object} brands_name
 */
/*const renderBrands = brands_name => {
  const options =  Array.from(
    (value, index) => `<option value="${index}">${index}</option>`
  ).join('');

  
  selectBrand.innerHTML = options;
};*/

const renderBrands = brands_name => {
  //const {allBrands} = brands_name;
  //const options = ['All'].concat(brands_name)
 const options = ["All", ...brands_name] //spread operator to unpack elements
    .map(name => {
      const value = name === "All" ? "" : name;
      return `<option value="${value}">${name}</option>`
    })
    .join('');
  
  selectBrand.innerHTML = options;
  const currentBrandIndex = brands_name.indexOf(currentBrand);
  const selectedIndex = currentBrandIndex !== -1 ? currentBrandIndex + 1 : 0;
  selectBrand.selectedIndex = selectedIndex;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(products, pagination);

  renderBrands(allFetchBrands);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), currentBrand, pricelt, pricegt, date);

  //setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();
  const all = await fetchAllProducts();

  //setCurrentProducts(products);
  //setBrands(brands);
  
  render(currentProducts, currentPagination, currentBrand, pricelt, pricegt, date);
});


/*--------------------- TODO 1 -----------------------------*/
//Feature 1 : Browse pages
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), size, currentBrand, pricelt, pricegt, date);

  //setCurrentProducts(products);
  render(currentProducts, currentPagination, currentBrand);
});


/*--------------------- TODO 2 -----------------------------*/
//Feature 2 : Filter by brands
selectBrand.addEventListener('change', async (event) =>{
  
  let selectedBrand = event.target.value;
  
  /*const products_filter = currentProducts.filter(function(product) {
    return (product.brand == selectedBrand);
  });*/
  selectedBrand = selectedBrand == "All" ? '' : selectedBrand;

  const products_filter = await fetchProducts(parseInt(event.target.value), size, selectedBrand, pricelt, pricegt, date);
  render(currentProducts, currentPagination);
});


/*--------------------- TODO 3 -----------------------------*/
//Feature 3 : Filter by recent products (less than 1 month otherwise there is no results)
//update: less than 15 days
let flag_recent = false;
function filterReleased(){
  if(!flag_recent){
    const date = new Date();

    const products_filter = currentProducts.filter(function(product) {
      return ((date - new Date(product.date))/(1000*60*60*24) < 15);
    });

    flag_recent = true;
    render(products_filter, currentPagination);}

  else{
    render(currentProducts, currentPagination);
    flag_recent = false;}
};


/*--------------------- TODO 4 -----------------------------*/
//Feature 4: Filter by reasonable price
let flag_reasonable = false;

function filterPrice(){
  if(!flag_reasonable){
    const date = new Date();

    const products_filter = currentProducts.filter(function(product) {
      return (product.price < 50);
    });

    flag_reasonable = true;
    render(products_filter, currentPagination);}

  else{
    render(currentProducts, currentPagination);
    flag_reasonable = false;}
};


/*--------------------- TODO 5 & 6-----------------------------*/
//Feature 5: Sort by price and by date
selectSort.addEventListener('change', async (event) =>{
  
  const sorting_type = event.target.value;
  //const sort_products = await fetchProducts(1, currentNumber, currentBrand, pricelt, pricegt, date);

  let products_filter;
  switch (sorting_type) {
    case "price-desc":
      products_filter = currentProducts.sort((product1, product2) => 
        product2.price - product1.price);
      break;
    case "price-asc":
      products_filter = currentProducts.sort((product1, product2) => 
        product1.price - product2.price);
      break;
    case "date-desc":
      products_filter = currentProducts.sort((product1, product2) => 
        new Date(product1.date) - new Date(product2.date));
      break;
    case "date-asc":
      products_filter = currentProducts.sort((product1, product2) => 
        new Date(product2.date) - new Date(product1.date));
      break;
  }
  render(products_filter, currentPagination);  
});


/*--------------------- TODO 7 ----------------------------*/
//Let's say it is the feature 8
//Feature 7 (or 8): Number of products indicator
//Already done


/*--------------------- TODO 8 -----------------------------*/
//Adding a new feature that was not on git : number of brands
//Feature 8: Number of brands indicator
//Inside the renderIndicators method


/*--------------------- TODO 9 -----------------------------*/
//Feature 9: Number of recent products indicator
//Inside the renderIndicators method


/*--------------------- TODO 10 -----------------------------*/
//Feature 10: p50, p90 and p95 price value indicator
//Inside the renderIndicators method


/*--------------------- TODO 11 -----------------------------*/
//Feature 11: Last released date indicator
//Inside the renderIndicators method


/*--------------------- TODO 12 -----------------------------*/
//Feature 12: Open product link
//Add this in the renderProducts method:
//<a target="_blank" rel="noopener noreferrer" href ="${product.link}">${product.name}</a>


/*--------------------- TODO 13 -----------------------------*/
//Feature 13: Save as favorite
sectionProducts.addEventListener('click', event => {

  const productElement = event.target.parentNode;
  const id = productElement.id;
  const index = currentProducts.findIndex(product => product._id == id);
  const index_all = allProducts.currentProducts.findIndex(product => product._id == id);

  if (allProducts.currentProducts[index_all].favorite == true) {
    event.target.style.backgroundColor = 'white';
    event.target.style.color = 'black';
    allProducts.currentProducts[index_all].favorite = false;
  } 
  
  else {
    event.target.style.backgroundColor = 'red';
    event.target.style.color = 'white';
    allProducts.currentProducts[index_all].favorite = true;
  }

  if (favorites.includes(id)) {
    const indexRemove = favorites.indexOf(id);
    if (indexRemove > -1) { 
      favorites.splice(indexRemove, 1);
    }
  } 
  
  else {
    favorites.push(id);
  }

  //Additional Feature: Number of favorites products indicator
  spanNbFavorites.innerHTML = favorites.length;
});


/*--------------------- TODO 14 -----------------------------*/
//Feature 14: Filter by favorite

/*let flag_favorite = false;
//currentPagination.currentSize = 
function filterFav(){
  //const products_fav = await fetchProducts('', 1572);
  if(!flag_favorite){
    const products_filter = currentProducts.filter(function(product) {
      return (product.favorite == true);
    });

    flag_favorite = true;
    selectFavorite.classList.add('btn-red'); // ajouter la classe CSS 'btn-red'
    render(products_filter, currentPagination);}

  else{
    flag_favorite = false;
    selectFavorite.classList.remove('btn-red'); // retirer la classe CSS 'btn-red'
    render(currentProducts, currentPagination);
  }
};*/

let flag_favorite = false;
//currentPagination.currentSize = 
async function filterFav(){
  const products_fav = allProducts.currentProducts;
  if(!flag_favorite){
    const products_filter = allProducts.currentProducts.filter(product => favorites.includes(product._id));

    flag_favorite = true;
    selectFavorite.classList.add('btn-red'); // ajouter la classe CSS 'btn-red'
    render(products_filter, currentPagination);}

  else{
    flag_favorite = false;
    selectFavorite.classList.remove('btn-red'); // retirer la classe CSS 'btn-red'
    render(currentProducts, currentPagination);
  }
};

/*--------------------- ADDITIONALS FEATURES -----------------------------*/
//Feature Additional n°1: Sort by price
let patate;
selectPrice.addEventListener('change', async (event) =>{

  const sorting_type = event.target.value;

  let products_price;
  switch (sorting_type) {
    case "no_filter":
      products_price = await fetchProducts(currentProducts, size);
      patate =products_price;
      break;
    case "20":
      products_price = await fetchProducts(currentProducts, size, currentBrand, parseInt(event.target.value));
      patate = products_price;
      break;
    case "reasonable":
      products_price = await fetchProducts(currentProducts, size, currentBrand, 50);
      break;
    case "80":
      products_price = await fetchProducts(currentProducts, size, currentBrand, parseInt(event.target.value));
      break;
    case "100":
      products_price = await fetchProducts(currentProducts, size, currentBrand, parseInt(event.target.value));
      break;
    case "101":
      products_price = await fetchProducts(currentProducts, size, currentBrand, '', parseInt(event.target.value));
      break;
    case "200":
      products_price = await fetchProducts(currentProducts, size, currentBrand, '', parseInt(event.target.value));
      break;
    default:
      break;
  }

  render(products_price.currentProducts, currentPagination, currentBrand); 
});


//Feature Additional n°2: Sort by date
selectDate.addEventListener('change', async (event) =>{
  
  const sorting_type = event.target.value;
  
  let products;
  var day;
  switch (sorting_type) {
    case "no_filter":
      products = await fetchProducts(currentProducts, size, currentBrand, pricelt, pricegt, date);
      break;
    case "recently":
      products = await fetchProducts(currentProducts, size, currentBrand, pricelt, pricegt, 15);
      break;
    case "1":
      products = await fetchProducts(currentProducts, size, currentBrand, pricelt, pricegt, 30);
      break;
    case "3":
      products = await fetchProducts(currentProducts, size, currentBrand, pricelt, pricegt, 90);
      break;
    case "5":
      products = await fetchProducts(currentProducts, size, currentBrand, pricelt, pricegt, 150);
      break;
    default:
      break;
  }

  render(currentProducts, currentPagination, currentBrand); 
});