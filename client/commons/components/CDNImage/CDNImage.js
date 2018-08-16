import React,{Component,PropTypes} from "react";
import { Meteor } from 'meteor/meteor';

export default class CDNImage extends Component{

  constructor(props){
    super(props);
    this.getCDNUrl = this.getCDNUrl.bind(this)
  }

  getCDNUrl(){
    const CDNUrl = Meteor.settings.public.CDNUrl;
    const {src} = this.props;
    if(CDNUrl){
      return CDNUrl + src;
    }

    return src;
  }


  render(){
    const {alt} = this.props;
    var getProps = Object.assign({},this.props);
    delete getProps.src;
    return (
      <img src={this.getCDNUrl()} {...getProps} />
    )
  }
}

CDNImage.propTypes = {
  src: React.PropTypes.string,
}
