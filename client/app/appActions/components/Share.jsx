import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import { Button, Popover, PopoverTitle, PopoverContent } from 'reactstrap';

export default class SharePopOver extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
    this.state = {
      popoverOpen: false,
      popoverTwoOpen: false
    };
  }

  toggle() {

    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }


  toggleButton() {

    this.setState({
      popoverTwoOpen: !this.state.popoverTwoOpen
    });
  }

  render(){
    return(
      <Popover placement="top" className="popover-lg" isOpen={this.state.popoverTwoOpen} target="pop_share" toggle={this.toggle}>
        <PopoverTitle>Share</PopoverTitle>
        <PopoverContent>

          <h1>Select Content</h1>
          <ul className="doc_upload">
            <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/></li>
            <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/></li>
            <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/></li>
          </ul>

          <div className="clearfix" />
          <div className="form-group">
            <select placeholder="User Type" className="form-control float-label">
              <option>User type</option>
            </select>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Search here" className="form-control float-label" id=""></input>
          </div>

          <ul className="img_upload ul-hide">
            <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
            <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
            <li><FontAwesome name='minus'/><img src="/images/data_balance.jpg"/><span>test text here</span></li>
          </ul>

          <div className="clearfix" />

          <div className="col-md-6 nopadding-left">
            <div className="form-group">
              <input type="text" placeholder="Date & Time" className="form-control float-label" id=""></input>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form-group">
              <input type="text" placeholder="Date & Time" className="form-control float-label" id=""></input>
            </div>
          </div>

          <div className="clearfix" />

          <div className="clearfix" />
          <div className="form-group">
            <div className="input_types"><input id="checkbox1" type="checkbox" name="checkbox" value="1" /><label htmlFor="checkbox1"><span></span>Can Download this content</label></div>
          </div>
          <div className="ml_btn">
            <a href="" className="save_btn">Send</a>
            <a href="" className="cancel_btn">Cancel</a>
          </div>

        </PopoverContent>
      </Popover>
    )
  }
}
