// Required packages
const request = require('request-promise');
const cheerio = require('cheerio');
// Models
const Digikala = require('./../models/Digikala');
// Configs
const configs = require('./../configs/digikala');
// Persian number converter
const
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
    fixNumbers = function (str) {
        if (typeof str === 'string') {
            for (var i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
    },
    getPageDiscounts = async (url) => {
        try {
            const body = await request({
                method: 'GET',
                url,
                json: true
            })
            let $ = cheerio.load(body);
            // let pageResult = [];
            await $('.c-listing__items').find('div.c-price__discount-oval').each(async (index, element) => {
                const result = {};
                let percent = (element.children[0].children[0].data).trim().replace('٪', '');
                let lastPrice = element.parentNode.children[0].children[0].data.trim();
                let activePrice = element.next.children[0].data.trim();
                let data = ($(element).parents('li')[0].children[0].attribs)
                let link = `https://digikala.com${($($(element).parents('.c-product-box__content')[0].prev).attr('href')).split('?')[0]}`;
                let image = ($($(element).parents('.c-product-box__content')[0].prev).find('img')[0].attribs)
                Object.assign(result, {
                    productId: data['data-id'],
                    faTitle: data['data-title-fa'],
                    enTitle: data['data-title-en'],
                    lastPrice: fixNumbers(lastPrice),
                    activePrice: fixNumbers(activePrice),
                    percent: fixNumbers(percent),
                    image: image['src'],
                    link
                })
                console.log(result)
                try {
                    await Digikala.create(result);
                } catch (error) {
                    console.log(error)
                }
            })
            return pageResult;
        } catch (error) {
            throw Error(error)
        }
    },
    getPageNumber = async (url) => {
        try {
            let body = await request({
                method: 'GET',
                url: url,
                json: true
            })
            let $ = cheerio.load(body);
            let href = Number($('a.c-pager__next')[0].attribs.href.split('&')[1].replace('pageno=', ''))
            return href;
        } catch (error) {
            throw Error(error)
        }
    }


module.exports = {
    async getAllDiscounts(url) {
        let result = []
        try {
            const pageNo = await getPageNumber(url);
            for (let i = 1; i <= pageNo; ++i) {
                try {
                    const data = await getPageDiscounts(`${url}?pageno=${i}`);
                    result = result.concat(data);
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log('Error in getting page number', error)
        }
        return (result);
    }
}