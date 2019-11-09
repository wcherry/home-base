import React from 'react'
import util from 'util';


const fetch = require("node-fetch");

class RssFeed extends React.Component {
	linkHandler = null;
	
	constructor(props) {
		super(props);
		this.state = {links: ["*** NO LINKS***"]};
		this.linkHandler = props.linkHandler
	}

	getCurrentFeed = (query, update) => {
		fetch('http://localhost:3000/api/feed', { mode: 'no-cors'})
		.then(function(response) {
		  return response.json();
		})
		.then(function(myJson) {
		  update(myJson);
		});
	}

	showPopup = (url) => {
		if(this.linkHandler) this.linkHandler(url);
		else window.open(url, '_blank').focus();
	}

	update = (channels) =>{
		const links = channels.map((channel) => {
			const items = channel.items.map(item =>{
				return (<li onClick={() => this.showPopup(item.link)} title={item.description}>{item.title} [{item.published}]</li>);
			})
			return (<div><h3>{channel.title}</h3><img src={channel.image} alt={channel.imageCredit} title={channel.imageCredit} height="151" width="151"></img><ul>{items}</ul></div>)
		  });
		  console.log(links);
		  this.setState({links: links});
	}

	componentDidMount = () => {
		this.getCurrentFeed("", this.update);
	}

	render() {return (
		<div className="list">
	    	<h2>RSS Feed</h2>
			{this.state.links}
		</div>
	)}
}
export default RssFeed
