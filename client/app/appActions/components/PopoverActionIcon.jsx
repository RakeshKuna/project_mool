/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import React from "react";
import {render} from "react-dom";

export default  PopoverActionIcon =function(props){

    return (

      <li id={props.actionName} className={props.activeClass}>
        <a href="" className={props.anchorClass} onClick={props.onClickHandler} id={props.target}> <span
          className={props.iconClass}></span>
          <br />{props.actionName}</a>
      </li>
    )
  }
