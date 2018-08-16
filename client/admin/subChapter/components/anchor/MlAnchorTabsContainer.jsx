/**
 * Created by vishwadeep on 12/9/17.
 */
import React from 'react';
import StepZilla from '../../../../commons/components/stepzilla/StepZilla';
import MlAnchorList from './MlAnchorList';
import MlAnchorObjective from './MlAnchorObjective';
import MlAnchorContact from './MlAnchorContact';
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import formHandler from '../../../../commons/containers/MlFormHandler';
import { updateSubChapterActionHandler } from '../../actions/updateSubChapter'
import { updateBackendUserActionHandler } from '../../../settings/backendUsers/actions/updateBackendUserAction'
import { findSubChapterActionHandler } from '../../actions/findSubChapter';

import moment from "moment";

class MlAnchorTabsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objective: [
        {
          description: '',
          status: false
        }
      ],
      subChapter: {
        contactDetails: [],
      },
      contactDetailsFormData: {
        // selectedIndex: -1,
        formData: {
          // name : '',
          addressTypeName: 'Subchapter',
          contactNumber: '',
          buildingNumber: '',
          street: '',
          landmark: '',
          area: '',
          cityId: '',
          stateId: '',
          countryId: '',
          pincode: '',
          latitude: '',
          longitude: '',
          // emailId: '',
          // contactPersonRole: '',
          // addressTypeId: '',
          // status: false,
        },
      },
    };
    this.getObjectiveDetails = this.getObjectiveDetails.bind(this);
    this.getContactDetails = this.getContactDetails.bind(this);
    this.updateAnchorDetails = this.updateAnchorDetails.bind(this);
    this.onContactChange = this.onContactChange.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.setModule = this.setModule.bind(this);
    return this;
  }

  async componentDidMount() {
    const { clusterId, chapterId, subChapterId } = this.props;
    const resp = await findSubChapterActionHandler(clusterId, chapterId, subChapterId);
    let {contactDetailsFormData} = this.state;
    contactDetailsFormData.formData = resp.contactDetails && resp.contactDetails.length? resp.contactDetails[0]:contactDetailsFormData.formData;
    this.setState({ subChapter: resp , contactDetailsFormData });
  }

  async handleSuccess(response) {
    if (response && response.success)
      toastr.success('Updated Successfully')
    else
      toastr.error(response.result);
  }

  /**
   * @todo : please use mlFieldValidations for validating fields
   * @todo : for the first condition when {contactDetails} in db is empty then its throwing error
   */
  async updateAnchorDetails() {
    let response;

    const { clusterId, chapterId, subChapterId } = this.props;

    switch (this.state.module) {
      case 'subchapter':
        let stateContactDetails = this.state.subChapter.contactDetails?Object.assign(this.state.subChapter.contactDetails):[{}];

        stateContactDetails[0] = this.state.contactDetailsFormData.formData;

        // if( !stateContactDetails[0].name){
        //   toastr.error("Name is required in contact form");
        //   return
        // }
        if( !stateContactDetails[0].buildingNumber){
          toastr.error("Flat/House/floor/Building No is required in contact form");
          return
        }

        if( !stateContactDetails[0].street){
          toastr.error("Colony/Street/Locality is required in contact form");
          return
        }
        if(!stateContactDetails[0].landmark){
          toastr.error("Landmark is required in contact form");
          return
        }
        if(!stateContactDetails[0].area){
          toastr.error("Area is required in contact form");
          return
        }
        if( !stateContactDetails[0].countryId){
          toastr.error("Country is required in contact form");
          return
        }
        if( !stateContactDetails[0].stateId){
          toastr.error("State is required in contact form");
          return
        }
        if( !stateContactDetails[0].cityId){
          toastr.error("City is required in contact form");
          return
        }
        if( !stateContactDetails[0].contactNumber){
          toastr.error("Contact Number is required in contact form");
          return
        }
        if(!stateContactDetails[0].pincode){
          toastr.error("Pincode is required in contact form");
          return
        }


        const contactDetails = (stateContactDetails && stateContactDetails.length) ? [stateContactDetails[0]] : [];

        response = await updateSubChapterActionHandler(this.props.clusterId, this.props.chapterId, {
          subChapterId,
          // objective,
          contactDetails,
        });

        let {contactDetailsFormData,subChapter} =  this.state;
        let obj_res = JSON.parse(response.result);
        if(obj_res && obj_res.contactDetails && obj_res.contactDetails.length){
          contactDetailsFormData.formData = obj_res.contactDetails[0];

          if(!subChapter || !subChapter.contactDetails) subChapter = {contactDetails:[]};
          subChapter.contactDetails[0] =  obj_res.contactDetails[0];
          this.setState({contactDetailsFormData,subChapter});
        }


        // const resp = await findSubChapterActionHandler(clusterId, chapterId, subChapterId);
        // this.setState({
        //   subChapter: resp,
        //   contactDetailsFormData: {
        //     selectedIndex: -1,
        //     formData:
        //     //  {
        //     //   name:'',
        //     //   addressTypeName: '',
        //     //   contactNumber: '',
        //     //   buildingNumber: '',
        //     //   street: '',
        //     //   landmark: '',
        //     //   area: '',
        //     //   cityId: '',
        //     //   stateId: '',
        //     //   countryId: '',
        //     //   pincode: '',
        //     //   latitude: '',
        //     //   longitude: '',
        //     //   // emailId: '',
        //     //   // contactPersonRole: '',
        //     //   // addressTypeId: '',
        //     //   // status: false,
        //     // },
        //   },
        // });
        return response;
      case 'objective':
        let objective = this.state.objective || [];

        objective = objective.filter((ob) => {
          if (ob.description) {
            return ob;
          }
        });

        response = await updateSubChapterActionHandler(this.props.clusterId, this.props.chapterId, {
          subChapterId,
          objective,
          // contactDetails,
        });

        return response;
      case 'users':
        const { profile } = this.state.contact;
        // profile.dateOfBirth = profile.dateOfBirth ? new Date(profile.dateOfBirth) : null;
        profile.dateOfBirth = profile.dateOfBirth ? moment(profile.dateOfBirth).format(Meteor.settings.public.dateFormat) : null;
        const updateUserObject = {
          userId: this.state.contact._id,
          userObject: { profile, username: profile.email },
        }

        var updateDetails = this.props;
        response = await updateBackendUserActionHandler(updateUserObject, updateDetails)
        this.setState({isUserUpdated: true});
        return response
        break
      default:
        console.log('save type required')
    }
  }

  getUserDetails(details) {
    //get tab details

    if (details.socialLinksInfo && details.socialLinksInfo[0]) {
      details.profile.InternalUprofile.moolyaProfile.socialLinksInfo = details.socialLinksInfo;
      // details.socialLinksInfo = undefined;
    }
    this.setState({ contact: details,  isUserUpdated: false })
  }
  getObjectiveDetails(details) {
    //get tab details
    this.setState({
      objective: details,
    });
  }

  getContactDetails(details) {
    this.setState({
      contactDetailsFormData: details,
    });
  }

  onContactChange(field, value) {
    var state = JSON.parse(JSON.stringify(this.state));
    state.contactDetailsFormData.formData[field] = value;
    this.setState(state);
  }

  setModule(module){
    this.setState({module});
  }

  render() {
    const MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async (event) => {
        this.props.handler(this.updateAnchorDetails.bind(this), this.handleSuccess.bind(this))
        window.history.back()
        }
      }, {
        showAction: true,
        actionName: 'cancel',
        handler: async (event) => {
          window.history.back()
        }
      }
    ]
    const steps =
      [
        {
          name: 'Anchors',
          component: <MlAnchorList data={this.props} getUserDetails={this.getUserDetails} isUserUpdated={this.state.isUserUpdated} setModule={this.setModule}/>,
          icon: <span className="ml ml-basic-Information"></span>
        },
        {
          name: 'SC Objectives',
          component: <MlAnchorObjective {...this.props} getObjectiveDetails={this.getObjectiveDetails} setModule={this.setModule}/>,
          icon: <span className="ml ml-additional-Information"></span>
        },
        {
          name: 'SC Contact',
          component: <MlAnchorContact
            contactDetails={this.state.subChapter.contactDetails}
            // selectedIndex={this.state.contactDetailsFormData.selectedIndex}
            formData={this.state.contactDetailsFormData.formData}
            onContactChange={this.onContactChange}
            {...this.props}
            getContactDetails={this.getContactDetails} setModule={this.setModule} />,
          icon: <span className="ml flaticon-ml-agenda"></span>
        }
      ]
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <div className='step-progress'>
            <div id="root">
              <StepZilla steps={steps} showNavigation={false} prevBtnOnLastStep={true} preventEnterSubmission={true} />
            </div>
          </div>
        </div>
        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName" />
      </div>
    )
  }
}
;
export default MlAnchorTabsContainer = formHandler()(MlAnchorTabsContainer);
