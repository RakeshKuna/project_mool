import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import {
  updatePortfolioActionHandler,
  updateIdeatorIdeaActionHandler,
  approvePortfolio,
  rejectPortfolio
} from "../../actions/updatePortfolioDetails";
import {fetchTemplateHandler} from "../../../../../commons/containers/templates/mltemplateActionHandler";
import MlActionComponent from "../../../../../commons/components/actions/ActionComponent";
import {findComments} from "../../../../../commons/annotaterComments/findComments";
import {
  createCommentActionHandler,
  resolveCommentActionHandler,
  reopenCommentActionHandler
} from "../../../../../commons/annotaterComments/createComment";
import moment from "moment";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import {fetchIdeaByPortfolioId} from "../../../../../app/portfolio/ideators/actions/ideatorActionHandler";
import MlLoader from "../../../../../commons/components/loader/loader";
import _ from "lodash";
import {client} from "../../../../core/apolloConnection";
import {getAdminUserContext} from "../../../../../commons/getAdminUserContext";

class MlPortfolio extends React.Component {
  constructor(props) {
    // console.log('LOG from MlPortfolio');
    super(props)
    this.state = {
      editComponent: '', portfolio: {}, privateKeys: [], removePrivateKeys: [], selectedTab: "", annotations: [],
      isOpen: false, annotationData: {}, commentsData: [], popoverOpen: false, saveButton: false, commentsCount: null
    }
    this.windowBackHistory = FlowRouter._current.oldRoute && FlowRouter._current.oldRoute.name;
    this.requiredFieldAry = []
    this.fetchEditPortfolioTemplate.bind(this);
    this.fetchViewPortfolioTemplate.bind(this);
    this.getPortfolioDetails.bind(this);
    this.getContext.bind(this);
    this.getSelectedAnnotation.bind(this);
    this.getIdeatorIdeaDetails.bind(this);
    this.fetchComments.bind(this);
    this.toggle = this.toggle.bind(this);
    this.fetchIdeaId.bind(this);
    // this.updatePrivateKeys.bind(this);
    return this;
  }

  toggle() {
    if ($(".annotator-widget").is(':visible')) {
      this.setState({
        popoverOpen: false
      });
    } else {
      this.setState({
        popoverOpen: !this.state.popoverOpen
      });
    }

  }


  // componentDidMount() {
  //   let portfolioId = this.props.config;
  // }

  getContext() {
    return {
      annotationsInfo: this.state.annotations
    }
  }

  getSelectedAnnotation(selAnnotation) {
    if (!this.state.popoverOpen) {
      this.toggle();
      $('.comment_wrap').slideToggle();
    }
    if (selAnnotation) {
      this.setState({annotationData: selAnnotation}, function () {
        this.fetchComments(selAnnotation.id);
      })
    }
  }

  commentClicked() {
    $('.comment_wrap').slideToggle();
    this.setState({"saveButton": true})
  }

  async componentWillMount() {
    this.loggedUserDetails = getAdminUserContext();
    if (this.props.viewMode) {
      this.fetchViewPortfolioTemplate(this.props.config);
    } else {
      this.fetchEditPortfolioTemplate(this.props.config);
    }
    if (this.props.communityType == "Ideators") {
      this.setState({loading: true});
      this.fetchIdeaId()
    } else {
      this.setState({ideaId: " "})
    }
  }

  async updateApproveUser() {
    let portfolioId = this.props.config
    const response = await approvePortfolio(portfolioId, this.loggedUserDetails);
    if (response.success) {
      toastr.success("Portfolio approved successfully")
      FlowRouter.go('/admin/transactions/portfolio/requestedPortfolioList')
    } else {
      toastr.error(response.result)
    }
  }

  approveUser() {
    const resp = this.updateApproveUser();
    return resp;
  }

  async updateRejectUser() {
    let portfolioId = this.props.config
    const response = await rejectPortfolio(portfolioId);
    if (response) {
      // this.props.getRegistrationKYCDetails();
      toastr.success("Portfolio rejected successfully")
    }
  }

  rejectUser() {
    const resp = this.updateRejectUser();
    return resp;
  }

  async fetchIdeaId() {
    let portfolioId = this.props.config;
    const response = await fetchIdeaByPortfolioId(portfolioId);
    if (response) {
      this.setState({ideaId: response._id, loading: false});
    } else {
      toastr.error('Idea is not initiated');
      this.setState({loading: false})
      FlowRouter.go('/admin/transactions/portfolio/requestedPortfolioList')
    }
  }

  async fetchEditPortfolioTemplate(pId) {
    let userType = this.context.userType;
    const reg = await fetchTemplateHandler({
      process: "Registration",
      subProcess: "Registration",
      stepCode: "PORTFOLIO",
      recordId: pId,
      mode: "edit",
      userType: userType,
      connection: client
    });
    this.setState({editComponent: reg && reg.component ? reg.component : null});
  }

  async fetchViewPortfolioTemplate(id) {
    let userType = this.context.userType;
    const reg = await fetchTemplateHandler({
      process: "Registration",
      subProcess: "Registration",
      stepCode: "PORTFOLIO",
      recordId: id,
      mode: "view",
      userType: userType,
      connection: client
    });
    this.setState({editComponent: reg && reg.component ? reg.component : null});
  }

  async onSavingComment() {
    let commentsData = {
      annotatorId: this.state.annotationData.id,
      portfolioId: this.props.config,
      comment: this.refs.comment.value
    }

    const response = await createCommentActionHandler(commentsData, client)

    if (response) {
      this.setState({annotationData: this.state.annotationData}, function () {
        this.fetchComments(this.state.annotationData.id);
      })
      this.refs.comment.value = ""
    }
  }

  async onResolveComment() {
    const response = await resolveCommentActionHandler(this.state.annotationData.id, client)
    if (response && response.success)
      toastr.success(response.result);
    return response;
  }


  async onReopenComment() {
    const response = await reopenCommentActionHandler(this.state.annotationData.id, client)
    if (response && response.success)
      toastr.success(response.result);
    return response;
  }


  async fetchComments(annotationId) {
    if (annotationId) {
      const response = await findComments(annotationId, client);
      this.setState({commentsData: response}, function () {
        if (response && response.length) {
          this.setState({commentsCount: response.length})
        } else {
          this.setState({commentsCount: 0})
        }
      });
    }
  }

  getIdeatorIdeaDetails(details, privateKey, requiredFields) {
    this.setState({idea: details});
    if (!_.isEmpty(privateKey)) {
      this.updatePrivateKeys(privateKey)
    }
    if (requiredFields)
      this.updateRequiredFields(requiredFields)
  }

  updateRequiredFields(requiredFields) {
    console.log("requiredFields", requiredFields)
    var ary = this.requiredFieldAry
    _.remove(ary, {tabName: requiredFields.tabName, index: requiredFields.index})
    if (requiredFields && requiredFields.errorMessage) {
      ary.push(requiredFields)
    }
    this.requiredFieldAry = ary
  }

  getPortfolioDetails(portfolioDetails, privateKey, requiredFields) {

    console.log("portfolioDetails ", portfolioDetails)
    console.log("privateKey ", privateKey)
    console.log("requiredFields ", requiredFields)

    this.setState({portfolio: portfolioDetails});
    if (!_.isEmpty(privateKey)) {
      this.updatePrivateKeys(privateKey)
    }
    if (requiredFields)
      this.updateRequiredFields(requiredFields)
  }

  updatePrivateKeys(privateKey) {
    var keyName = privateKey.keyName
    var booleanKey = privateKey.booleanKey
    var isPrivate = privateKey.isPrivate
    var objectName = ""
    var index = -1;
    var tabName = ""
    if (privateKey.index >= 0) {
      index = privateKey.index
    } else index = 0;
    if (privateKey.tabName) {
      tabName = privateKey.tabName
    }
    if (privateKey.objectName) {
      objectName = privateKey.objectName
    }

    // var keyIndex = _.findIndex(this.state.privateKeys, {keyName:keyName, index:index})
    var keyIndex = _.findIndex(this.state.privateKeys, {keyName: keyName, index: index, tabName: tabName});
    if (keyIndex < 0 && index >= 0) {
      // keyIndex = _.findIndex(this.state.privateKeys, {keyName:keyName, index:index})
      keyIndex = _.findIndex(this.state.privateKeys, {keyName: keyName, index: index, tabName: tabName});
    }
    var privateKeys = this.state.privateKeys;
    var removePrivateKeys = this.state.removePrivateKeys;
    if (isPrivate && keyIndex < 0) {
      // var rIndex = _.findIndex(this.state.removePrivateKeys, {keyName:keyName, index:index})
      var rIndex = _.findIndex(this.state.removePrivateKeys, {keyName: keyName, index: index, tabName: tabName});
      removePrivateKeys.splice(rIndex, 1);
      privateKeys.push({
        keyName: keyName,
        booleanKey: booleanKey,
        index: index,
        tabName: tabName,
        objectName: objectName
      });
      // this.setState({privateKeys:privateKeys})
    } else if (!isPrivate) {
      if (keyIndex >= 0) {
        var keyObj = _.cloneDeep(privateKeys[keyIndex])
        removePrivateKeys.push(keyObj)
        privateKeys.splice(keyIndex, 1);
      } else {
        removePrivateKeys.push({
          keyName: keyName,
          booleanKey: booleanKey,
          index: index,
          tabName: tabName,
          objectName: objectName
        })
      }
    }
    this.setState({privateKeys: privateKeys, removePrivateKeys: removePrivateKeys})
  }

  async updatePortfolioDetails() {
    const isRequired = this.isRequired()
    if (!isRequired) {
      var jsonData = {
        portfolioId: this.props.config,
        portfolio: this.state.portfolio,
        privateKeys: this.state.privateKeys,
        removeKeys: this.state.removePrivateKeys
      }
      // toastr.success("server hit")
      const response = await updatePortfolioActionHandler(jsonData)
      if (response) {
        if (this.props.communityType == "Ideators") {
          let idea = this.state.idea
          if (idea) {
            const response1 = await updateIdeatorIdeaActionHandler(idea, this.loggedUserDetails)
            return response1;
          }
        }
        return response;
      }
    } else
      toastr.error(isRequired.errorMessage + ' in ' + isRequired.tabName);
  }

  isRequired() {
    console.log("this.requiredFieldAry", this.requiredFieldAry)
    const error = this.requiredFieldAry && this.requiredFieldAry.length ? this.requiredFieldAry[0] : null
    if (error) {
      return error
    }
  }

  /**
   * success handle if no error in server
   * */
  async handleSuccess(response) {
    if (response && response.success)
      toastr.success(response.result)
    else if (response && !response.success)
      toastr.error(response.result)
    // FlowRouter.go("/admin/transactions/portfolio/requestedPortfolioList");
  };

  render() {
    let that = this;
    let MlActionConfig = []
    // if(FlowRouter.getRouteName() === "portfolio_requested"){
    //   MlActionConfig.push({
    //     showAction: true,
    //     actionName: 'edit',
    //     handler: null
    //   });
    // }
    MlActionConfig.push({
      actionName: 'save',
      showAction: true,
      handler: async (event) => this.props.handler(this.updatePortfolioDetails.bind(this), this.handleSuccess.bind(this))
    });
    MlActionConfig.push({
      showAction: true,
      actionName: 'cancel',
      handler: async (event) => {
        if (this.windowBackHistory == "portfolio_approved")
          FlowRouter.go("/admin/transactions/portfolio/approvedPortfolioList");
        else if (this.windowBackHistory == "portfolio_requested") {
          FlowRouter.go("/admin/transactions/portfolio/requestedPortfolioList");
        }
        else {
          window.history.back();
        }
      }
    });
    MlActionConfig.push({
      showAction: true,
      actionName: 'assign',
      handler: null
    });
    if (FlowRouter.getRouteName() != "transaction_portfolio_EditRequests") {
      MlActionConfig.push(
        {
          showAction: true,
          actionName: 'comment',
          handler: null,
          iconID: 'Popover1'
        },
        {
          showAction: true,
          actionName: 'approveUser',
          handler: this.approveUser.bind(this)
        },
        {
          showAction: true,
          actionName: 'rejectUser',
          handler: this.rejectUser.bind(this)
        });
    }
    let EditComponent = "";
    let ViewComponent = "";
    if (this.props.viewMode) {
      ViewComponent = this.state.editComponent;
    } else {
      EditComponent = this.state.editComponent;
    }


    let hasViewComponent = false
    let hasEditComponent = false
    if (EditComponent != "")
      hasEditComponent = true
    if (ViewComponent != "")
      hasViewComponent = true

    let annotations = this.state.annotations;
    let annotationDetails = this.state.annotationData;
    const showLoader = this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? (<MlLoader/>) : (
          <div className="admin_padding_wrap">
            <div className='step-progress'>
              {/*{this.props.viewMode?<ViewComponent getPortfolioDetails={this.getPortfolioDetails.bind(this)} portfolioDetailsId={this.props.config}/>:<EditComponent getPortfolioDetails={this.getPortfolioDetails.bind(this)} portfolioDetailsId={this.props.config}/>}*/}
              {hasEditComponent && <EditComponent getPortfolioDetails={this.getPortfolioDetails.bind(this)}
                                                  getIdeatorIdeaDetails={this.getIdeatorIdeaDetails.bind(this)}
                                                  portfolioDetailsId={this.props.config} ideaId={this.state.ideaId}
                                                  privateKeys={this.state.privateKeys}
                                                  removePrivateKeys={this.state.removePrivateKeys}/>}
              {hasViewComponent && <ViewComponent getPortfolioDetails={this.getPortfolioDetails.bind(this)}
                                                  portfolioDetailsId={this.props.config} ideaId={this.state.ideaId}
                                                  annotations={annotations}
                                                  getSelectedAnnotations={this.getSelectedAnnotation.bind(this)}/>}
            </div>
          </div>)}
        {/*<div className="overlay"></div>*/}
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
          <PopoverTitle>Portfolio Annotations</PopoverTitle>
          <PopoverContent>
            <div className="ml_annotations">
              <div className="comments-container cus_scroll large_popover">
                <ul id="comments-list" className="comments-list">
                  <li>
                    <div className="comment-main-level">
                      <div className="comment-avatar"><img src="/images/def_profile.png" alt="No image available"/>
                      </div>
                      <div className="comment-box">
                        <div style={{marginTop: '8px'}} className="annotate">{this.state.commentsCount}</div>
                        <div style={{paddingLeft: '50px'}} className="comment-head">
                          <h6
                            className="comment-name"> {annotationDetails.userName ? annotationDetails.userName : ""}</h6>
                          {annotationDetails.roleName ? <div
                            className="author">{annotationDetails.roleName ? annotationDetails.roleName : ""}</div> : ""}
                          <span>{moment(annotationDetails.createdAt).format('DD MMM YYYY,HH:mm:ss')}</span>
                        </div>
                        <div className="comment-content">
                          {annotationDetails.text}
                        </div>

                      </div>
                    </div>
                    <div className="ml_btn">
                      <a className="save_btn" onClick={this.onResolveComment.bind(this)}>Resolve</a>
                      <a className="cancel_btn" onClick={this.onReopenComment.bind(this)}>Re open</a>
                      <a className="cancel_btn" onClick={this.commentClicked.bind(this)}>Comment</a>
                    </div>
                    <div className="comment_wrap">
                      <textarea ref="comment" className="form-control comment-input-box"
                                placeholder="Enter your comment here"></textarea>

                      <a href="" data-id={annotationDetails.id} className="circle_btn">
                        <span className="fa fa-check" onClick={this.onSavingComment.bind(this)}></span>
                      </a>

                    </div>

                    <ul className="comments-list reply-list">
                      {that.state.commentsData.map(function (options, key) {
                        return (<li key={key}>
                          <div className="comment-avatar">
                            <img src={options.profileImage ? options.profileImage : "/images/def_profile.png"} alt=""/>
                          </div>
                          <div className="comment-box">
                            <div className="comment-head">
                              <h6 className="comment-name">{options.firstName} {options.lastName}</h6>
                              <span>{moment(options.createdAt).format('DD MMM YYYY,HH:mm:ss')}</span>
                            </div>
                            <div className="comment-content">
                              {options.comment}
                            </div>
                          </div>
                        </li>)
                      })}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            {/*<div className="overlay"></div>*/}
          </PopoverContent>
        </Popover>
        {this.props.isHideAction ? <div></div> :
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>}
      </div>
    )
  }
}

MlPortfolio.contextTypes = {
  userType: PropTypes.string,
  annotationsInfo: PropTypes.array,
  breadCrum: PropTypes.object
};

export default MlPortfolio = formHandler()(MlPortfolio);
