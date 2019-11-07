const fetch = require("node-fetch");
var convert = require('xml2js');
const util = require('util');

const convertJsonToChannels = (result) =>{
    var stories = 0;

    return result.rss.channel ? result.rss.channel.map(c => {
        const imgUrl = c.item && c.item[0]['media:content'] && c.item[0]['media:content'][0]['$'].url;
        const imgCredit = c.item[0] && c.item[0]['media:credit'] && c.item[0]['media:credit'][0];
        const items = c.item.map(i => {
            stories++;
            return {title: i.title && i.title[0], link: i.link && i.link[0], description: i.description && i.description[0], published: i.pubDate}
        });
        console.log(`Loaded ${stories} stories`);
        return {title: c.title && c.title[0], description: c.description && c.description[0], image: imgUrl, imageCredit: imgCredit, items: items}
    }) : [];
}

const getChannelsFromUrl = (url) => {
    return new Promise(function(resolve, reject){
        fetch(url)
            .then(response => {
                response.text().then(body =>{
                  convert.parseStringPromise(body).then(function (result) {
                    console.log(`Response received: ${response.status} url: ${url}`);
                    try{
                        const channels = convertJsonToChannels(result);
                        resolve(channels);
                    } catch(e){
                        console.log(e);
                        reject(e);
                    }
                });
            });
        });
    });
}

module.exports = {
    convertJsonToChannels: convertJsonToChannels,
    getChannelsFromUrl: getChannelsFromUrl    
}
