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
    getPageDiscounts = async (url, faCetegory, enCategory) => {
        try {
            const body = await request({
                method: 'GET',
                url,
                json: true
            })
            let $ = cheerio.load(body);
            // console.log($('.c-listing__items').find('div.c-price__discount-oval').length)
            $('.c-listing__items').find('div.c-price__discount-oval').each(async (index, element) => {
                console.log('url', url)
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
                    lastPrice: (fixNumbers(lastPrice)).replace(/,/g, ''),
                    activePrice: (fixNumbers(activePrice)).replace(/,/g, ''),
                    percent: fixNumbers(percent).replace(/,/g, ''),
                    image: image['src'],
                    link,
                    faCetegory,
                    enCategory
                })
                console.log(result)
                try {
                    const product = await Digikala.findOne({ productId: result['productId'] });
                    if (!product) {
                        const createResult = await Digikala.create(result);
                    } else {
                        if (product['lastPrice'] != result['lastPrice'] || product['activePrice'] != result['activePrice'] || product['percent'] != result['percent']) {
                            const updateResult = await Digikala.findOneAndUpdate({ _id: product._id }, result)
                        }
                    }
                } catch (error) {
                    console.log('Database Error', error)
                }
            })
            return `End of ${url} url`;
        } catch (error) {
            console.log(error)
            throw Error('Request Error', error)
        }
    },
    getPageNumber = async (url) => {
        console.log(url)
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
            console.log(error)
            throw Error(error)
        }
    }


module.exports = {
    async getAllDiscounts(url, faCetegory, enCategory) {
        try {
            const pageNo = await getPageNumber(url);
            console.log('pageNo', url, pageNo)
            for (let i = 1; i <= pageNo; ++i) {
                // console.log('PAGENUMBER', i)
                try {
                    const data = await getPageDiscounts(`${url}?pageno=${i}`);
                    console.log(data)
                } catch (error) {
                    console.log('Page Error', error)
                }
            }
        } catch (error) {
            console.log('Error in getting page number', error)
        }
        return `End of ${url} all pages`
    }
}