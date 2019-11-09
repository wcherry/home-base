import React from 'react';
import {Modal, Button} from 'react-bootstrap/';
import Iframe from 'react-iframe';

class ArticleModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {display: props.display || false, url: props.url | ''};
  }
  
  handleClose = () => this.setState({display: false});

  showUrl = (url) => this.setState({url: url, display: true});

  openInNewTab = (url) => {
    window.open(url, '_blank').focus();
  }

  render = () => {
    return (
        <Modal size="xl" show={this.state.display} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Quick View</Modal.Title>
          </Modal.Header>
          <Modal.Body><Iframe width="100%" height="600px" url={this.state.url}></Iframe></Modal.Body>
          <Modal.Footer>
            <p>{this.state.url.length > 80 ? `${this.state.url.slice(0, 80)}...` : this.state.url}</p>
            <Button variant="primary" onClick={() => this.openInNewTab(this.state.url)}>Visit Site</Button>
          </Modal.Footer>
        </Modal>
    )
  }
};

export default ArticleModal;