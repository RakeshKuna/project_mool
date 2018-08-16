import React from 'react';
import { Button, Popover, PopoverTitle, PopoverContent } from 'reactstrap';
export default class PopOverAction extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.clickHandler=this.clickHandler.bind(this);
    this.state = {
      popoverOpen: false,
      data:null
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  clickHandler(data){
    console.log(data);
    this.setState({data:data,popoverOpen: !this.state.popoverOpen});
  }



  render() {
   let PopOverComponent =React.cloneElement(this.props.popOverComponent,{config:this.props,data:this.state.data,closePopOver:this.toggle,toggle:this.toggle});
    //let ActionComponent =React.cloneElement(this.props.actionComponent,{actionConfig:this.props,clickHandler:this.clickHandler});
    let ActionComponent =this.props.actionComponent;
    return (
      <span>
        <ActionComponent {...this.props} onClickHandler={this.props.handler&&this.props.handler.bind(this,this.props,this.clickHandler)}/>
        <Popover className={this.props.popoverClassName||''} placement={this.props.placement?this.props.placement:'top'} isOpen={this.state.popoverOpen} target={this.props.target} toggle={this.toggle}>
          <PopoverTitle>{this.props.popOverTitle}</PopoverTitle>
          <PopoverContent>{PopOverComponent}</PopoverContent>
        </Popover>
      </span>
    );
  }
}
