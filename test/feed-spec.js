const assert = require('assert');
const util = require('util');
const nock = require('nock');


var feedService = require("../feed-service")

describe('feed service', function() {
  describe('#convertJsonToChannels()', function() {
    it('should return an empty array if no data is passed', function() {
      assert.deepEqual(feedService.convertJsonToChannels({rss: []}), []);
    });
    it('should return a single empty channel', function() {
      assert.deepEqual(feedService.convertJsonToChannels({rss: [{channel: [{item: []}]}]}),[]);
    });
    it('should return a single channel with a single entry', function() {
      assert.deepEqual(feedService.convertJsonToChannels({rss: {channel: [{title: "ff", item: [{title: ['test'], link: ['http://#']}]}]}}).length, 1);
    });
    it('should return use first items image and credit for channel', function() {
      const channels = feedService.convertJsonToChannels({rss: {channel: [{title: "ff", item: [{title: ['test'], link: ['http://#'], 'media:content': [{'$': {url: 'http://image.com/img.jpg'}}], 'media:credit': ['will.the.photo.taker']}]}]}});
      assert.equal(channels.length, 1);
      assert.equal(channels[0].image, 'http://image.com/img.jpg');
      assert.equal(channels[0].imageCredit, 'will.the.photo.taker');
    });
  });
  describe('#getChannelsFromUrl()', function() {
    it('should return data for 200', function() {
      const scope = nock('http://localhost:3000/')
        .get('/public/nytimes_rss.xml')
        .replyWithFile(200, __dirname + '/../public/nytimes_rss.xml', {'Content-Type': 'application/rss'});

      feedService.getChannelsFromUrl("http://localhost:3000/public/nytimes_rss.xml").then(channels => {
        assert.equal(channels.length, 1);
      });
    });
    it('should return an error for 4xx', function() {
      const scope = nock('http://localhost:3000/')
        .get('/public/missing.xml')
        .reply(404);

      feedService.getChannelsFromUrl("http://localhost:3000/public/missing.xml").then(channels => {
        assert.deepEqual(channels, []);
      });
    });
    it('should return an error for 5xx', function() {
      const scope = nock('http://localhost:3000/')
        .get('/public/bad.xml')
        .reply(500);

      feedService.getChannelsFromUrl("http://localhost:3000/public/bad.xml").then(channels => {
        assert.deepEqual(channels, []);
      });
    });
  });
});