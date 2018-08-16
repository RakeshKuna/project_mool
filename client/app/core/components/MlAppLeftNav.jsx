import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar'
import $ from 'jquery'
import _ from 'lodash'
require('malihu-custom-scrollbar-plugin')($);

export default class MlAppLeftNav extends Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        var WinWidth = $(window).width();
        var WinHeight = $(window).height();
        $('.app_menu, .app_main_wrap ').height(WinHeight-$('.app_header').outerHeight(true));
        $('.main_wrap_scroll ').height(WinHeight-(68+$('.app_header').outerHeight(true)));
        $('.actions_switch').click(function(){
            $('.bottom_actions_block').toggleClass('show_block');
            $(this).toggleClass('show_act');
        });
        $('.left_wrap').height(WinHeight-(90+$('.app_header').outerHeight(true)));

        $('.mobile_menu_trigger').click(function(){
            $('.moolya_app').toggleClass('slid');
            $('.app_menu').toggleClass('show_menu');
            $('.overlay').fadeToggle( );
            $(this).toggleClass('open');
        });

        if(WinWidth > 768){
            $(".app_menu").mCustomScrollbar({theme:"minimal-dark"});
        }
        // let routeName = FlowRouter.getRouteName();
        // $(".mCustomScrollbar").mCustomScrollbar("scrollTo","#"+routeName );
      let mname='';
      let data = this.context.menu||{};
      let menu = data.menu || [];
      if(menu && menu.length){
        mname = menu[0].name;
      }

      $(document).ready(()=>{
        $('.menu_item a').click(function(event) {
          // Do the async thing
          let margin = $(".app_menu .mCSB_container").css("top");
          let obj={};
          obj.top =margin;
          obj.name=mname;
          let obj2 = JSON.stringify(obj);
          localStorage.setItem('top',obj2);
        });
      });

      let topscroll = localStorage.getItem('top');
      try {
        topscroll = JSON.parse(topscroll);
      }catch(e){
        topscroll='';
      }

      if(topscroll && topscroll.top && topscroll.name === mname) {
        setTimeout(function () {
          $(".app_menu .mCSB_container").css({"top": topscroll.top});
          // $(".admin_menu .scrollarea-content").refresh();
          // $("#mCSB_1_container").animate({ scrollTop: -margin });

        }, 500);
      }else{
        localStorage.setItem('top','');
      }
    }

    render(){
        function find(uniqueId, menus) {
            var i = 0, found;
            for (; i < menus.length; i++) {
                if (menus[i].uniqueId === uniqueId) {
                    var res = menus[i].uniqueId
                    return res;
                } else if (_.isArray(menus[i].subMenu)) {
                    found = find(uniqueId, menus[i].subMenu)
                    if (found) {
                        return menus[i].uniqueId
                    }
                }
            }
        }
        let path = FlowRouter.current().route.name;
        let data = this.context.menu||{};
        let menu = data.menu || [];
        let parentKey = find(path, menu)
        let navOptions = menu.map(function (dataItem, idx) {
            let activeClass
            if (parentKey == dataItem.uniqueId) {
                activeClass = 'active_menu'
            }else if(dataItem.isDisabled){                               /**for making the menu greyOut req from marketing*/
              activeClass = 'inactive_menu'
            }
            return (
                <li className={`menu_item ${activeClass}`} key={idx} data-toggle={dataItem && dataItem.isDisabled?"tooltip":""} title={dataItem && dataItem.isDisabled?"coming soon..":""} data-placement="right">
                    <a href={dataItem.isDisabled ? '' : dataItem.link } id={dataItem.uniqueId}>
                        <div className={"menu_in"}>
                            <span className={dataItem.image}></span>
                            <br/>
                            <b className="menu_title">{dataItem.name}</b>
                        </div>
                    </a>
                </li>
            )
        });

        return(
            <div className="app_menu mCustomScrollbar _mCS_11 mCS-autoHide">
                <ul>
                    {navOptions }
                    <li className="menu_item"></li>
                </ul>
            </div>
        )
    }
}

MlAppLeftNav.contextTypes = {
    menu: React.PropTypes.object
};
