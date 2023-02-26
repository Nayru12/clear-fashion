const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.grid__item')
    .filter((i, element) => {
      var name = $(element)
          .find('.full-unstyled-link');

      return name != '';
    })

    .map((i, element) => {
      var name = $(element)
        .find('.full-unstyled-link');
      
      name = name.slice(name.length/2)
        .text()
        .trim()
        .replace(/\s/g, ' ');
      
      var price = $(element)
        .find('.money');
      
      price = parseInt(price.slice(price.length/2)
        .text()
        .trim()
        .replace(/\s/g, '')
        .replace("€", ""));
      
      const color = $(element)
        .find('.color-variant').eq(0)
        .attr('data-color');
      
      const link = "https://shop.circlesportswear.com" + $(element)
        .find('.full-unstyled-link')
        .attr('href');
      
      var detail = $(element)
        .find('.card__characteristic');
      
      detail = detail.slice(detail.length/2)
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const image = $(element)
        .find('.media')
        .find('img').eq(0)
        .attr('src');
      
      const brand = "Circle Sportswear";

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
