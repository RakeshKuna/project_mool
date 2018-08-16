import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
import MlRoleAssignComponent from './MlRoleAssignComponent'
export default class MlAsignInternalUsers extends React.Component{
  constructor(props){
    super(props);
    this.state={
      mlroleDetails:[]
    }
    return this;
  }
  componentDidMount()
  {
    $(function() {
      $('.float-label').jvFloat();
    });
    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        //$(this).parent('.switch').addClass('on');
        $(this).parent('.switch').val('true');
      }else{
        //$(this).parent('.switch').removeClass('on');
        $(this).parent('.switch').val('false');
      }
    });

    var mySwiper = new Swiper('.blocks_in_form', {
      // speed: 400,
      pagination: '.swiper-pagination',
      spaceBetween: 0,
      slidesPerView:2,
      freeMode:true,
      paginationClickable: false
    });
  }
  getAssignedRoles(roles){
    console.log(roles)
    this.setState({'mlroleDetails':roles})
  }
  onSubmit(){
    console.log(this.state.mlroleDetails)
  }
  render(){
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Assign internal user to Community</h2>



          <div className="col-md-6">
            <div className="row">
              {/*<h3>Users List</h3>*/}
              <div className="left_wrap left_user_blocks">

                <ScrollArea
                  speed={0.8}
                  className="left_wrap"
                >
                  <div className="col-md-4 col-sm-4">
                    <div className="list_block provider_block">
                      <div className="cluster_status active_cl" />
                      <div className="provider_mask"> <img src="/images/funder_bg.png" /> <img className="user_pic" src="/images/def_profile.png" /> </div>
                      <h3>User Name1<br />
                        USA</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="list_block provider_block">
                      <div className="cluster_status active_cl" />
                      <div className="provider_mask"> <img src="/images/funder_bg.png" /> <img className="user_pic" src="/images/def_profile.png" /> </div>
                      <h3>User Name2<br />
                        USA</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="list_block provider_block">
                      <div className="cluster_status active_cl" />
                      <div className="provider_mask"> <img src="/images/funder_bg.png" /> <img className="user_pic" src="/images/def_profile.png" /> </div>
                      <h3>User Name3<br />
                        USA</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="list_block provider_block">
                      <div className="cluster_status active_cl" />
                      <div className="provider_mask"> <img src="/images/funder_bg.png" /> <img className="user_pic" src="/images/def_profile.png" /> </div>
                      <h3>User Name4<br />
                        USA</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="list_block provider_block">
                      <div className="cluster_status active_cl" />
                      <div className="provider_mask"> <img src="/images/funder_bg.png" /> <img className="user_pic" src="/images/def_profile.png" /> </div>
                      <h3>User Name5<br />
                        USA</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="list_block provider_block">
                      <div className="cluster_status active_cl" />
                      <div className="provider_mask"> <img src="/images/funder_bg.png" /> <img className="user_pic" src="/images/def_profile.png" /> </div>
                      <h3>user Name6<br />
                        USA</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div className="list_block provider_block">
                      <div className="cluster_status active_cl" />
                      <div className="provider_mask"> <img src="/images/funder_bg.png" /> <img className="user_pic" src="/images/def_profile.png" /> </div>
                      <h3>User Name7<br />
                        USA</h3>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <div className="col-md-6">

            {/*<h3>User Details</h3>*/}
            <div className="left_wrap">
              <ScrollArea
                speed={0.8}
                className="left_wrap"
              >
                <form>
                  <br/>
                  <div className="form-group">
                    <input type="text" placeholder="Name" className="form-control float-label" id="fname" defaultValue="Lorem Ipsum"/>

                  </div>

                  <div className="form-group">
                    <input type="text" id="" placeholder="Status" className="form-control float-label" />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Display Name" className="form-control float-label" id="dName" />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="User Name" className="form-control float-label" id="uName" />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Department" className="form-control float-label" id="Dept" />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Sub Department" className="form-control float-label" id="sDept" />
                  </div>

                  <MlRoleAssignComponent getAssignedRoles={this.getAssignedRoles.bind(this)}/>


                  <br/>
                  <br className="brclear"/>
                  <div className="form-group switch_wrap inline_switch">
                    <label className="">De-Activate User</label>
                    <label className="switch">
                      <input type="checkbox" />
                      <div className="slider"></div>
                    </label>
                  </div>
                </form>
              </ScrollArea>
            </div>
          </div>
          <button onClick={this.onSubmit.bind(this)}>submit</button>

        </div>
      </div>





    )
  }
};
