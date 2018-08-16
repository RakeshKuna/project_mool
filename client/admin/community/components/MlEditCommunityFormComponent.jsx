import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import {updateCommunityActionHandler} from '../actions/updateCommunityFormAction'
import {findCommunityDefActionHandler} from '../actions/findCommunityDefAction'
import MlActionComponent from '../../../commons/components/actions/ActionComponent'
import formHandler from '../../../commons/containers/MlFormHandler';
import gql from 'graphql-tag'
import {OnToggleSwitch} from "../../utils/formElemUtil";
// import ScrollArea from "react-scrollbar"
import { Scrollbars } from 'react-custom-scrollbars';
import Moolyaselect from  '../../commons/components/MlAdminSelectWrapper'
import {multipartFormHandler} from '../../../commons/MlMultipartFormAction'
import MlLoader from '../../../commons/components/loader/loader'
import {getAdminUserContext} from "../../../commons/getAdminUserContext";

class MlEditCommunityFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state = {
      loading: true, data: {},
      clusters: [],
      chapters: [],
      subchapters: [],
      showOnMap:false,
    }
    this.findComDef.bind(this);
    this.addEventHandler.bind(this);
    this.updateCommunityAccess.bind(this)
    this.getUpdatedChapters.bind(this)
    return this;
  }

  componentDidMount() {
    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
        $(this).val(true)
      } else {
        $(this).parent('.switch').removeClass('on');
        $(this).val(false)
      }
    });
  }

  componentWillMount() {
    const resp = this.findComDef();
    return resp;
  }

  componentDidUpdate() {

    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
    OnToggleSwitch(true, true);
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));

    $(function () {
      $('.float-label').jvFloat();
    });

    $('input[type=checkbox]').each(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });

    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
    $('.Select-control').css({'height':'auto'});


  }

  getUpdatedChapters(data){
      if(data.length > 0)
        this.setState({chapters:data})
  }

  async addEventHandler() {
    const resp = await this.updateCommunityAccess();
    return resp;
  }

  async handleSuccess(response) {
    // var resp = JSON.parse(response)
    var resp =response
    if(resp && resp.unAuthorized){
      FlowRouter.go('/unauthorize')
    }else
      window.history.back()
  };

  async findComDef() {
    let Id = this.props.params;
    const response = await findCommunityDefActionHandler(Id);
    if (response) {
      this.setState({data: response});

      if (this.state.data.clusters) {
        this.setState({clusters: this.state.data.clusters});
      }
      if (this.state.data.chapters) {
        this.setState({chapters: this.state.data.chapters});
      }
      if (this.state.data.subchapters) {
        this.setState({subchapters: this.state.data.subchapters});
      }
      if(this.state.data.showOnMap){
        this.setState({showOnMap:this.state.data.showOnMap})
      }
      this.setState({loading: false})
    }
  }

  async  updateCommunityAccess() {
    let communityDetails = {
      displayName: this.refs.displayName.value,
      aboutCommunity: this.refs.about.value,
      showOnMap: this.state.showOnMap,
      isActive: this.refs.status.checked
    }
    let data = {
      moduleName: "COMMUNITY",
      actionName: "UPDATE",
      community: communityDetails,
      communityId: this.props.params,
      clusters: this.state.clusters,
      chapters: this.state.chapters,
      subchapters: this.state.subchapters,
      clusterId:this.props.params.clusterId?this.props.params.clusterId:"",
      chapterId:this.props.params.chapterId?this.props.params.chapterId:"",
      subChapterId:this.props.params.subChapterId?this.props.params.subChapterId:"",
    }
    var resp = await multipartFormHandler(data, null);
    return resp;
  }

  optionsBySelectClusters(val) {
    let clusters = this.state.clusters
    clusters = val;
    this.setState({clusters: clusters})
  }

  optionsBySelectChapters(val) {
    let chapters = this.state.chapters
    chapters = val;
    this.setState({chapters: chapters})
  }

  optionsBySelectSubChapters(val) {
    let subchapters = this.state.subchapters
    subchapters = val;
    this.setState({subchapters: subchapters})
  }

  onStatusChange(e) {
    const data = this.state.data;
    if (e.currentTarget.checked) {
      this.setState({"data": {"isActive": true}});
    } else {
      this.setState({"data": {"isActive": false}});
    }
  }
  onShowMapChange(element){
    const data = this.state.data;
    if (element.currentTarget.checked) {
      this.setState( {"showOnMap": true});
    } else {
      this.setState({"showOnMap": false});
    }
  }
  render() {
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateCommunityAccess.bind(this), this.handleSuccess.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => FlowRouter.go('/admin/community')
      }
    ]

      let clusterquery = gql` query{data:fetchClustersForMap{label:displayName,value:_id}}`;
      let chapterOption = this.state.clusters.length>0?{options: {variables: {clusters: this.state.clusters}}}:{options: {variables: {clusters: []}}};
      let chapterquery = gql`query($clusters:[String]){  
        data:fetchActiveClusterChapters(clusters:$clusters) {
          value:_id
          label:chapterName
        }  
      }`;
    let subChapterOption = this.state.chapters.length>0&&this.state.clusters.length>0?{options: {variables: {chapters: this.state.chapters,clusters: this.state.clusters}}}:{options: {variables: {chapters: [],clusters: []}}};
    let subChapterquery = gql`query($chapters:[String],$clusters:[String]){  
        data:fetchActiveChaptersSubChapters(chapters:$chapters,clusters:$clusters) {
          value:_id
          label:subChapterName
        }  
    }`;
    let loggedInUser = getAdminUserContext();
    let clusterDisabled = "";
    let chapterDisabled = "";
    if(loggedInUser.hierarchyLevel < 4){
      clusterDisabled = "disabled"
    }else if(loggedInUser.hierarchyLevel < 3){
      clusterDisabled = "disabled"
      chapterDisabled  = "disabled"
    }
    const showLoader = this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? (<MlLoader/>) : (

          <div className="admin_padding_wrap">
            <h2>Edit Community Details</h2>
            <div className="main_wrap_scroll">
              <Scrollbars
                speed={0.8}
                className="main_wrap_scroll"
                smoothScrolling={true}
                default={true}
              >
            <div className="col-md-6 nopadding-left">
              <div className="form_bg">
                <form>
                  <div className="form-group">
                    <input type="text" ref="communityName" defaultValue={this.state.data && this.state.data.name}
                           readOnly="true" placeholder="Community Name"
                           className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref="displayName" defaultValue={this.state.data && this.state.data.displayName}
                           placeholder="Display Name" className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group">
                    <Moolyaselect multiSelect={true} placeholder={"Cluster"} className="form-control float-label"
                                  valueKey={'value'} labelKey={'label'} selectedValue={this.state.clusters}
                                  queryType={"graphql"} query={clusterquery} isDynamic={true} id={'clusterquery'}
                                  onSelect={this.optionsBySelectClusters.bind(this)} disabled={clusterDisabled}/>
                  </div>
                  <div className="form-group">
                    <Moolyaselect multiSelect={true} placeholder={"Chapter"} className="form-control float-label"
                                  valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapters}
                                  queryType={"graphql"} query={chapterquery} queryOptions={chapterOption} disabled={chapterDisabled}
                                  isDynamic={true} id={'query'} onSelect={this.optionsBySelectChapters.bind(this)} getUpdatedCallback={this.getUpdatedChapters.bind(this)}/>
                  </div>
                  <div className="form-group">
                    <Moolyaselect multiSelect={true} placeholder={"Sub Chapter"} className="form-control float-label"
                                  valueKey={'value'} labelKey={'label'} selectedValue={this.state.subchapters}
                                  queryType={"graphql"} query={subChapterquery} queryOptions={subChapterOption}
                                  isDynamic={true} id={'query'} onSelect={this.optionsBySelectSubChapters.bind(this)}/>
                  </div>
                  <br className="clearfix"/> <br className="clearfix"/><br className="clearfix"/><br className="clearfix"/>
                  <br className="clearfix"/><br className="clearfix"/><br className="clearfix"/><br className="clearfix"/>
                  <br className="clearfix"/><br className="clearfix"/>
                </form>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="form_bg">
                <form>
                  <div className="form-group">
                    <textarea placeholder="About" ref="about"
                              defaultValue={this.state.data && this.state.data.aboutCommunity}
                              className="form-control float-label" id="cl_about"></textarea>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Show on map</label>
                    <label className="switch">
                      <input type="checkbox" ref="showOnMap"
                             checked={this.state.showOnMap} onChange={this.onShowMapChange.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                  <br className="brclear"/>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="status" checked={this.state.data && this.state.data.isActive}
                             onChange={this.onStatusChange.bind(this)}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </form>
              </div>
            </div>
              </Scrollbars>
            </div>
            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>)}
      </div>
    )
  }
}
;

export default MlEditCommunityFormComponent = formHandler()(MlEditCommunityFormComponent);
