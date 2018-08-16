import React, {Component, PropTypes} from "react";
import hierarchyRoutes from "../actions/hierarchyRoutes";
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';

export default class MlClusterSubChaptersListHierarchy extends Component
{
  constructor(props){
    super(props)
    this.state={
      data:[]
    }
    return this;
  }

  render(){
    const subChapterData=this.props.data||[]
    let listMoolya = null, temp=0;
    if(subChapterData.length>0){
      let data=[]
      data = subChapterData;
      listMoolya=  data.map( function(prop,idx) {
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
        var imageLink = prop.subChapterImageLink ? generateAbsolutePath(prop.subChapterImageLink) : "/images/sub_default.jpg";
        return(
          <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
            <div className="list_block">
              <div className={`cluster_status ${status}_cl`}><span className={`ml ml-${icon}`}></span></div>
              <a href={hierarchyRoutes.hierarchyDetails(prop.clusterId,prop._id,prop.isDefaultSubChapter)}>
                <div className={"hex_outer"}>
                  {prop.isDefaultSubChapter ? <span className={"ml ml-moolya-symbol"}></span> :
                    <img src={imageLink}/>}
                </div>
              </a>
              <h3>{prop.isDefaultSubChapter ? "moolya" : prop.subChapterName}</h3>
            </div>
          </div>
        )
      });
    } else {
      listMoolya=  <div><h3>No Sub Chapters Available</h3></div>
    }


    return (<div className="row">{listMoolya}</div>);

  }
}
