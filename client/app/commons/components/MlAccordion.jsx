/**
 * Created by mohammed.mohasin on 11/6/17.
 */
import React from "react";
import {render} from "react-dom";
import _ from "lodash";
import FontAwesome from 'react-fontawesome';

export default class MlAccordion extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isExpand:[true, true],
      expandClassName: ['active', 'active']
    }
    this.onTabClick.bind(this);
    //set action panel activation handler callback
    // if(_.isFunction(props.activateActionPanelHandler)){
    //   props.activateActionPanelHandler(this.activateActionPanel.bind(this));
    // }
    return this;
  }

  componentWillMount() {
    if (_.isFunction(this.props.activateActionPanelHandler)) {
      this.props.activateActionPanelHandler(this.activateActionPanel.bind(this));
    }
  }

  activateActionPanel(){
   //$("#portfolioAccordion0").addClass("in");
    $("#portfolioAccordion0").collapse("show");
  }

  componentDidMount() {
    this.onTabClick(1);
  }
  onTabClick(index){
    let {isExpand, expandClassName} = this.state;
    var data = $('#pdp-accord-toggle_' + index).attr('aria-expanded');
    isExpand[index] = data == 'true'?true:false;
    expandClassName[index] = data == 'true'? 'active':'';

    if (index === 0 && isExpand[0]) {
      isExpand[1] = false;
      expandClassName[1] = '';
    }

    if (index === 1 && isExpand[1]) {
      isExpand[0] = false;
      expandClassName[0] = '';
    }

    this.setState({isExpand: isExpand, expandClassName: expandClassName});
  }
  render() {
    var _this = this;
    /*props 'accordionOptions'  contains accordion configuration only*/
    let accordion = this.props.accordionOptions ? this.props.accordionOptions : {};
    let accordionId = accordion.id || 'accordion';
    let panelOptions = accordion.panelItems || [];
    let panelItems = panelOptions.map(function (option, index) {
      return (
        <a className={`re-btn ${_this.state.expandClassName[index]}`} id={`pdp-accord-toggle_${index}`} data-toggle="collapse" data-parent={"#" + accordionId} key={"panel"+index}
           href={"#" + accordionId + index} onClick={_this.onTabClick.bind(_this, index)}>
          {option.title} <span className={`fa fa-caret-${_this.state.isExpand[index]?"down":"up"}`}/>
          </a>
      )
    });

    var propz = _.omit(this.props, ['accordionOptions']);
    let panelItemsContent = panelOptions.map(function (option, index) {
      let isText = option.isText || false;
      let PanelComponent = React.cloneElement(option.contentComponent, propz);

      if(isText){
        if (index == 0) {
          return  (<div id={accordionId + index} key={"panelContent"+index} className="panel-collapse collapse in" style={option.style}>{option.contentComponent}</div>);
        }
        else {
          return  (<div id={accordionId + index} key={"panelContent"+index} className="panel-collapse collapse" style={option.style}>{option.contentComponent}</div>);
        }
      }else{
        if (index == 0) {
          return (<div id={accordionId + index} key={"panelContent"+index} className="panel-collapse collapse in" style={option.style}>
            {PanelComponent}
          </div>)
      }
        else {
          return (<div id={accordionId + index} key={"panelContent"+index} className="panel-collapse collapse" style={option.style}>
            {PanelComponent}
          </div>)
        }
     }

    });

    return (
      <div>
        {/*<div className="opacity"></div>*/}
        <div className="panel-group bottom-buttons" id={accordionId}>
          <div className="panel">
            <div className="panel-heading clearfix">
              <h4 className="panel-title text-left">
                {panelItems}
              </h4>
            </div>

            {panelItemsContent}


          </div>
        </div>
      </div>
    )
  }
};
