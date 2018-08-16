import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import chapterRoutes from "../actions/chapterRoutes";
import {getAdminUserContext} from "../../../commons/getAdminUserContext";
import {findRoleActionHandler} from '../../settings/rolesAndPermissions/actions/findRoleAction';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';

export default class MlSubChapterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSystemDefined:null
    }
    return this;
  }
  componentWillMount() {
    const resp = this.findRole();
    return resp;
  }
  async findRole() {
    var loggedInUser = getAdminUserContext();
    let roleid = loggedInUser.roleId
    const response = await findRoleActionHandler(roleid);
    if (response) {
      this.setState({isSystemDefined:response.isSystemDefined})
    }
  }
  render(){
    const data=this.props.data||[]
    let isSystemDefined=this.state.isSystemDefined;
    var loggedInUser = getAdminUserContext();
    const subChapter = (loggedInUser && loggedInUser.hierarchyLevel > 1&& isSystemDefined) ? [{'href': '/admin/myroute'}] : []
    const addSubChapter = subChapter.map(function (item,idx) {
      return (
        <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
          <div className="list_block">
            <div className="cluster_status"></div>
            <a href={chapterRoutes.createSubChapterDetails(FlowRouter.current().params.clusterId, FlowRouter.current().params.chapterId)}>
              <div className={"hex_outer"}><span className="ml ml-plus"></span></div>
            </a>
            <h3>Add Sub Chapter</h3>
          </div>
        </div>
      )
    });
    const list=  data.map(function(prop, idx) {
      let icon, status;
      if (prop.isActive && prop.showOnMap) {
        status = "active";
        // icon = "active-User"
      } else if (prop.isActive && !prop.showOnMap) {
        status = "add";
        // icon ="add";
      } else if (!prop.isActive && prop.showOnMap) {
        status = "inactive";
        // icon = "inactive-user"
      } else {
        status = "assign";
        // icon = "assign";
      }
      return (
        <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
          <div className="list_block">
            <div className={`cluster_status ${status}_cl`}><span className={`ml ml-${icon}`}></span></div>
            {prop.isDefaultSubChapter?<div className="list-moolya-icon"><span className="ml ml-moolya-symbol"></span></div>:<span></span>}
            <a href={chapterRoutes.subChapterDetails(prop.clusterId, prop.chapterId, prop._id, prop.subChapterName)}>
              <div className={"hex_outer"}>{prop.subChapterImageLink ? <img src={generateAbsolutePath(prop.subChapterImageLink)}/> : <span
                className="ml ml-moolya-symbol"></span>}</div>
            </a>
            <h3>{prop.subChapterName}</h3>
          </div>
        </div>
      )
    });

    return (<div className="row">
      <h2>Add SubChapter</h2>
      {addSubChapter}
      {list}
      </div>);

  }

}

