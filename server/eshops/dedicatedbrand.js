const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      const link = "https://www.dedicatedbrand.com" + $(element)
        .find('.productList-link')
        .attr('href');
      
      const detail = $(element)
        .find('.productList-image-materialInfo')
        .text();
      
      const color = name.substring(name.lastIndexOf(" ")+ 1 , name.length);

      const image = $(element)
        .find('.productList-image')
        .find('img').eq(0).attr('data-src');

      const brand = "Dedicated";
        
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
