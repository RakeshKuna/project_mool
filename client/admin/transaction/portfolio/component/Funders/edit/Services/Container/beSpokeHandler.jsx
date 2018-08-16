import React, { Component } from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { multipartASyncFormHandler } from '../../../../../../../../commons/MlMultipartFormAction'
import { fetchServicesActionHandler, createBeSpokeServiceActionHandler, fetchBeSpokeServicesActionHandler, updateBeSpokeServiceActionHandler } from '../../../../../../../../app/calendar/manageScheduler/service/actions/MlServiceActionHandler'
import Moolyaselect from '../../../../../../../commons/components/MlAdminSelectWrapper'
import _ from "lodash";
import BeSpokeView from '../Presentation/beSpokeView'


var Select = require('react-select');

export default class BeSpokeHandler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndustryType: [],
      responsePic: [],
      attachmentDocs: [{}],
      data: {},
      emptyData: {},
      selectedIndex: 0,
      funderService: [],
      selectedFrequencyType: [],
      saveData: false,
      updateData: false,
      mode: false,
      details: {
        mode: 'offline'
      }
    };
    this.handleBlur.bind(this);
    this.onOptionSelected.bind(this);
    this.saveBeSpokeServiceDetails.bind(this)
    this.isValidBeSpoke = this.isValidBeSpoke.bind(this);
  }

  componentDidMount() {
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function () {
      if ($(this).parent().hasClass('nocolor-switch')) {

        if ($(this).is(':checked')) {
          $('.state_label:nth-of-type(1)').removeClass('acLabel');
          $('.state_label:nth-of-type(2)').addClass('acLabel');
        } else {
          $('.state_label:nth-of-type(2)').removeClass('acLabel');
          $('.state_label:nth-of-type(1)').addClass('acLabel');
        }
      } else {
        if ($(this).is(':checked')) {
          $(this).parent('.switch').addClass('on');
        } else {
          $(this).parent('.switch').removeClass('on');
        }
      }
    });

    $('.tab_wrap_scroll').height(WinHeight - ($('.app_header').outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".tab_wrap_scroll").mCustomScrollbar({ theme: "minimal-dark" });
    }
  }

  componentWillMount() {
    if (this.props.beSpokeDetails) {
      let details = this.props.beSpokeDetails[this.props.beSpokeIndex];
      details = JSON.parse(JSON.stringify(details));
      this.setState({ details: details })
      console.log(details)
      let mode = this.props.beSpokeDetails[this.props.beSpokeIndex].mode;
      if (mode === 'offline')
        this.setState({ mode: true })
      else
        this.setState({ mode: false })
    }
  }

  /**
   * Method :: handleBlur
   * Description :: Every text fields hits this function onBlur and respective data is stored in data Object
   * @params ::  event Handler
   * returns ::  data is redirected to sendDataToParent()
   **/


  handleBlur(value, name) {
    let { details } = this.state;
    if(name === 'minutes'){if(value > 59) value = 59;}
    if ("duration" in details) details.duration[name] = value?parseInt(value):0;
    else {
      let duration={};
      duration[name] = value?parseInt(value):0;
      details.duration = duration;
    }
    this.setState({ details })
  }

  /**
   * Method :: handleDuration
   * Description :: Duration field is handled
   * @params ::  event Handler
   * returns ::  data is set in details object
   **/

  handleDuration() {
    let duration = {
      hours: this.state.hour ? parseInt(this.state.hour) : 0,
      minutes: this.state.minute ? parseInt(this.state.minute) : 0
    }
    let details = this.state.details;
    details = _.omit(details, ['duration']);
    details = _.extend(details, { ['duration']: duration });
    this.setState({ details: details })
  }

  /**
   * Validate the form data for mandatory fields
   * return: boolean
   */
  isValidBeSpoke() {
    const formInputs = this.state.details;
    if (!formInputs.displayName) {
      toastr.error('Display name is mandatory');
      return false;
    }
    if (!formInputs.noOfSession) {
      toastr.error('Required number of sessions is mandatory');
      return false;
    }
    if (!formInputs.duration
      || (formInputs.duration && !formInputs.duration.hours && !formInputs.duration.minutes)) {
      toastr.error('Duration is mandatory');
      return false;
    }
    if (formInputs.mode === 'online'
      && !(formInputs.conversation && formInputs.conversation.length)) {
      toastr.error('Conversations is mandatory');
      return false;
    }
    return true;
  }

  /**
   * Method :: updateBeSpokeData
   * Description :: Updates the data in edit mode
   * @params ::  No params
   * returns ::  response from the server
   **/


  async updateBeSpokeData(data) {
    if (data && this.isValidBeSpoke()) {
      let detailsData = _.cloneDeep(this.state.details);
      let temp = _.omit(detailsData.duration, '__typename');
      let attachTemp = [];
      if (detailsData.beSpokeAttachments && detailsData.beSpokeAttachments.length) {
        attachTemp = detailsData.beSpokeAttachments.map(function (info, index) {
             if (info.fileUrl === undefined) {
              _.omit(images, _.isUndefined)
            }
          delete info['__typename']
          return info;
        })
      }
      detailsData.duration = temp;
      detailsData.beSpokeAttachments = attachTemp;
      let service = _.omit(detailsData, '__typename');
      const resp = await updateBeSpokeServiceActionHandler(service, this.props.portfolioDetailsId)
      if (resp && resp.success) {
        toastr.success("Bespoke request updated successfully");
        this.props.componentToView('landingPage');
      } else {
        if (!resp) {
          toastr.error("No response from server");
        } else {
          toastr.error(resp.result);
        }
      }
      return resp;
    }
  }

   /**
   * Method :: saveBeSpokeServiceDetails
   * Description :: Saves the data
   * @params ::  No params
   * returns ::  response from the server
   **/


  async saveBeSpokeServiceDetails(data) {
    if (data && this.isValidBeSpoke()) {
      const res = await createBeSpokeServiceActionHandler(this.state.details, this.props.portfolioDetailsId);
      if (res && res.success) {
        toastr.success("Bespoke request created successfully");
        this.props.componentToView('landingPage');
      } else {
        if (!res) {
          toastr.error("No response from server");
        } else {
          toastr.error(res.result);
        }
      }
    }
  }


  /**
   * Method :: onOptionSelected
   * Description :: Multi-select to determine the types of industries
   * @params ::  selectedIndustry : type :: String
   * returns ::  data is redirected to sendDataToParent()
   **/

  onOptionSelected(selectedIndustry) {
    let details = this.state.details;
    details['industryId'] = selectedIndustry;
    this.setState({ details: details })
  }

  /**
   * Method :: onConversationSelected
   * Description :: Multi-select to determine the types of conversation
   * @params ::  selectedConversation : type :: String
   * returns ::  data is redirected to sendDataToParent()
   **/


  onConversationSelected(selectedConversation) {
    let temp = []
    selectedConversation.map(function (data) {
      temp.push(data.label)
    })
    let details = this.state.details;
    details['conversation'] = temp;
    this.setState({ details: details }, function () {
      console.log(this.state.details);
    })
  }

  /**
   * Method :: onFrequencySelected
   * Description :: Daily, Weekly and Monthly options are provided to be chosen from
   * @params ::  selectedFrequency : type :: String
   * returns ::  data is redirected to sendDataToParent()
   **/

  onFrequencySelected(selectedFrequency) {
    let details = this.state.details;
    details['sessionFrequency'] = selectedFrequency.value;
    this.setState({ details: details }, function () {
      console.log(this.state.details);
    })
  }

  /**
   * Method :: modeSwitchHandler
   * Description :: Checkbox to determine the mode of operation
   * @params ::  event handler
   * returns ::  data is redirected to sendDataToParent()
   **/

  modeSwitchHandler(response, name) {
    let details = this.state.details;
    details = _.omit(details, [name]);
    details = _.extend(details, { [name]: response ? "offline" : "online" });
    this.setState({ details: details })
  }

  /**
   * Method :: onFileUpload
   * Description :: File uploading action is done here. Once uploaded it hits onFileUploadCallBack()
   * and the return to current function and call storeImage()
   * returns :: Hits onFileUploadCallBack()
   * **/
  async onFileUpload(e) {
    let file = e.target.files[0];
    let fileDetails = {
      fileName: file.name,
      fileSize: file.size
    };
    let user = {profile: {InternalUprofile: { moolyaProfile: { profileImage: " " } } } };
    if (file) {
      let data = { moduleName: "PROFILE", actionName: "UPDATE", user: user };
      let response = await multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this,fileDetails));
      return response;
    }
  }

   /**
   * Method :: onFileUploadCallBack
   * Description :: Checkbox to determine the mode of operation
   * @params ::  fileDetails : Object , resp : response from the server
   * returns ::  null
   **/

  onFileUploadCallBack(fileDetails,resp) {
    let details = this.state.details;
    let fileContainer = [];
    if (resp) {
      var fileUrl = $.parseJSON(resp).result;
      fileDetails.fileUrl = fileUrl;
      fileContainer.push(fileDetails);
      if(details['beSpokeAttachments']) details['beSpokeAttachments'].push(fileDetails)
      else details['beSpokeAttachments'] = fileContainer;
      this.forceUpdate();
    }
  }


  DataToBeSet(response, name) {
    if (name === 'mode') {
      let details = this.state.details;
      details = _.omit(details, [name]);
      details = _.extend(details, { [name]: response ? 'offline' : 'online' });
      this.setState({ details: details })
      console.log(this.state.details)
    } else {
      let details = this.state.details;
      details = _.omit(details, [name]);
      details = _.extend(details, { [name]: response });
      this.setState({ details: details }, function () {
        console.log(this.state.details)
      })
    }
  }

  render() {
    return (
      <BeSpokeView
        saveBeSpokeServiceDetails={this.saveBeSpokeServiceDetails.bind(this)}
        updateBeSpokeData={this.updateBeSpokeData.bind(this)}
        dataToSet={this.DataToBeSet.bind(this)}
        data={this.state.details}
        conversation={this.onConversationSelected.bind(this)}
        frequency={this.onFrequencySelected.bind(this)}
        industry={this.onOptionSelected.bind(this)}
        duration={this.handleBlur.bind(this)}
        fileUpload={this.onFileUpload.bind(this)}
        modeSwitchHandler={this.modeSwitchHandler.bind(this)}
        componentToView={this.props.componentToView}
      />
    )
  }
};
