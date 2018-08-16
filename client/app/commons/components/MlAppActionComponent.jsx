/**
 * Created by mohammed.mohasin on 11/6/17.
 */
import React from "react";
import {render} from "react-dom";
import _ from "lodash";
import PopOverAction from '../../../commons/components/popover/PopOverAction';

export default class MlAppActionComponent extends React.Component {

  constructor(props) {
    super(props);
    return this;
  }

  componentDidMount(){
    $(".action_buttons").mCustomScrollbar({
      axis:"x",
      autoHideScrollbar:true
      });
  }

  render() {
    let config = [
      {
        actionName: 'create',
        displayName:'Create',
        iconClass: 'ml flaticon-ml-shapes'
      },
      {
        actionName: 'read',
        displayName:'Read',
        iconClass: 'ml flaticon-ml-shapes'
      },
      {
        actionName: 'update',
        displayName:'Update',
        iconClass: 'ml flaticon-ml-shapes'
      },
      {
        actionName: 'delete',
        displayName:'Delete',
        iconClass: 'ml fa fa-trash-o'
      },
      {
        actionName: 'clone',
        displayName:'Clone',
        iconClass: 'ml fa fa-clone'
      },
      {
        actionName: 'like',
        displayName:'Like',
        iconClass: 'ml my-ml-like'
      },
      {
        actionName: 'connect',
        displayName:'Connect',
        iconClass: 'ml flaticon-ml-handshake'
      },
      {
        actionName: 'collaborate',
        displayName:'Collaborate',
        iconClass: 'ml flaticon-ml-networking'
      },
      {
        actionName: 'favourite',
        displayName:'Favourite',
        iconClass: 'ml my-ml-favourites'
      },
      {
        actionName: 'view',
        displayName:'View',
        iconClass: 'ml my-ml-browser_3'
      },
      {
        actionName: 'partner',
        displayName:'Partner',
        iconClass: 'ml flaticon-ml-handshake-1'
      },
      {
        actionName: 'enquire',
        displayName:'Enquire',
        iconClass: 'ml flaticon-ml-support'
      },
      {
        actionName: 'conversation',
        displayName:'Conversation',
        iconClass: 'ml flaticon-ml-chat'
      },
      {
        actionName: 'feedback',
        displayName:'Feedback',
        iconClass: 'ml flaticon-ml-note-1'
      },
      {
        actionName: 'compare',
        displayName:'Compare',
        iconClass: 'ml my-ml-Compare'
      },
      {
        actionName: 'share',
        displayName:'Share',
        iconClass: 'ml my-ml-share'
      },
      {
        actionName: 'download',
        displayName:'Download',
        iconClass: 'ml flaticon-ml-cloud-computing-1'
      },
      {
        actionName: 'upload',
        displayName:'Upload',
        iconClass: 'ml flaticon-ml-cloud-computing'
      },
      {
        actionName: 'wishlist',
        displayName:'Wishlist',
        iconClass: 'ml my-ml-wishlist'
      },
      {
        actionName: 'edit',
        displayName:'Edit',
        iconClass: 'ml ml-edit'
      },
      {
        actionName: 'save',
        displayName:'Save',
        iconClass: 'ml ml-save'
      },
      {
        actionName: 'golive',
        displayName:'GoLive',
        iconClass: 'ml my-ml-launch_3'
      },
      {
        actionName: 'comment',
        displayName:'Comment',
        iconClass: 'ml my-ml-comment'
      },
      {
        actionName: 'shortlist',
        displayName:'Shortlist',
        iconClass: 'ml my-ml-shortlist'
      },
      {
        actionName: 'onboard',
        displayName:'Onboard',
        iconClass: 'ml my-ml-Onboard'
      },
      {
        actionName: 'review',
        displayName:'Review',
        iconClass: 'ml flaticon-ml-note'
      },
      {
        actionName: 'send for review',
        displayName:'Send For Review',
        iconClass: 'ml flaticon-ml-note'
      },

      {
        actionName: 'review',
        displayName:'Review',
        iconClass: 'ml my-ml-review'
      },
      {
        actionName: 'assess',
        displayName:'Assess',
        iconClass: 'ml my-ml-Assess'
      },
      {
        actionName: 'discuss',
        displayName:'Discuss',
        iconClass: 'ml my-ml-discuss'
      },
      {
        actionName: 'promote',
        displayName:'Promote',
        iconClass: 'ml my-ml-promote'
      },
      {
        actionName: 'negotiate',
        displayName:'Negotiate',
        iconClass: 'ml my-ml-negotiate'
      },
      {
        actionName: 'valuation',
        displayName:'Valuate',
        iconClass: 'ml my-ml-Valuation'
      },
      {
        actionName: 'report card',
        displayName:'Report Card',
        iconClass: 'ml ml-save'
      },
      {
        actionName: 'invest',
        displayName:'Invest',
        iconClass: 'ml my-ml-Invest'
      },
      {
        actionName: 'handover',
        displayName:'Handover',
        iconClass: 'ml my-ml-handover'
      },
      {
        actionName: 'term sheet',
        displayName:'Term Sheet',
        iconClass: 'ml my-ml-termsheet'
      },
      {
        actionName: 'exit',
        displayName:'Exit',
        iconClass: 'ml my-ml-Exit'
      },
      {
        actionName: 'remove',
        displayName:'Remove',
        iconClass: 'ml my-ml-remove'
      },
      {
        actionName: 'follow',
        displayName:'Follow',
        iconClass: 'ml flaticon-ml-shapes'
      },
      {
        actionName: 'accept',
        displayName:'Accept',
        iconClass: 'ml ml-save'
      },
      {
        actionName: 'reject',
        displayName:'Reject',
        iconClass: 'ml ml-save'
      },
      {
        actionName: 'complete',
        displayName:'Complete',
        iconClass: 'ml ml-save'
      },
      {
        actionName: 'cancel',
        displayName:'cancel',
        iconClass: 'ml ml-delete'
      },
      {
        actionName: 'start',
        displayName:'Start',
        iconClass: 'ml ml-save'
      },
      {
        actionName: 'book',
        displayName:'Book',
        iconClass: 'ml my-ml-book_now'
      },
    ]
    let actionOptions= this.props.actionOptions|| [];

    //todo: resourceType(module) and resourceId + subscription handler
    //disabled:true/false depends on resourceType and resourceId.. control it

    let actionView = actionOptions.map(function (option, id) {
      let activeClass = '';
      let actionTarget=option.target||null;
      option.anchorClass='';
      if(option.isDisabled&&option.isDisabled===true){
          option.handler=null;
          option.anchorClass='act_disable';
          option.isDisabled=true;
      }
      let action = _.find(config, {'actionName': option.actionName});
      for (let i = 0; i < config.length; i++) {
        if (config[i].actionName == option.actionName && option.showAction == true) {
          activeClass = ""
        } else if (config[i].actionName == option.actionName && option.showAction != true) {
          activeClass = "hide"
        }
      }

      if (option.hasPopOver) {
        return <PopOverAction handler={(option.handler && option.handler)} {...option} key={option.actionName} activeClass={activeClass} iconClass={action['iconClass']}/>
      }else{
      return (
        <li key={id} className={activeClass}>
          {actionTarget&&actionTarget!==null?<a id={actionTarget} className={option.anchorClass} onClick={option.handler && option.handler.bind(this, option,null)}> <span
            className={action['iconClass']}></span>
            <br />{option.actionName}</a>:
          <a className={option.anchorClass} onClick={option.handler && option.handler.bind(this, option,null)}> <span
            className={action['iconClass']}></span>
            <br />{option.actionName}</a>}
        </li>
      )
      }
    })
    return (
        <div className="action_buttons" style={{'maxWidth':'1000px','margin':'0px auto'}}>
                <ul>
                  {actionView}
                </ul>
        </div>
    )
  }
};
