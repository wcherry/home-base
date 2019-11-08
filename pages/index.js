import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import RssFeed from '../components/rss_feed'
import ArticleModal from '../components/article_modal.js'

import css from 'bootstrap/dist/css/bootstrap.css'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {url: null, show: false}
  }
  
  handleClick = (url) => {
    console.log(`Clicked: ${url}`)
    this.setState({url: url, show: true});
    this.refs.popup.showUrl(url);
  }

  render = () => (
    <div>
      <ArticleModal ref="popup" display={this.state.show} url={this.state.url}></ArticleModal>
      <RssFeed linkHandler={this.handleClick}></RssFeed>
    </div>

  )
}

export default Home
