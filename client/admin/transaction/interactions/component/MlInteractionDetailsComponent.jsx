import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');
import {initalizeFloatLabel} from '../../../utils/formElemUtil'
import moment from "moment";


export default class MlInteractionDetailsComponent extends React.Component {
  componentDidMount() {
    initalizeFloatLabel();
  }
  render() {
    return (
      <div className="ml_tabs">
        <ul  className="nav nav-pills">
          <li className="active">
            <a  href={`#CustomerDetails${this.props.data._id}`} data-toggle="tab">Customer Details</a>
          </li>
          <li>
            <a  href={`#ActivityDetails${this.props.data._id}`} data-toggle="tab">Activity Details</a>
          </li>
          <li >
            <a  href={`#DeviceDetails${this.props.data._id}`} data-toggle="tab">Device Details</a>
          </li>
          {/*<li >*/}
            {/*<a  href="#4a" data-toggle="tab">History</a>*/}
          {/*</li>*/}
          <li >
            <a  href={`#notes${this.props.data._id}`} data-toggle="tab">Notes</a>
          </li>
        </ul>

        <div className="tab-content clearfix">
          <div className="tab-pane active" id={`CustomerDetails${this.props.data._id}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="User Id"  defaultValue = {this.props.data.userId} disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction Id" defaultValue = {this.props.data.transactionTypeId}  disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Date & Time"  defaultValue = {this.props.data.createdAt ? moment(this.props.data.createdAt).format(Meteor.settings.public.dateFormat) : ' ' } disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Name"  defaultValue = {this.props.data.userName} disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email Id"  defaultValue = {this.props.data.emailId}  disabled={true} className="form-control float-label" id=""/>
                </div>
              </div>
              <div className="col-md-6">
                {/*<div className="form-group">*/}
                  {/*<input type="text" placeholder="Phone no"  className="form-control float-label" id=""/>*/}
                {/*</div>*/}
                <div className="form-group">
                  <input type="text" placeholder="Cluster"  defaultValue = {this.props.data.clusterName} disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter"  defaultValue = {this.props.data.chapterName} disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter"  defaultValue = {this.props.data.subChapterName} disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community"  defaultValue = {this.props.data.communityName} disabled={true} className="form-control float-label" id=""/>
                </div>
              </div>

            </div>
          </div>


          <div className="tab-pane active" id={`ActivityDetails${this.props.data._id}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Activity Name"  defaultValue = {this.props.data.activity} disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Activity Time"  defaultValue = {this.props.data.createdAt ? moment(this.props.data.createdAt).format(Meteor.settings.public.dateFormat) : ' ' } disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Current Status" disabled={true} className="form-control float-label" id=""/>
                </div>

              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Duration" disabled={true} className="form-control float-label" id=""/>
                </div>
                {/*<div className="form-group">*/}
                  {/*<input type="text" placeholder="Triggered Location" disabled={true} className="form-control float-label" id=""/>*/}
                {/*</div>*/}
              </div>

            </div>
          </div>





          <div className="tab-pane active" id={`DeviceDetails${this.props.data._id}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device Name" disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Device ID" disabled={true} className="form-control float-label" id=""/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Ip Address " defaultValue = {this.props.data.userAgent.ipAddress} disabled={true} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Ip Location"  disabled={true} className="form-control float-label" id=""/>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-pane" id={`notes${this.props.data._id}`}>
            <div className="row">
              <div className="col-md-9">
                <div className="form-group">
                  <textarea placeholder="Notes" defaultValue={this.props.data.transactionDetails} disabled={true}  className="form-control float-label" id=""></textarea>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>

    );
  }
}



