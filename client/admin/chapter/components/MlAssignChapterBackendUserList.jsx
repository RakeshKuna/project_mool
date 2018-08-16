import React from 'react';
import {fetchAssignUsersActionHandler} from '../../../commons/fetchAssignUsers'
import {client} from '../../core/apolloConnection';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';

export default class MlAssignChapterBackendUserList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            backendUsers:[]
        }

        this.fetchAssignUsers.bind(this);
        this.onBackEndUserClick.bind(this);
        return this;
    }

    componentDidMount() {
        const resp=this.fetchAssignUsers();
    }

    async fetchAssignUsers(){
      let clusterId = this.props.clusterId;
      let chapterId = this.props.chapterId;
      let subChapterId = this.props.subChapterId;
      let subChapterName = this.props.subChapterName;
      let communityId = this.props.communityId?this.props.communityId:"";
      const response = await fetchAssignUsersActionHandler(clusterId, chapterId, subChapterId, communityId,subChapterName,client);
      let data = response ? response : []
      this.setState({loading:false, backendUsers:data});
    }

    onBackEndUserClick(user){
      this.props.updateSelectedBackEndUser(user._id);
    }

    render(){
        let that = this
        let backendUsers = that.state.backendUsers
        return(
          <div>
            {backendUsers.map(function (user, ids) {
              let status, icon;
              if (user.profile.isActive) {
                status = "active";
                icon = "active-User";
              } else {
                status = "inactive";
                icon = "inactive-user"
              }
              return (
                <div className="col-lg-4 col-md-6 col-sm-4" key={ids} onClick={that.onBackEndUserClick.bind(that, user)}>
                  <div className="list_block provider_block">
                    <div className={`cluster_status ${status}_cl`}>{/*<span className={`ml ml-${icon}`}></span>*/}</div>
                    <div className="provider_mask"><img src="/images/funder_bg.png"/>
                      <img className="user_pic" src={user.profile && user.profile.profileImage?generateAbsolutePath(user.profile.profileImage):"/images/def_profile.png"}/>
                    </div>
                    {/*<h3>{user.username}<br />USA</h3>*/}
                    <h3>{user.username}</h3>
                  </div>
                </div>
              )
            })}
          </div>
        )
    }
}
