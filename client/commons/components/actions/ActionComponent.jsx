import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import  $ from 'jquery';
import _ from 'lodash';
import PopOverAction from '../popover/PopOverAction';
export default class MlActionComponent extends Component {
  constructor(props){
    super(props);
  return this;
    this.onActionSwitch.bind(this);
  }
  componentDidMount()
  {
   /* $('.actions_switch').click(function(){
      $('.bottom_actions_block').toggleClass('show_block');
      $(this).toggleClass('show_act');
    });*/
    /*$('[data-toggle="tooltip"]').tooltip({
      container:'body',
      trigger:"hover"
    });*/
    setTimeout(function(){
      $('[data-toggle="tooltip"]').tooltip({
        container:'body',
        trigger:"hover"
      });
      $('[data-toggle="tooltip').on('click', function () {
        $(this).tooltip('hide');
      });
    },1000);
  }

  onActionSwitch(e){

      $('.bottom_actions_block').toggleClass('show_block');
      $(e.currentTarget).toggleClass('show_act');

  }

  onMultiEdit(actionName){
    if(actionName == "edit"){
      toastr.error("Multiple records cannot be edited, Please select a record");
    }else if(actionName == "view"){
      toastr.error("Multiple records cannot be viewed, Please select a record");
    }

  }


  render(){
    const count = this.props.count;
    const that = this;
    let config=[
      {
        imagefield:'/images/edit_icon.png',
        actionName:'edit',
        iconClass:'ml ml-edit'
      },
      {
        imagefield:'/images/act_add_icon.png',
        actionName:'add',
        iconClass:'ml ml-plus'
      },
      {
        imagefield:'/images/act_logout_icon.png',
        actionName:'logout',
        iconClass:'ml ml-active'
      },
      {
        imagefield:'/images/act_progress_icon.png',
        actionName:'progress',
        iconClass:'ml'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'select',
        iconClass:'ml ml-select-all'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'save',
        iconClass:'ml my-ml-save'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'cancel',
        iconClass:'ml my-ml-cancel'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'assign',
        iconClass:'ml ml-assign'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'download',
        iconClass:'ml flaticon-ml-cloud-computing-1'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'approveUser',
        iconClass:'ml flaticon-ml-active-user'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'rejectUser',
        iconClass:'ml flaticon-ml-inactive-user'
      },
      {
        //id:'annotationss',
        imagefield:'/images/act_select_icon.png',
        actionName:'comment',
        iconClass:'ml ml-annotate',
        //iconID:'Popover1'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'documentApprove',
        iconClass:'ml flaticon-ml-file-1'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'documentReject',
        iconClass:'ml flaticon-ml-file'
      },
      {
        imagefield:'/images/act_select_icon.png',
        actionName:'view',
        iconClass:'fa fa-eye'
      },
      {
        actionName: 'preview',
        displayName:'Preview',
        iconClass: 'fa fa-window-maximize'
      },
    ]


    let actionName=this.props.actionName;
    let imagePath=this.props.imagePath;

      let actionView = this.props.ActionOptions.map(function(option) {
        let activeClass = '', activesubclass = ''
        let action = _.find(config, {'actionName': option.actionName});
        for (let i = 0; i < config.length; i++) {

          if (config[i].actionName == option.actionName && option.showAction == true) {
            console.log("sucess")
            activeClass = "hex_btn"
            activesubclass = "hex_btn hex_btn_in"
          }
          else if (config[i].actionName == option.actionName && option.showAction != true) {
            activeClass = "hex_btn hide"
            activesubclass = "hex_btn hex_btn_in"
          }
        }
        if (option.hasPopOver) {
            return <PopOverAction handler={( (count > 1 && option.actionName == 'edit'  || option.actionName == 'view') ? that.onMultiEdit.bind(that, option.actionName) : (option.handler && option.handler))} {...option} key={option.actionName} activeClass={activeClass} iconClass={action['iconClass']}  activesubclass={activesubclass}/>
        } else {

        return (
          <div className={`${activeClass} `} key={option.actionName}>
            <div
              onClick={( (count > 1 && (option.actionName == 'edit'  || option.actionName == 'view' ) ) ? that.onMultiEdit.bind(that, option.actionName) : (option.handler && option.handler.bind(this, option, null)))}
              key={option.actionName} className={`${activesubclass} `} data-toggle="tooltip" title={option.actionName}
              data-placement="top">
              {/*<img src={action['imagefield']} />*/}
              <span className={action['iconClass']} id={option.iconID}></span>
            </div>
          </div>
        )
      }
       })
    return(

      <div>
        <span className="actions_switch" onClick={this.onActionSwitch.bind(this)}></span>
        <div className="bottom_actions_block ">
          {actionView}
        </div>
      </div>

    )
  }

}

MlActionComponent.PropTypes={
  routerPath:React.PropTypes.string,
  imagePath:React.PropTypes.string
}

{/*<div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-plus"></span> </a></div>
<div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-edit"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-delete"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-select-all"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-import"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-export"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-save"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-active"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-share"></span> </a></div>
  <div className="hex_btn"><a href="" className="hex_btn hex_btn_in"> <span className="ml ml-annotate"></span> </a></div>*/}


