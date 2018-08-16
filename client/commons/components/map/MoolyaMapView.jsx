import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import controllable from 'react-controllables';
//import GoogleMap from 'google-map-react';
//import MapMarkers from './mapMarkers'
import MapCluster from './MapCluster';
import MlLoader from '../../../commons/components/loader/loader';
import NoMarkerDataMessage from './NoMarkerDataMessage';

let defaultCenter={lat: 17.1144718, lng: 5.7694891};
@controllable(['center', 'zoom', 'hoverKey', 'clickKey'])
export default class MoolyaMapView extends Component {
componentDidMount(){
  setTimeout(function(){
    $('.gm-fullscreen-control').parent().addClass('hide');
  },1000);
}
  constructor(props){
    super(props);
    this.state = {
      pubSelector: null
    }
  }
  async componentWillMount() {
    let that = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        that.setState({lat,lng});
      });
    }

    let zoom = 1;
    let hasZoom=that.props.fetchZoom||false;
    if(hasZoom){
       zoom= await that.props.fetchZoomHandler(that.props)||zoom;
    }
    /*let loggedInUser = getAdminUserContext();
    if(loggedInUser.hierarchyLevel != 4){
      zoom = 4;
    }*/
    let hasCenter=that.props.fetchCenter||false;
    if(hasCenter){
      let center= await that.props.fetchCenterHandler(that.props);
      this.setState({center:center||defaultCenter,zoom:zoom});
     }else{
      this.setState({
        center:defaultCenter,
        zoom: zoom,
      });
    }
    // const resp = this.fetchZoomCenter()
    // return resp
  }

  // async fetchZoomCenter(){
  //   let that = this;
  //   let zoom = 1;
  //   let hasZoom=that.props.fetchZoom||false;
  //   if(hasZoom){
  //     zoom= await that.props.fetchZoomHandler(that.props)||zoom;
  //   }
  //   if(that.props.hasCenter){
  //     var center= await that.props.fetchCenterHandler(that.props);
  //     this.setState({center:center||defaultCenter,zoom:zoom});
  //   }else {
  //     this.setState({
  //       center: defaultCenter,
  //       zoom: zoom,
  //     });
  //   }
  // }

  componentWillUpdate(nextProps, nextState) {
    if ((this.state.sizePerPage !== nextState.sizePerPage) || (this.state.pageNumber !== nextState.pageNumber)) {

      let hasQueryOptions = this.props.queryOptions ? true : false;
      let variables = {
        offset: nextState.sizePerPage * (nextState.pageNumber - 1) || 0,
        limit: nextState.sizePerPage || 20  //5
      }
      if (hasQueryOptions) {
        let dynamicQueryOptions = this.props.buildQueryOptions ? this.props.buildQueryOptions(this.props) : {};
        // let extendedVariables = _.extend(dynamicQueryOptions);
        let extendedVariables = _.merge(dynamicQueryOptions, variables);
        this.props.fetchMore(extendedVariables);
      }
      if(this.state.searchValue!==nextState.searchValue){
        let searchCriteria=this.constructSearchCriteria(nextState.searchValue);
        variables.fieldsData=searchCriteria||null
        this.props.fetchMore(variables);
      }
      this.props.fetchMore(variables);
    }
    else if(this.state.searchValue!==nextState.searchValue){
      let searchCriteria=this.constructSearchCriteria(nextState.searchValue);
      let variables = {
        offset: nextState.sizePerPage * (nextState.pageNumber - 1) || 0,
        fieldsData :searchCriteria||null
      }
      this.props.fetchMore(variables);
    }
  }

  onStatusChange(userType,e) {
    if(userType === 'All' || userType === 'Reset'){
      this.setState({userType:''});
    }else
      this.setState({userType});

    let params = this.props.params;
    if(this.props.moduleName === 'externalUsersNew'){
      if (userType === 'Reset') {
        let path = FlowRouter._current.path;
        path = path.replace('/communityUsers','');
        path = path.replace(`/users`,'');
        // path = path.replace(`/${FlowRouter.getParam('userType')}`,'');
        FlowRouter.go(path);
      }else{
        let variables={};
        let hasQueryOptions = this.props.queryOptions ? true : false;
        if (hasQueryOptions) {
          if(params && params.clusterId) variables.clusterId = params.clusterId;
          if(params && params.chapterId) variables.chapterId = params.chapterId;
          if(userType) variables.userType = userType;

          variables = JSON.stringify(variables);

        }
        this.props.fetchMore({queryProperty:{query:variables}});

      }
    }else if(this.props.moduleName === 'cluster'){
      localStorage.setItem('userType',userType);
      if(userType !=='Reset'){
        let path = FlowRouter._current.path;

        if(path.includes('/true')){
          path = path.replace('/true',`/users/communityUsers`);
        }else
          path = path.replace('/dashboard',`/dashboard/users/communityUsers`);
        FlowRouter.go(path);
      }
    }else if(this.props.moduleName === 'chapter'){
      localStorage.setItem('userType',userType);
      if(userType !=='Reset'){
        let path = FlowRouter._current.path;
        path = path.replace('?',`/users?`);
        FlowRouter.go(path);
      }
    }else if(this.props.moduleName === 'subChapter'){
      localStorage.setItem('userType',userType);
      if(userType !=='Reset'){
        let path = FlowRouter._current.path;
        path = path.replace('?',`/users?`);
        FlowRouter.go(path);
      }
    }
  }

  render()
  {
    const hasCenter=this.state&&this.state.center?this.state.center:null;
    if(!hasCenter){
      return <MlLoader />;
    }
    const data=this.props.data&&this.props.data.data?this.props.data.data:[];
    let MapComponent = null;
    let MapFooterComponent=null;
    // Fix me
    var path = window.location.pathname;
    if(path.indexOf("/communities") !== -1){
      MapComponent=React.cloneElement(this.props.viewComponent,{data:data,config:this.props});
    }

    let count = this.props.data&&this.props.data.data?this.props.data.data.length : 0;

    if(this.props.mapFooterComponent){
      MapFooterComponent=React.cloneElement(this.props.mapFooterComponent,{data:data,mapContext:this.props,count:count});
    }

    let userType = this.state.userType || '';
    if(!userType){
      userType = localStorage.getItem('userType') || '';
      // if(userType) localStorage.removeItem('userType');
    }

    const communityIconList=
      <div className="community_icons">
        {/*{moduleName() && <a data-toggle="tooltip" title={moduleName()} data-placement="bottom" className="All map_active_community" data-filter="all">*/}
          {/*<p className='title'>{moduleName()}</p><span className={moduleClassName()+" br"} onClick={this.onStatusChange.bind(this, "Reset")}></span>*/}
        {/*</a>}*/}
        <a data-toggle="tooltip" title={moduleTooltipName() || 'All'} data-placement="bottom" className={userType?"All":"All active_community"} data-filter="all">
          <p className='title'>{moduleName()||'All'}</p><span className={moduleClassName()|| "ml ml-select-all"} onClick={this.onStatusChange.bind(this, moduleName()?"Reset":"All")}></span>
        </a>
        <a data-toggle="tooltip" title="Startups" data-placement="bottom" className={userType ==='Startups'?"STU Startups active_community":"STU Startups"} data-filter="startup">
          <p className='title'>Startups</p><span className="ml my-ml-Startups st" onClick={this.onStatusChange.bind(this, "Startups")}></span>
        </a>
        <a data-toggle="tooltip" title="Investors" data-placement="bottom" className={userType ==='Investors'?"FUN Investors active_community":"FUN Investors"} data-filter="funder">
          <p className='title'>Investors</p><span className="ml my-ml-Investors fu" onClick={this.onStatusChange.bind(this, "Investors")}></span>
        </a>
        <a data-toggle="tooltip" title="Ideators" data-placement="bottom" className={userType ==='Ideators'?"IDE Ideators active_community":"IDE Ideators"} data-filter="ideator">
          <p className='title'>Ideators</p><span className="ml my-ml-Ideator id" onClick={this.onStatusChange.bind(this, "Ideators")}></span>
        </a>

        <a data-toggle="tooltip" title="Service Providers" data-placement="bottom" className={userType ==='Service Providers'?"Service Providers active_community":"Service Providers"} data-filter="provider">
          <p className='title'>Service P</p><span className="ml my-ml-Service-Providers pr" onClick={this.onStatusChange.bind(this, "Service Providers")}></span>
        </a>
        {/*<a data-toggle="tooltip" title="Browsers" data-placement="bottom" className="Browsers" data-filter="browser">*/}
        {/*<span className="ml ml-browser br" onClick={this.onStatusChange.bind(this, "Browsers")}></span>*/}
        {/*</a>*/}
        <a data-toggle="tooltip" title="Institutions" data-placement="bottom" className={userType ==='Institutions'?"Institutions active_community":"Institutions"} data-filter="institution">
          <p className='title'>Institutions</p><span className="ml my-ml-Institutions ins" onClick={this.onStatusChange.bind(this, "Institutions")}></span>
        </a>
        <a data-toggle="tooltip" title="Companies" data-placement="bottom" className={userType ==='Companies'?"Companies active_community":"Companies"} data-filter="company">
          <p className='title'>Companies</p><span className="ml my-ml-Company co" onClick={this.onStatusChange.bind(this, "Companies")}></span>
        </a>

      </div>;

          //StartupsHexaMarker, InvestorsHexaMarker, IdeatorsHexaMarker, ServiceProvidersHexaMarker, InstitutionsHexaMarker, CompaniesHexaMarker, HexaMarker

    let pathUrl = FlowRouter._current.path;

    return (
      <span>
        {this.props.data&&this.props.data.data && this.props.data.data.length === 0 &&   <NoMarkerDataMessage userType={userType}/>}

        {// this.props.moduleName!=='cluster' &&
          !pathUrl.includes('/admin') &&  communityIconList
        }
        {
          MapComponent?MapComponent:
            <MapCluster lat={!pathUrl.includes('/admin')?this.state.lat:''} lng={!pathUrl.includes('/admin')?this.state.lng:''} data={data} userType={userType.replace(/\s+/, "")+'HexaMarker'} zoom={this.state.zoom} center={this.state.center} mapContext={this.props} module={this.props.module} showImage={this.props.showImage} getBounds={this.props.bounds}/>
        }
        {/*{data.length>0?<MlMapFooter data={data} mapContext={this.props}/>:
          <div className="bottom_actions_block bottom_count">
            <div><b>0</b> of <b>0</b> users are Active<br/></div>
          </div>
        }*/}
        {MapFooterComponent}

      </span>

    );

    /*
    const places = this.props.data&&this.props.data.data?this.props.data.data.map(place => {
      // const { ...data} = place;
      return (
        <MapMarkers {...this.props} module={this.props.module} key={place._id} lat={place.lat} isActive ={place.isActive} status ={place.status} lng={place.lng} text={place.text} markerId={place._id} hover={this.props.hoverKey === place._id} desc={place.desc}/>
          );
    }):[];*/

    /*return(
      <div className="map">
        <GoogleMap
          options={createMapOptions}
          bootstrapURLKeys={{key: "AIzaSyDnlajbJKYdilDs22Rvso9blSOj8KuL8-A"}}
          center={this.state.center}
          zoom={this.state.zoom}
          hoverDistance={40 / 2}
          onBoundsChange={this._onBoundsChange}
          onChildClick={this._onChildClick}
          onChildMouseEnter={this._onChildMouseEnter}
          onChildMouseLeave={this._onChildMouseLeave}>
          {places}
        </GoogleMap>
      </div>
    )*/

   /* let markerData=this.props.data&&this.props.data.data?this.props.data.data:[];
    const GMapComponent=GMap(markerData,{module:this.props.module},gMap);
 */
   }

}

function properName(name) {
  if (name) { return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/([A-Z])/g, ' $1').trim(); }
  return name;
}

function moduleName(){
  let path = FlowRouter._current.path;
  if(path === "/app/dashboard" || path === "/app/dashboard/true" || path.includes('/users/communityUsers')){
    return 'Cluster';
  }
  if(path.includes('chapters')){
    return 'Chapter';
  }
  if(path.includes('subChapters')){
    return 'Subchapter';
  }
  else
    return '';
}

function moduleTooltipName(){
  let path = FlowRouter._current.path;
  if(path === "/app/dashboard"||  path === "/app/dashboard/true" || path.includes('/users/communityUsers')){
    return 'Cluster';
  }
  if(path.includes('chapters')){
    return 'Chapter';
  }
  if(path.includes('subChapters')){
    return 'Subchapter';
  }
  else
    return '';
}

function moduleClassName(){
  let path = FlowRouter._current.path;
  if(path === "/app/dashboard" || path === "/app/dashboard/true" || path.includes('/users/communityUsers') ){
    return 'ml my-ml-cluster';
  }
  if(path.includes('chapters')){
    return 'ml my-ml-chapter';
  }
  if(path.includes('subChapters')){
    return 'ml my-ml-chapter';
  }
}

MoolyaMapView.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  // greatPlaceCoords: PropTypes.any
};
MoolyaMapView.shouldComponentUpdate = shouldPureComponentUpdate;

MoolyaMapView._onBoundsChange = (center, zoom) => {
  this.props.onCenterChange(center);
  this.props.onZoomChange(zoom);
}

MoolyaMapView._onChildClick = (key, childProps) => {
  this.props.onCenterChange([childProps.latitude, childProps.longitude]);
}

MoolyaMapView._onChildMouseEnter = (key) => {
  this.props.onHoverKeyChange(key);
}

MoolyaMapView._onChildMouseLeave = () => {
  this.props.onHoverKeyChange(null);
}

