import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import Moolyaselect from  '../../commons/components/MlAdminSelectWrapper'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
export default class MlRoleAssignComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      selectedValue:null,
      roleForm:[{userRole: null,validFrom:'',validTo:'',status:false }],
    }
    this.addRoleComponent.bind(this);
    return this;
  }
  componentDidMount() {
    $(function () {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
       $(this).parent('.switch').removeClass('on');
      }
    });
  }
  optionsBySelect(index, selectedIndex){
    let roleDetails=this.state.roleForm
    roleDetails[index]['userRole']=selectedIndex
    this.setState({roleForm:roleDetails})
    this.props.getAssignedRoles(this.state.roleForm)
  }
  addRoleComponent(event) {

    var mySwiper = new Swiper('.blocks_in_form', {
      // speed: 400,
      pagination: '.swiper-pagination',
      spaceBetween: 0,
      slidesPerView:'auto',
      freeMode:true,
      paginationClickable: false
    });
    mySwiper.updateContainerSize()
    this.setState({
      roleForm: this.state.roleForm.concat([{ userRole: null,validFrom:'',validTo:'',status:false }])
    });

  }
  onChange(id,event){
    let filedName=event.target.name
    let fieldValue=event.target.value;
      if(filedName=='status'){
        fieldValue=event.target.checked;
      }
    let roleDetails=this.state.roleForm

    roleDetails[id][filedName]=fieldValue
    this.setState({roleForm:roleDetails})
    this.props.getAssignedRoles(this.state.roleForm)
  }
  onClickDate(id,event){
    let filedName=event.target.name
    let fieldId=filedName+id
    $("#"+fieldId).datepicker({ format: this.state.dateformate });
    $("#"+fieldId).focus();
  }

  render() {
   let that=this;
   // let queryOptions={options: { variables: { name:'mlAdminRole',searchQuery:null}}};
   // let query=gql`query RoleQuery($name: String!,$searchQuery:String) {data:FetchRoles(name: $name,searchQuery:$searchQuery){label:roleName,value:roleValue}}`;
    let queryOptions={options: { variables: {searchQuery:null}}};
    let query=gql` query CountryQuery($searchQuery:String)
{data:FetchCountries(input:$searchQuery)
  {label:country,value:countryCode}
}
`;
    return (

      <div className="swiper-container blocks_in_form">
      <div className="swiper-wrapper">

        {that.state.roleForm.map(function(options,id){
          return(
            <div className="form_inner_block swiper-slide"  key={id}>

              <div className="add_form_block">< img src="../images/add.png" onClick={that.addRoleComponent.bind(that,id)}/></div>
              <div className="form-group">

              {/*  <select className="form-control float-label" placeholder="Role" id={'userRole'+id} onChange={that.onChange.bind(that)}><option>Select User Role</option><option>test</option></select>*/}
                <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={options.userRole} queryType={"graphql"} query={query} queryOptions={queryOptions} isDynamic={true} id={'userRole'+id} onSelect={that.optionsBySelect.bind(that,id)} />

              </div>

              <div className="form-group left_al">
                <input type="text" placeholder="Valid from" id={'validFrom'+id} onClick={that.onClickDate.bind(that,id)} className="form-control float-label" name={'validFrom'} onBlur={that.onChange.bind(that,id)} value={options.validFrom} />
              </div>

              <div className="form-group left_al">
                <input type="text" placeholder="Valid to" id={'validTo'+id} onClick={that.onClickDate.bind(that,id)} className="form-control float-label" name={'validTo'} onBlur={that.onChange.bind(that,id)} value={options.validTo} />
              </div>
              <div className="form-group switch_wrap">
                <label>Status</label>
                <label className="switch">
                  <input type="checkbox" name={'status'} value={options.status} onChange={that.onChange.bind(that,id)}/>
                  <div className="slider"></div>
                </label>
              </div>
              <br className="brclear"/>
            </div>
          )})}
      </div>
      <br className="brclear"/>
      <div className="swiper-pagination"></div>
    </div>




    )
  }
};

