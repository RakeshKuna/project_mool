import React from 'react';
import {render} from 'react-dom';
var FontAwesome = require('react-fontawesome');


export default class BugReportComponent extends React.Component {
  componentDidMount() {
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.bug_button').click(function () {
      $('.bugReport').toggleClass('open');
    });


  }

  closeModal() {
    $('.bugReport').toggleClass('open');
  }

  successCallback(){
    //fix me:control it in better way
    $('#descForm').hide();$('#successMsg').show();
    $('#desc').val('');
    setTimeout(function(){
      $('#descForm').show();$('#successMsg').hide();
    },5000);
  }


  createHandler() {
    var createBugHandler = this.props.createBugHandler || null;
    var desc = this.refs.description.value || null;
    if (createBugHandler) {
      createBugHandler(desc,this.successCallback.bind(this));
    }
  }


  render() {
    return (
      <div>
        <div className="bugReport">
          <div className="bug_body">
            <div id="descForm">
            <textarea id="desc" className="form-control" ref="description"
                      placeholder="Please enter as many details of the bug/suggestion as possible"></textarea>
            <div className="ml_btn">
              <a href="" className="save_btn" onClick={this.createHandler.bind(this)}>Send</a>
            </div>
            </div>
            <h3 id="successMsg" style={{'display': 'none'}}>We appreciate your help / suggestion.<br /> We may revert to you for any
              additional details.</h3>
          </div>
          <a href="" className="bug_button">
            <FontAwesome name='bug'/>
          </a>
        </div>
      </div>
    )
  }
};

