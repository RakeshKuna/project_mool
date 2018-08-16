import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {upsertNumericalFormatActionHandler} from '../actions/upsertNumericalFormatAction'
import {findNumericalFormatActionHandler} from '../actions/findNumericalFormatAction'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import formHandler from '../../../../commons/containers/MlFormHandler';
// import ScrollArea from 'react-scrollbar';
import { Scrollbars } from 'react-custom-scrollbars';
import gql from 'graphql-tag'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import {OnToggleSwitch} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'
let Select = require('react-select');


class MlNumericalFormat extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      data:{},
    };
    this.upsertNumaericalFormate.bind(this);
    this.findLang.bind(this);
    return this;
  }
  componentDidMount() {
    if(this.state.data.isAcive){
      $('#status').prop('checked', true);
    }
  }
  componentWillMount() {
    const resp=this.findLang();
    return resp;

  }

  componentDidUpdate(){
    OnToggleSwitch(true,true);
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));

  }

  /*async addEventHandler() {
    const resp=await this.upsertNumaericalFormate();
    return resp;
  }*/

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {

    FlowRouter.go("/admin/settings/numericalFormatList");
  };
  async findLang(){
   // let Id=this.props.config;
    const response = await findNumericalFormatActionHandler();

    if(response.length>0) {
      this.setState({loading:false,data:response[0].numericalInfo});
      if (this.state.data.numberOfDigitsAfterDecimal) {
        this.setState({numberOfDigitsAfterDecimal: this.state.data.numberOfDigitsAfterDecimal});
      }
      if (this.state.data.measurementSystem) {
        this.setState({measurementSystem: this.state.data.measurementSystem});
      }
      if (this.state.data.currencyFormat) {
        this.setState({currencyFormat: this.state.data.currencyFormat});
      }
      if (this.state.data.currencySymbol) {
        this.setState({currencySymbol: this.state.data.currencySymbol});
      }
      if (this.state.data.valueSeparator) {
        this.setState({valueSeparator: this.state.data.valueSeparator});
      }
    }else{
      this.setState({loading:false});
    }

  }

  async  upsertNumaericalFormate() {
    let Details = {
      numberOfDigitsAfterDecimal: this.state.numberOfDigitsAfterDecimal,
      measurementSystem: this.state.measurementSystem,
      currencyFormat: this.state.currencyFormat,
      currencySymbol: this.state.currencySymbol,
      valueSeparator: this.state.valueSeparator,
    }
    const response = await upsertNumericalFormatActionHandler(Details);
    toastr.success("Saved successfully")
    return response;

  }
  optionsBySelectNumberOfDigitsAfterDecimal(data){
    this.setState({numberOfDigitsAfterDecimal:data.value})
  }
  optionsBySelectMeasurementSystem(data){
    this.setState({measurementSystem:data.value})
  }
  optionsBySelectValueSeparator(data){
    this.setState({valueSeparator:data.value})
  }
  optionsBySelectCurrencySymbol(val){
    this.setState({currencySymbol:val})
  }

  onStatusChange(e){
    const data=this.state.data;
    if(e.currentTarget.checked){
      this.setState({"currencyFormat":true});
    }else{
      this.setState({"currencyFormat":false});
    }
  }


  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.upsertNumaericalFormate.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/settings/numericalFormatList")
        }
      }
    ]
    let clusterquery=gql` query{  
      data:fetchCurrency{
        value:_id
        label:currencyName
      }  
    }`;


    let decimalsLimit = [
      {value: '0', label: '0'},
      {value: '1', label: '1'},
      {value: '2', label: '2'},
      {value: '3', label: '3'}
    ]

    let measurementType = [
      {value: 'US System', label: 'US System'},
      {value: 'Metric System', label: 'Metric System'},
    ]
    let valueSeperators = [
      {value: ',', label: ','},
      {value: '.', label: '.'},
      {value: '/', label: '/'},
      {value: '_', label: '_'},
      {value: ';', label: ';'},
      {value: ':', label: ':'},
      {value: '-', label: '-'},
    ]
    let numberOfDigitsAfterDecimalActive='',measurementSystemActive='',valueSeparatorActive=''
    if(this.state.numberOfDigitsAfterDecimal){
      numberOfDigitsAfterDecimalActive='active'
    }
    if(this.state.measurementSystem){
      measurementSystemActive='active'
    }
    if(this.state.valueSeparator){
      valueSeparatorActive='active'
    }

    const showLoader=this.state.loading;
    return (
      <div>
        {showLoader===true?(<MlLoader/>):(
          <div className="admin_main_wrap">
            <div className="admin_padding_wrap">
              <h2>Numerical Format</h2>
              <div className="col-md-6 nopadding-left">
               {/* <input type="text" ref="id" defaultValue={this.state.data._id} hidden="true"/>*/}
                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <span className={`placeHolder ${numberOfDigitsAfterDecimalActive}`}>Number Of Digits After Decimal </span>
                      {/*<Moolyaselect multiSelect={false}  placeholder={"Number Of Digits After Decimal"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.numberOfDigitsAfterDecimal} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'clusterquery'}  onSelect={this.optionsBySelectNumberOfDigitsAfterDecimal.bind(this)} />*/}
                      <Select
                        name="form-field-name"  options={decimalsLimit} placeholder={"Number Of Digits After Decimal"}
                        value={this.state.numberOfDigitsAfterDecimal} onChange={this.optionsBySelectNumberOfDigitsAfterDecimal.bind(this)}
                        className="float-label"/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false}  placeholder={"Currency Symbol"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.currencySymbol} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'query'}  onSelect={this.optionsBySelectCurrencySymbol.bind(this)} />
                    </div>

                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg left_wrap">
                  <Scrollbars
                    speed={0.8}
                    className="left_wrap"
                    smoothScrolling={true}
                    default={true}
                  >
                    <form>
                      <div className="form-group">
                        <span className={`placeHolder ${measurementSystemActive}`}>Measurement System </span>
                        <Select
                          name="form-field-name"  options={measurementType} placeholder={"Measurement System"}
                          value={this.state.measurementSystem} onChange={this.optionsBySelectMeasurementSystem.bind(this)}
                          className="float-label"/>
                        {/*<Moolyaselect multiSelect={false}  placeholder={"Measurement System"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.measurementSystem} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'query'}  onSelect={this.optionsBySelectMeasurementSystem.bind(this)} />*/}
                      </div>
                      <div className="form-group">
                        <span className={`placeHolder ${valueSeparatorActive}`}>Value Separator</span>
                        <Select
                          name="form-field-name"  options={valueSeperators} placeholder={"Value Separator"}
                          value={this.state.valueSeparator} onChange={this.optionsBySelectValueSeparator.bind(this)}
                          className="float-label"/>
                        {/*<Moolyaselect multiSelect={false}  placeholder={"Value Separator"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.valueSeparator} queryType={"graphql"} query={clusterquery}  isDynamic={true} id={'query'}  onSelect={this.optionsBySelectValueSeparator.bind(this)} />*/}
                      </div>
                      <div className="form-group switch_wrap inline_switch">
                        <label>Currency Format</label>
                        <label className="switch">
                          <input type="checkbox" ref="status"  checked={this.state.currencyFormat} onChange={this.onStatusChange.bind(this)}/>
                          <div className="slider"></div>
                        </label>
                      </div>

                      <br className="brclear"/>
                    </form>
                  </Scrollbars>
                </div>
              </div>
              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
            </div>
          </div>)}
      </div>
    )
  }
};

export default MlNumericalFormat = formHandler()(MlNumericalFormat);
