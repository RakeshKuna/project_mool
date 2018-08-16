/**
 * Created by pankaj on 19/6/17.
 */

import React from "react";
import {createStageActionHandler} from '../actions/createStage';
import {updateStageActionHandler} from '../actions/updateStage';
import MlAssignTask from './MlAssignTask';
import MlCreateDiscussInternalTask from './MlCreateDiscussInternalTask';
import PopoverActionIcon from '../../appActions/components/PopoverActionIcon';

module.exports = {
  assess: {
    config:{
      showAction: true,
      actionName: "assess",
      hasPopOver:true,
      popOverTitle:'Assess',
      placement:'top',
      target:'assessTask',
      popOverComponent: <MlAssignTask />,
      actionComponent: PopoverActionIcon
    },
    handler: async (ref,zz,handlerCallback) => {
      console.log('Here',zz, this, ref);
    }
  },
  // invest: {
  //   config:{
  //     showAction: true,
  //     actionName: "invest",
  //     hasPopOver:true,
  //     popOverTitle:'Invest',
  //     placement:'top',
  //     target:'investTask',
  //     popOverComponent: <MlAssignTask />,
  //     actionComponent: PopoverActionIcon
  //   },
  //   handler: async (ref,zz,handlerCallback) => {
  //     console.log('Here',zz, this, ref);
  //   }
  // },
  "term sheet": {
    config:{
      showAction: true,
      actionName: "term sheet",
      hasPopOver:true,
      popOverTitle:'Term Sheet',
      placement:'top',
      target:'termsheetTask',
      popOverComponent: <MlAssignTask />,
      actionComponent: PopoverActionIcon
    },
    handler: async (ref,zz,handlerCallback) => {
      console.log('Here',zz, this, ref);
    }
  },
  handover: {
    config:{
      showAction: true,
      actionName: "handover",
      hasPopOver:true,
      popOverTitle:'Handover',
      placement:'top',
      target:'handoverTask',
      popOverComponent: <MlAssignTask />,
      actionComponent: PopoverActionIcon
    },
    handler: async (ref,zz,handlerCallback) => {
      console.log('Here',zz, this, ref);
    }
  },
  "report card": {
    config:{
      showAction: true,
      actionName: "report card",
      hasPopOver:true,
      popOverTitle:'Report Card',
      placement:'top',
      target:'reportCardTask',
      popOverComponent: <MlAssignTask />,
      actionComponent: PopoverActionIcon
    },
    handler: async (ref,zz,handlerCallback) => {
      console.log('Here',zz, this, ref);
    }
  },
  valuation: {
    config:{
      showAction: true,
      actionName: "valuation",
      hasPopOver:true,
      popOverTitle:'valuation',
      placement:'top',
      target:'valuationTask',
      popOverComponent: <MlAssignTask />,
      actionComponent: PopoverActionIcon
    },
    handler: async (ref,zz,handlerCallback) => {
      console.log('Here',zz, this, ref);
    }
  },
  discuss: {
    config:{
      showAction: true,
      actionName: "discuss",
      hasPopOver:true,
      popOverTitle:'Discuss',
      placement:'top',
      target:'discussTask',
      popOverComponent: <MlCreateDiscussInternalTask />,
      actionComponent: PopoverActionIcon
    },
    handler: async (ref,zz,handlerCallback) => {
      console.log('Here',zz, this, ref);
    }
  },
  like: {
    config:{
      showAction: true,
      actionName: "like",
      customHandler: async (ref) => {
        const currentStage = ref.props.currentStage;
        changeStage(ref, currentStage, "likes");
      }
    },
  },
  comment: {
    config: {
      showAction: true,
      actionName: "comment",
      customHandler: async (ref) => {
        console.log(ref);
        const currentStage = ref.props.currentStage;
        changeStage(ref, currentStage, "comment");
      }
    }
  },
  wishlist: {
    config:{
      showAction: true,
      actionName: "wishlist",
      customHandler: async (ref) => {
        const currentStage = ref.props.currentStage;
        changeStage(ref, currentStage, "wishlist");
      }
    },
  },
  shortlist: {
    config: {
      showAction: true,
      actionName: "shortlist",
      customHandler: async (ref) => {
        const currentStage = ref.props.currentStage;
        changeStage(ref, currentStage, "shortlist");
      }
    }
  },
  onboard: {
    config: {
      showAction: true,
      actionName: "onboard",
      customHandler: async (ref) => {
        const currentStage = ref.props.currentStage;
        changeStage(ref, currentStage, "onboard");
      }
    }
  },
  invest: {
    config: {
      showAction: true,
      actionName: "invest",
      customHandler: async (ref) => {
        const currentStage = ref.props.currentStage;
        investmentHandler(ref, currentStage, "onboard");
      }
    }
  }
}

investmentHandler = async (that, currentStage, currentStageName) => {
  let dataToInsert = {
    "hasInvested": true
  };
  let response;
  if(that.state.selected.stage.length){
    response = await updateStageActionHandler(that.state.selected.stage[0]._id, dataToInsert);
  } else {
    dataToInsert.resourceId = that.state.selected.resourceId;
    dataToInsert.resourceType= "portfolio";
    dataToInsert.resourceStage= currentStage.stageName;
    response = await createStageActionHandler(dataToInsert);
  }
  //await updateStageActionHandler(that.state.selected.stage[0]._id, dataToInsert);
  if(response) {
    toastr.success('Startup added to your investment portfolio');
    that.props.fetchPortfolio();
  }
};


async function changeStage(that, currentStage, currentStageName){
  console.log('--that--', that , '--currentStage--', currentStage, '--currentStageName--')
  if(!that.state.selected.resourceId){
    toastr.error('Please select a Startup');
    return false;
  }
  if(currentStage.stageName == currentStageName){
    toastr.error('Already in '+currentStageName+' Stage');
    return false;
  }
  let dataToInsert = {
    "resourceId": that.state.selected.resourceId,
    "resourceType": "portfolio",
    "resourceStage": currentStageName
  };
  let response;
  if(that.state.selected.stage.length){
    response = await updateStageActionHandler(that.state.selected.stage[0]._id, dataToInsert);
  } else {
    response = await createStageActionHandler(dataToInsert);
  }
  if(response.success){
    if(response.result === "Onboard request to sent to user"){
      toastr.success(response.result );
    } else{
      toastr.success(`Portfolio moved to ${currentStageName}  stage`);
    }
    that.props.fetchPortfolio();
  } else {
    toastr.error(response.result)
  }
}
