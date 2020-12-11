/* eslint-disable no-console */
const cheerio = require('cheerio');
const axios = require('axios');
const readline = require('readline');
const fs = require('fs');
const { RECIPE_URL } = require('../../config/config');
// const APIError = require('../utils/APIError.utils');
// const BlueApronRecipeLinks = require('../assets/BlueApronRecipeLinks.txt');

const RAISE_URL = 'https://www.raise.com/buy-gift-cards'

// module.exports = {
  // const fetchData = async (endpoint) => {
  //   console.log('attempting to fetch');
  //   console.log(`${'https://www.raise.com/buy-gift-cards?page=1'}`);

  //   const source = axios.CancelToken.source();
  //   setTimeout(() => {
  //     source.cancel();
  //     console.log('safety cancel');
  //   }, 100000);

  //   const pageCalls = new Array(28).fill().map(() => axios.get(`${'https://www.raise.com/buy-gift-cards?page=1'}`, { cancelToken: source.token }))

  //   const response = await Promise.all(pageCalls)

  //   // console.log("response:", response)
  //   // const result = await axios.get(`${'https://www.raise.com/buy-gift-cards?page=1'}`, { cancelToken: source.token });

  //   return cheerio.load(response.data, {
  //     xml: {
  //       normalizeWhitespace: true,
  //     },
  //   });
  // };

  let db = []

  

  const fetchData = async (pageNumber) => {
    console.log("fetching page: ", pageNumber)

    axios.get(`${RAISE_URL}?page=${pageNumber}`).then(response => {
      const $ = cheerio.load(response.data, { xml: { normalizeWhitespace: true } })

      const maxPage = Math.max(...Array.from($('.pagination li a')).filter(el => !isNaN(parseInt(el.children[0].data))));

      const giftCards = Array.from($('.product-source a')).map(el => {        
        // // recipe.author = $('meta[itemprop=author]').attr('content');
        // console.log($(el.children).find('img')[0].attribs.src)
        return {
          // id: JSON.parse(el.attribs['data-ga']).label,
          raiseId: el.attribs.href.substring('/buy-'.length, el.attribs.href.length - '-gift-cards'.length),
          brandName: JSON.parse(el.attribs['data-ga']).label,
          discount: Math.round((parseFloat(JSON.parse(el.attribs['data-ga']).value) + Number.EPSILON) * 100) / 100,
          listingUrl: `https://www.raise.com${el.attribs.href}`,
          brandLogoUrl: $(el.children).find('img')[0].attribs.src

        }
      })

     db = [...db, ...giftCards] 
     console.log("db.length:", db)

     if (pageNumber >= 1) return;

      setTimeout(() => { 
       fetchData(pageNumber + 1) 
      }, 1000);

      // console.log("db.length:", db)

    }).catch(err => {
      console.log("fetch failed:", err)
    })
  }

fetchData(1)