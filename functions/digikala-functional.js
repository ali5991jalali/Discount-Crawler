// packages
const request = require('request'),
    cheerio = require('cheerio');
// Functions
const result = (element, faCetegory, enCategory) => {
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
    return result;
}
