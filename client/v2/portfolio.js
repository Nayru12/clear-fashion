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
let allBrands = [];

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

const setBrands = ({result}) => {
  allBrands = result;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {allBrands};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {allBrands};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
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
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
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
  const options =  brands_name //["None", ...brands_name] //spread operator to unpack elements
    .map(name => {
      return `<option value="${name}">${name}</option>`
    })
    .join('');
  
  selectBrand.innerHTML = options;
};

const render = (products, pagination, brands) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);

  renderBrands(brands);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();

  setCurrentProducts(products);
  setBrands(brands);
  render(currentProducts, currentPagination, allBrands);
});


/*--------------------- TODO 1 -----------------------------*/
//Feature 1 : Browse pages
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/*--------------------- TODO 2 -----------------------------*/
//Feature 2 : Filter by brands
selectBrand.addEventListener('change', async (event) =>{
  
  const selectedBrand = event.target.value;
  
  const products_filter = currentProducts.filter(function(product) {
    return (product.brand == selectedBrand);
  });

  render(products_filter, currentPagination, selectedBrand);
});


/*--------------------- TODO 3 -----------------------------*/
//Feature 3 : Filter by recent products (less than 3 months otherwise there is no results)
let flag_recent = false;
function filterReleased(){
  if(!flag_recent){
    const date = new Date();

    const products_filter = currentProducts.filter(function(product) {
      return ((date - new Date(product.released))/(1000*60*60*24) > 90);
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
        new Date(product1.released) - new Date(product2.released));
      break;
    case "date-asc":
      products_filter = currentProducts.sort((product1, product2) => 
        new Date(product2.released) - new Date(product1.released));
      break;
  }
  render(products_filter, currentPagination);  
});


/*--------------------- TODO 7 ----------------------------*/
//There was no Feature 7


/*--------------------- TODO 8 -----------------------------*/
//Feature 8: Number of products indicator
//Already done


/*--------------------- TODO 9 -----------------------------*/
//Feature 9: Number of recent products indicator