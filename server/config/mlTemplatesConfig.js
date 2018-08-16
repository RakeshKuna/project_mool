/**
 * Created by mohasin.m on 02/04/17.
 */

let process = MlprocessTypes.findOne({processName:"Registration"})
if(!process) {
  process = {
    processName   : "Registration",
    displayName   : "Registration",
    processDesc   : "Registration Details",
    isActive      : true
  }
  MlprocessTypes.insert(process);
}
let subProces = MlSubProcess.findOne({subProcessName:"Registration"})
if(!subProces) {
  let process = MlprocessTypes.findOne({processName:"Registration"})
  let stepDetails = [{stepId: "1", stepCode: "SOFT", stepName: "Soft",isActive:true},{stepId: "2", stepCode: "HARD", stepName: "Hard",isActive:true},{stepId: "3", stepCode: "PORTFOLIO", stepName: "Portfolio",isActive:true}]
  subProces = {
    processName           : "Registration",
    procesId              : process._id,
    subProcessName        : "Registration",
    subProcessDescription : "Registration Details",
    isActive              : true,
    steps                 : stepDetails,
    createdBy             : "System",
    createdDate           : new Date()
  };
  MlSubProcess.insert(subProces);
}

let proc = MlprocessTypes.findOne({processName:"Registration"});
let subProc = MlSubProcess.findOne({processName:"Registration"});
let template = MlTemplates.findOne({processName:"Registration","subProcessName":"Registration"});

let templates = [
  {stepName:"Soft",stepCode:"SOFT",templateCode:"SRTALL",templateName:"Soft-Reg-All",templateDescription:"Soft Registration Template For All Communities",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},

  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTIDECMP",templateName:"Hard-Reg-Ideator-Company",templateDescription:"Hard Registration Template for Ideator Company",isActive: true,createdDate: new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTIDEINV",templateName:"Hard-Reg-Ideator-Individual",templateDescription:"Hard Registration Template for Ideator Company",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTFUNCMP",templateName:"Hard-Reg-Investor-Company",templateDescription:"Hard Registration Template for Investor Company",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-public-images/Templates/Additional-Info_Funder_Company.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTFUNINV",templateName:"Hard-Reg-Investor-Individual",templateDescription:"Hard Registration Template for Investor Individual",isActive: true,createdDate: new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-public-images/Templates/Additional-Info_Funder_Individual.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTSPSCMP",templateName:"Hard-Reg-ServiceProvider-Company",templateDescription:"Hard Registration Template for ServiceProvider Company",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-public-images/Templates/Additional-Info_ServiceProvider_Company.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTSPSINV",templateName:"Hard-Reg-ServiceProvider-Individual",templateDescription:"Hard Registration Template for ServiceProvider Individual",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-public-images/Templates/Additional-Info_ServiceProvider_Individual.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTCMP",templateName:"Hard-Reg-Company",templateDescription:"Hard Registration Template for Company",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-public-images/Templates/Additional-Info_Companies_Company.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTSTU",templateName:"Hard-Reg-Startup-Company",templateDescription:"Hard Registration Template for Startup Company",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-public-images/Templates/Additional-Info_Startup_Company.png"},
  {stepName:"Hard",stepCode:"HARD",templateCode:"HRTINS",templateName:"Hard-Reg-Institution",templateDescription:"Hard Registration Template for Institution",isActive: true,createdDate: "03-04-2017",templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-public-images/Templates/Additional-Info_Institution_Company.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTIDEEDT",templateName:"Portfolio-Template-Ideator-Edit",templateDescription:"Portfolio Template for Ideator Edit",isActive: true,createdDate: new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTIDEVIW",templateName:"Portfolio-Template-Ideator-View",templateDescription:"Portfolio Template for Ideator View",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTSTUEDT",templateName:"Portfolio-Template-Startup-Edit",templateDescription:"Portfolio Template for Startup Edit",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTSTUVIW",templateName:"Portfolio-Template-Startup-View",templateDescription:"Portfolio Template for Startup View",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTFUNEDT",templateName:"Portfolio-Template-Investor-Edit",templateDescription:"Portfolio Template for Investor Edit",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTFUNVIW",templateName:"Portfolio-Template-Investor-View",templateDescription:"Portfolio Template for Investor View",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTSPSEDT",templateName:"Portfolio-Template-ServiceProvider-Edit",templateDescription:"Portfolio Template for Service Provider View",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTSPSVIW",templateName:"Portfolio-Template-ServiceProvider-View",templateDescription:"Portfolio Template for Service Provider Edit",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTCMPEDT",templateName:"Portfolio-Template-Company-Edit",templateDescription:"Portfolio Template for Company View",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTCMPVIW",templateName:"Portfolio-Template-Company-View",templateDescription:"Portfolio Template for Company Edit",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTINSEDT",templateName:"Portfolio-Template-Institution-Edit",templateDescription:"Portfolio Template for Institution View",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
  {stepName:"Portfolio",stepCode:"PORTFOLIO",templateCode:"PFTINSVIW",templateName:"Portfolio-Template-Institution-View",templateDescription:"Portfolio Template for Institution Edit",isActive: true,createdDate:  new Date(),templateImage:"https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/images.png"},
]

let templateObject = {
  procesId                    : proc._id,
  subProcessId                : subProc._id,
  processName                 : "Registration",
  subProcessName              : "Registration",
  templates                   : templates,
  createdBy                   : "System",
  createdDate                 : "03-04-2017",
  isActive                    : true
}
MlTemplates.update({processName:"Registration","subProcessName":"Registration"},{$set:templateObject},{upsert:true});

/**
 * @record creation for {*MlTemplateAssignment}
 * @todo make one single array to create records
 */
const mltemplateAssignment = MlTemplateAssignment.find({ "templateProcessName": "Registration", "templateSubProcessName": "Registration" }).fetch();

if(mltemplateAssignment.length<=0){
  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "all", "templatecommunityName" : "All", "templateuserType" : "all",
    "templateidentity" : "all",
    "assignedTemplates" : [{"stepName" : "Soft", "stepCode" : "SOFT","templateName":"Soft-Reg-All","templateCode":"SRTALL"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "IDE", "templatecommunityName" : "Ideators", "templateuserType" : "all",
    "templateidentity" : "Company",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTIDECMP","templateName":"Hard-Reg-Ideator-Company"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "IDE", "templatecommunityName" : "Ideators", "templateuserType" : "all",
    "templateidentity" : "Individual",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTIDEINV","templateName":"Hard-Reg-Ideator-Individual"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });


  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "FUN", "templatecommunityName" : "Investors", "templateuserType" : "all",
    "templateidentity" : "Company",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTFUNCMP","templateName":"Hard-Reg-Investor-Company"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });



  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "FUN", "templatecommunityName" : "Investors", "templateuserType" : "all",
    "templateidentity" : "Individual",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTFUNINV","templateName":"Hard-Reg-Investor-Individual"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });


  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "SPS", "templatecommunityName" : "Service Providers", "templateuserType" : "all",
    "templateidentity" : "Company",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTSPSCMP","templateName":"Hard-Reg-ServiceProvider-Company"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });



  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "SPS", "templatecommunityName" : "Service Providers", "templateuserType" : "all",
    "templateidentity" : "Individual",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTSPSINV","templateName":"Hard-Reg-ServiceProvider-Individual"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });


  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "CMP", "templatecommunityName" : "Companies", "templateuserType" : "all",
    "templateidentity" : "Company",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTCMP","templateName":"Hard-Reg-Company"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });


  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "STU", "templatecommunityName" : "Startups", "templateuserType" : "all",
    "templateidentity" : "Company",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTSTU","templateName":"Hard-Reg-Startup-Company"}
    ], createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "INS", "templatecommunityName" : "Institutions", "templateuserType" : "all",
    "templateidentity" : "Company",
    "assignedTemplates" : [{"stepName" : "Hard", "stepCode" : "HARD","templateCode":"HRTINS","templateName":"Hard-Reg-Institution"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "IDE", "templatecommunityName" : "ideators", "templateuserType" : "all",
    "templateidentity" : "edit", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTIDEEDT","templateName":"Portfolio-Template-Ideator-Edit"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "IDE", "templatecommunityName" : "ideators", "templateuserType" : "all",
    "templateidentity" : "view", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTIDEVIW","templateName":"Portfolio-Template-Ideator-View"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "STU", "templatecommunityName" : "startups", "templateuserType" : "all",
    "templateidentity" : "edit", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTSTUEDT","templateName":"Portfolio-Template-Startup-Edit"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });


  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "STU", "templatecommunityName" : "startups", "templateuserType" : "all",
    "templateidentity" : "view", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTSTUVIW","templateName":"Portfolio-Template-Startup-View"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "FUN", "templatecommunityName" : "Investors", "templateuserType" : "all",
    "templateidentity" : "edit", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTFUNEDT","templateName":"Portfolio-Template-Investor-Edit"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "FUN", "templatecommunityName" : "Investors", "templateuserType" : "all",
    "templateidentity" : "view", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTFUNVIW","templateName":"Portfolio-Template-Investor-View"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  /**Service provider templates*/
  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "SPS", "templatecommunityName" : "Service Providers", "templateuserType" : "all",
    "templateidentity" : "edit", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTSPSEDT","templateName":"Portfolio-Template-ServiceProvider-Edit"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "SPS", "templatecommunityName" : "Service Providers", "templateuserType" : "all",
    "templateidentity" : "view", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTSPSVIW","templateName":"Portfolio-Template-ServiceProvider-View"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "CMP", "templatecommunityName" : "Companies", "templateuserType" : "all",
    "templateidentity" : "view", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTCMPVIW","templateName":"Portfolio-Template-Company-View"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "CMP", "templatecommunityName" : "Companies", "templateuserType" : "all",
    "templateidentity" : "edit", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTINSEDT","templateName":"Portfolio-Template-Company-Edit"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  /**Institution templates*/
  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "INS", "templatecommunityName" : "Institution", "templateuserType" : "all",
    "templateidentity" : "view", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTINSVIW","templateName":"Portfolio-Template-Institution-View"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });

  MlTemplateAssignment.insert({"templateprocess" :proc._id,"templatesubProcess" :subProc._id,"templateProcessName" : "Registration",
    "templateSubProcessName" : "Registration", "templateclusterId" : "all", "templateclusterName" : "All", "templatechapterId" : "all", "templatechapterName" : "All",
    "templatesubChapterId" : "all", "templatesubChapterName" : "All", "templatecommunityCode" : "INS", "templatecommunityName" : "Institution", "templateuserType" : "all",
    "templateidentity" : "edit", "assignedTemplates" : [{"stepName" : "Portfolio", "stepCode" : "PORTFOLIO","templateCode":"PFTINSEDT","templateName":"Portfolio-Template-Institution-Edit"}],
    createdDate: new Date(), createdBy: "systemadmin"
  });
}




