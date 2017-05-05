import React from 'react';
import {Button} from 'react-bootstrap';
import {observer} from 'mobx-react'
import {observable} from 'mobx'

@observer
class Main extends React.Component {

  @observable number = 0;

  inc = () => this.number++;
  dec = () => this.number--;

  render() {
    return (
      <div className="container">
        <Button bsStyle="info" bsSize="xs" onClick={this.dec}>
          <i className="fa fa-chevron-left"/>
        </Button>
        &nbsp;{this.number}&nbsp;
        <Button bsStyle="info" bsSize="xs" onClick={this.inc}>
          <i className="fa fa-chevron-right"/>
        </Button>
      </div>
    );
  }
}

export default Main;
