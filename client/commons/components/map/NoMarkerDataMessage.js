import getBreadCrumListBasedOnhierarchy from '../../../app/breadcrum/actions/dynamicBreadCrumListHandler';
import React,{Component} from 'react';

export default class NoMarkerDataMessage extends Component{
  constructor(props){
    super(props);
    this.state = {unmount:false};
  }

  componentWillMount(){
    let that = this;

    let module = 'Eco-System';
    let clusterId = FlowRouter.getParam('clusterId');
    let chapterId = FlowRouter.getParam('chapterId');
    let subChapterId = FlowRouter.getParam('subChapterId');

    if(subChapterId) module = subChapterId;
    else if(chapterId) module = chapterId;
    else if(clusterId) module = clusterId;

    const params = FlowRouter.current().params;

    getBreadCrumListBasedOnhierarchy(params, '',(list)=>{
      list.reverse();
      name = (list[0] && list[0].linkName)?list[0].linkName:'User';
      if(name == 'Users') name = list[1].linkName;
      that.setState({name,unmount:false},()=>{
        setTimeout(()=>{
          that.setState({unmount:true});
        },3000);
      });


    });

  }

  componentWillReceiveProps(nextProps){

    let that = this;
    if(this.props.userType !== nextProps.userType && nextProps.userType){
      this.setState({unmount:false},()=>{
        setTimeout(()=>{
          that.setState({unmount:true});
        },3000);
      });
    }
  }


  render(){
    let { name, unmount } = this.state;
    let path = FlowRouter._current.route.path;

    let message = '';
    let component = <div></div>;

    if(!this.props.userType){
      if(!path.includes('admin') && path.includes('chapters')){
        message = `No active Chapters in ${name} as of now.`;
        component = unmount ?<div></div>:<div ref="noMessageComponent" className="alert alert-info col-md-8 col-md-offset-2 text-center map_alert">
          {message}
        </div>;
      }

    }else if(this.props.userType !=='Reset'){
      message = `${ this.props.userType==='All'?'All Users':this.props.userType } profiles for ${name} are being updated. There are no active portfolios to be shown as of now.`;
      component = unmount ?<div></div>:<div ref="noMessageComponent" className="alert alert-info col-md-8 col-md-offset-2 text-center map_alert">
        {message}
      </div>;
    }

    return (
      component
    );
  };
}
