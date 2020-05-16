// Required packages
const request = require('request-promise');
const cheerio = require('cheerio');

module.exports = {
    async getPageDiscounts(url) {
        try {
            const body = await request({
                method: 'GET',
                url,
                json: true
            })
            let $ = cheerio.load(body);
            let pageResult = [];
            await $('.c-listing__items').find('div.c-price__discount-oval').each((index, element) => {
                const result = {};
                let percent = (element.children[0].children[0].data).trim().replace('٪', '');
                let lastPrice = element.parentNode.children[0].children[0].data.trim();
                let activePrice = element.next.children[0].data.trim()
                let data = ($(element).parents('li')[0].children[0].attribs)
                console.log(($($(element).parents('.c-product-box__content')[0].prev).attr('href')))
                let image = ($($(element).parents('.c-product-box__content')[0].prev).find('img')[0].attribs)
                Object.assign(result, {
                    id: data['data-id'],
                    titleFa: data['data-title-fa'],
                    titleEn: data['data-title-en'],
                    lastPrice,
                    activePrice,
                    percent,
                    image: image['src']
                })
                pageResult.push(result)
            })
            return pageResult;
        } catch (error) {
            throw Error(error)
        }
    },
    async getPageNumber(url) {
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
    },
    async getAllDiscounts(url) {
        let result = []
        try {
            const pageNo = await module.exports.getPageNumber(url);
            for (let i = 1; i <= pageNo; ++i) {
                try {
                    const data = await module.exports.getPageDiscounts(`${url}?pageno=${i}`);
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