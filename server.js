const express = require('express')
const next = require('next')
const fetch = require("node-fetch");
var convert = require('xml2js');
const util = require('util');
const path = require('path');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
  const server = express()

  server.use('/static', express.static(path.join(__dirname, 'public')))
  server.get('/a', (req, res) => {
    return app.render(req, res, '/a', req.query)
  })

  server.get('/b', (req, res) => {
    return app.render(req, res, '/b', req.query)
  })

  server.get('/posts/:id', (req, res) => {
    return app.render(req, res, '/posts', { id: req.params.id })
  })

  server.get('/api/hello/:id', (req, res) => {
    res.send(`Hello ${req.params.id}\n`);
  })

  server.get('/api/feed', (req, res) => {
    const url = "http://localhost:3000/static/nytimes_rss.xml";
    fetch(url)
      .then(response => {
        response.text().then(body =>{
          convert.parseStringPromise(body).then(function (result) {
            console.log(`Response received: ${response.status} url: ${url}`);
            var stories = 0;
            const channels = result.rss.channel.map(c => {
              try{const imgUrl = c.item[0]['media:content'][0]['$'].url;
              const imgCredit = c.item[0]['media:credit'][0];
              const items = c.item.map(i => {
                stories++;
                return {title: i.title[0], link: i.link[0], description: i.description[0], published: i.pubDate}
              });
              console.log(`Loaded ${stories} stories for url ${url}`);
              return {title: c.title[0], description: c.description[0], image: imgUrl, imageCredit: imgCredit, items: items}
            } catch(e){
              console.log(e);
            }
            });

            res.send(channels);  
          })
          .catch(function (err) {
            console.log(err);
          });
       })
    })
     .catch(err => {console.log(err);});
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
