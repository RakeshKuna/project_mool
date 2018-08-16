/**
 * Created by mohammed.mohasin on 12/6/17.
 */
import React from "react";
import MlAppActionComponent from '../components/MlAppActionComponent';
import PopoverActionIcon from '../../appActions/components/PopoverActionIcon';
import Connect from '../../appActions/components/Connect';
import Inquiry from '../../appActions/components/Inquiry';
import Review from '../../appActions/components/Review';
import handleLikeAction from '../../../app/appActions/actions/likeActionHandler';
import handleFollowAction from '../../../app/appActions/actions/followActionHandler';
import handleFavouriteAction from '../../../app/appActions/actions/favouriteActionHandler';

export const GenericPortfolioActionsConfig= [
  {actionName: 'like',actionType:'view',handleCallBack:handleLikeAction},
  {actionName: 'connect',actionType:'view',hasPopOver:true,popOverTitle:'Connect Request',placement:'top',target:'connectRequest',popOverComponent:<Connect />,actionComponent:PopoverActionIcon},
  {actionName: 'collaborate',actionType:'view',isDisabled:true},
  {actionName: 'favourite',actionType:'view',handleCallBack:handleFavouriteAction},
  {actionName: 'partner',actionType:'view',isDisabled:true},
  {actionName: 'comment',actionType:'view',target:"comment"},
  {actionName: 'enquire',actionType:'view',hasPopOver:true,popOverTitle:'Enquire',placement:'top',target:'enquireRequest',popOverComponent:<Inquiry />,actionComponent:PopoverActionIcon},
  {actionName: 'follow',actionType:'view',handleCallBack:handleFollowAction},
  {actionName: 'review',actionType:'view',isDisabled:true,hasPopOver:true,popOverTitle:'Review',placement:'top',target:'reviewRequest',popOverComponent:<Review />,actionComponent:PopoverActionIcon},
  {actionName: 'save',actionType:'edit'},
  // {actionName: 'edit',actionType:'edit'},
  {actionName: 'golive',actionType:'edit'}
];
/**removing edit not required in edit mode only save can be used*/

export const GenericPortfolioAccordion= {id:'portfolioAccordion',
  panelItems:[//{'title':'Related',isText:true,contentComponent:'upcoming',style:{'background': '#273545'}},
              {'title':'Actions',isText:false,contentComponent:<MlAppActionComponent  />}]
    };

export const IdeatorPortfolioAccordion= {id:'ideatorPortfolioAccordion',
  panelItems:[{'title':'Related',isText:true,contentComponent:'upcoming'},
    {'title':'Actions',isText:false,contentComponent:<MlAppActionComponent  />}]
};
