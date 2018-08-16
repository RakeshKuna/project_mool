import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

export default class CalenderHead extends React.Component{
  componentDidMount()
  {
    $('.users_list li').click(function(){
      if($(this).next('li').hasClass('sub_list_wrap')) {
        $(this).toggleClass('active_user')
        $(this).next('.sub_list_wrap').toggleClass('hidden_list');
      }
    });
  }
  render(){
    return (
      <div className="col-lg-12">
        <ul className="users_list well well-sm">
          <li>
            <a href="">
              <img src="/images/p_5.jpg" /><br />
              <div className="tooltiprefer">
                <span>All</span>
              </div>
            </a>
          </li>
          <li>
            <a href="">
              <span className="icon_bg"> <span className="icon_lg ml my-ml-Investors"></span></span><br />
              <div className="tooltiprefer">
                <span>Funder</span>
              </div>
            </a>
          </li>
          <li className="sub_list_wrap hidden_list">{/**/}
            <ul className="sub_list">
              <li>
                <a href="">
                  <span className="icon_bg"><span className="icon_lg fa fa-building-o"></span></span><br />
                  <div className="tooltiprefer">
                    <span>Hyderabad</span>
                  </div>
                </a>
              </li>
              <li className="sub_list_wrap hidden_list">{/**/}
                <ul className="sub_list">
                  <li>
                    <a href="">
                      <span className="icon_bg"><span className="icon_lg ml flaticon-ml-active-user"></span></span><br />
                      <div className="tooltiprefer">
                        <span>Naveen</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <span className="icon_bg"><span className="icon_lg ml flaticon-ml-active-user"></span></span><br />
                      <div className="tooltiprefer">
                        <span>Vishwadeep</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <span className="icon_bg"><span className="icon_lg ml flaticon-ml-active-user"></span></span><br />
                      <div className="tooltiprefer">
                        <span>Balakrishna</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="">
                  <span className="icon_bg"><span className="icon_lg fa fa-building-o"></span></span><br />
                  <div className="tooltiprefer">
                    <span>Bangalore</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="icon_bg"><span className="icon_lg fa fa-building-o"></span></span><br />
                  <div className="tooltiprefer">
                    <span>Mumbai</span>
                  </div>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="">
              <span className="icon_bg"><span className="icon_lg ml my-ml-Ideator"></span></span><br />
              <div className="tooltiprefer">
                <span>Ideator</span>
              </div>
            </a>
          </li>
          <li className="pull-right circle-time">
            <a href="">
              <span className="icon_bg">GMT<br />+03:00</span><br />
              <div className="tooltiprefer">
                <span>14/06/2017</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    )
  }
};
