const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.products-list__block')
    .map((i, element) => {
      const name = $(element)
        .find('.text-reset')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );

      const color = $(element)
      .find('.product-miniature__color')
      .text()
      .trim()
      .replace(/\s/g, ' ');;

      const link = $(element)
        .find('.text-reset')
        .attr('href');
      
      const detail = "No data";

      var image = $(element)
        .find('.w-100')
        .attr('data-src');
      
      if(image===undefined){
        image=$(element)
        .find('source[type="video/mp4"]')
        .attr('src');
      }
      
      const brand = "Montlimart";

//.price inside .product-miniature__pricing
//.text-reset inside product-miniature__title
//js-product-list
//products-list row
//document.querySelectorAll('.products-list__block') 

      return {name, price, color, link, detail, image, brand};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
