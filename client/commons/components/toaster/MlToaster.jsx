import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ReactToastr from 'react-toastr'
export default class MlToaster extends Component {

  successToaster (message,heading,timeout) {
    this.refs.container.success(message,heading,{timeout:timeout});
  //  window.open("http://youtu.be/3SR75k7Oggg");
  }
  errorToaster (message,heading,timeout) {
    this.refs.container.error(message,heading,{timeout:timeout});
    //  window.open("http://youtu.be/3SR75k7Oggg");
  }
  infoToaster (message,heading,timeout) {
    this.refs.container.info(message,heading,{timeout:timeout});
    //  window.open("http://youtu.be/3SR75k7Oggg");
  }
  render(){
    let {ToastContainer} = ReactToastr;
    let  ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
    let message=this.props.message;
    let type=this.props.type
    let timeout=this.props.timeout
    let heading =this.props.heading;
    if(type=="success"){
     /* let timeout=3000,heading="sucess Head"*/
      this.successToaster(message,heading,timeout)
    }
    else if(type=="error"){
     this.errorToaster(message,heading,timeout)
    }
    else if(type=="info"){
      this.infoToaster(message,heading,timeout)
    }


    return(
      <div className="toaster-container">
      <ToastContainer ref="container"
                      toastMessageFactory={ToastMessageFactory}
                      className="toast-top-right" />
      </div>



    )
  }

}
