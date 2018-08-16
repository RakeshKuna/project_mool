// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { render } from 'react-dom';
// import ScrollArea from 'react-scrollbar';
// var FontAwesome = require('react-fontawesome');
// var Select = require('react-select');
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import {multipartASyncFormHandler} from '../../../../../commons/MlMultipartFormAction'
// import {createLibrary, fetchLibrary, getAllowableDocumentFormats} from '../../../../../app/ideators/actions/ideatorActionHandler'
// import MlVideoPlayer from  '../../../../../commons/videoPlayer/MlVideoPlayer'
//
//
// export default class PortfolioLibrary extends React.Component{
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       modal: false,
//       uploadedImage: "",
//       previewImage:"",
//       previewVideo: "",
//       responseDataFromDB: "",
//       imageDetails: "",
//       uploadedVideo: "",
//       imageSpecifications: [],
//       videoSpecifications: [],
//       templateSpecifications: [],
//       videoUrl:'',
//       fileType:"",
//       fileName:"",
//       imagesLock : {},
//       templatesLock: {},
//       videosLock: {}
//     };
//
//     this.toggle = this.toggle.bind(this);
//     this.fetchOnlyImages.bind(this);
//   }
//
//   toggle() {
//     this.setState({
//       modal: !this.state.modal
//
//     });
//   }
//
//   ImageUpload(e){
//     let file=document.getElementById("image_upload").files[0];
//     this.setState({fileType:file.type,fileName:file.name });
//     if(file) {
//       let data = {moduleName: "PROFILE", actionName: "UPDATE"}
//       let response =  multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, "image"));
//     }
//   }
//
//   videoUpload() {
//     let file = document.getElementById("video_upload").files[0];
//     this.setState({fileType:file.type,fileName:file.name });
//     if (file) {
//       let data = {moduleName: "PROFILE", actionName: "UPDATE"}
//       let response =  multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this,"video"));
//     }
//   }
//   TemplateUpload(){
//     let file = document.getElementById("template_upload").files[0];
//     this.setState({fileType:file.type,fileName:file.name });
//     if (file) {
//       let data = {moduleName: "PROFILE", actionName: "UPDATE"}
//       let response =  multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this,"template"));
//     }
//   }
//
//   documentUpload() {
//     let file = document.getElementById("document_upload").files[0];
//     if (file) {
//       let data = {moduleName: "PROFILE", actionName: "UPDATE"}
//       let response =  multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this,"document"));
//     }
//   }
//
//   fetchOnlyImages(){
//       let userId = this.props.portfolioDetailsId;
//     this.getLibraryDetails(userId)
//   }
//
//   toggleImageLock(id){
//     let imageLock = this.state.imagesLock;
//     imageLock[id] = imageLock[id] ? false : true;
//     this.setState({
//       imageLock:imageLock
//     });
//     console.log(id);
//   }
//
//
//   toggleTemplateLock(id){
//     let templateLock = this.state.templatesLock;
//     templateLock [id] = templateLock [id] ? false : true;
//     this.setState({
//       templateLock :templateLock
//     });
//     console.log(id);
//   }
//
//   toggleVideoLock(id){
//     let videoLock = this.state.videosLock;
//     videoLock [id] = videoLock [id] ? false : true;
//     this.setState({
//       videoLock:videoLock
//     });
//     console.log(id);
//   }
//
//
//   onFileUploadCallBack(type, resp) {
//     if (resp) {
//       switch(type){
//         case "image":
//           this.setState({"uploadedImage": resp});
//           var imageLink = $.parseJSON(this.state.uploadedImage).result;
//           this.setState({"uploadedImage": imageLink});
//           let imageArray = this.state.imageSpecifications
//           this.setState({imageSpecifications:imageArray})
//           this.storeData(imageLink,"image")
//           break;
//         case "video":
//           this.setState({"uploadedVideo": resp});
//           var videoLink = $.parseJSON(this.state.uploadedVideo).result;
//           this.setState({"uploadedVideo": videoLink});
//           this.storeData(videoLink,"video")
//           break;
//         case "document":
//           this.setState({"uploadedDocuments": resp});
//           var documentLink = $.parseJSON(this.state.uploadedDocuments).result;
//           this.setState({"uploadedDocuments": documentLink});
//           this.storeData(documentLink,"video")
//           break;
//         case "template":
//           this.setState({"uploadedTemplate": resp});
//           var templateLink = $.parseJSON(this.state.uploadedTemplate).result;
//           this.setState({"uploadedTemplate": imageLink});
//           let templateArray = this.state.templateSpecifications
//           this.setState({templateSpecifications:templateArray})
//           this.storeData(templateLink,"template")
//           break;
//       }
//     }
//   }
//   async storeData(link,dataType){
//     switch(dataType) {
//       case "image":
//         let  imageDetails = {
//           userId: this.props.portfolioDetailsId,
//           images: {
//             fileName: this.state.fileName,
//             fileUrl: link,
//             fileType: this.state.fileType
//           }
//         }
//         const resp = await createLibrary(imageDetails)
//         this.fetchOnlyImages();
//         return resp;
//
//         break;
//       case "video":
//         let  videoDetails = {
//           userId: this.props.portfolioDetailsId,
//           videos: {
//             fileName: this.state.fileName,
//             fileUrl: link,
//             fileType: this.state.fileType
//           }
//         }
//         const res = await createLibrary(videoDetails)
//         return res;
//         break;
//       case "document":
//         let  documentDetails = {
//           userId: this.props.portfolioDetailsId,
//           documents: {
//             fileName: this.state.fileName,
//             fileUrl: link,
//             fileType: this.state.fileType
//           }
//         }
//         const res1 = await createLibrary(documentDetails)
//         return res1;
//         break;
//       case "template":
//         let  templateDetails = {
//           userId: this.props.portfolioDetailsId,
//           templates: {
//             fileName: this.state.fileName,
//             fileUrl: link,
//             fileType: this.state.fileType
//           }
//         }
//         const res2 = await createLibrary(templateDetails)
//         return res2;
//         break;
//     }
//
//   }
//   componentWillMount(){
//     userId =  this.props.portfolioDetailsId;
//     console.log(this.props)
//     this.getLibraryDetails(userId);
//     this.getAllowableDocumentFormats();
//   }
//
//   async getLibraryDetails(userId) {
//     const resp = await fetchLibrary(userId)
//     var libraryDetails = resp;
//     var details = [];
//     if(libraryDetails[0].images) {
//       libraryDetails.map(function (attributes) {
//         details.push(attributes.images)
//       })
//       let imagesArray = details;
//       var imageDetails = [];
//       if (imagesArray != null) {
//         imagesArray.map(function (imageAttributes) {
//           if (imageAttributes) {
//             imageDetails = imageAttributes
//           }
//         })
//         this.setState({imageSpecifications: imageDetails})
//       }
//     }else{
//       this.setState({imageSpecifications:[]})
//     }
//     if(libraryDetails[0].templates) {
//       libraryDetails.map(function (attributes) {
//         details.push(attributes.templates)
//       })
//       let templatesArray = details;
//       var templateDetails = [];
//       if (templatesArray != null) {
//         templatesArray.map(function (templateAttributes) {
//           if (templateAttributes) {
//             templateDetails = templateAttributes
//           }
//         })
//         this.setState({templateSpecifications: templateDetails})
//       }
//     }else{
//       this.setState({templateSpecifications:[]})
//     }
//
//
//     if(libraryDetails[0].videos) {
//       let videoStructure = [] ;
//       libraryDetails.map(function (attributes) {
//         videoStructure.push(attributes.videos)
//       })
//       let videoArray = videoStructure;
//       var videoDetails = [];
//       if (videoArray != null) {
//         videoArray.map(function (videoAttributes) {
//           if (videoAttributes) {
//             videoDetails = videoAttributes
//           }
//         })
//         this.setState({videoSpecifications: videoDetails})
//       }
//     }else{
//       this.setState({videoSpecifications:[]})
//     }
//
//   }
//
//   async getAllowableDocumentFormats(){
//     const response = await getAllowableDocumentFormats()
//     return response;
//   }
//
//
//
//   randomVideo(link,index){
//     let data = this.state.videoSpecifications || [];
//     let videoPreviewUrl;
//     videoPreviewUrl = data[index].fileUrl;
//     this.setState({previewVideo:videoPreviewUrl,videoUrl:videoPreviewUrl});
//
//   }
//
//   random(link,index){
//     let data = this.state.imageSpecifications || [];
//     let imagePreviewUrl;
//     imagePreviewUrl = data[index].fileUrl;
//     this.setState({previewImage:imagePreviewUrl});
//   }
//
//   randomTemplate(link,index){
//     let data = this.state.templateSpecifications || [];
//     let templatePreviewUrl;
//     templatePreviewUrl= data[index].fileUrl;
//     this.setState({previewTemplate:templatePreviewUrl});
//   }
//
//   componentDidMount(){
//
//     (function(a){a.createModal=function(b){defaults={scrollable:false};var b=a.extend({},defaults,b);var c=(b.scrollable===true)?'style="max-height: 420px;overflow-y: auto;"':"";html='<div class="modal fade library-popup" id="myModal">';html+='<div class="modal-dialog">';html+='<div class="modal-content">';html+='<div class="modal-header">';html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">Ã—</button>';if(b.title.length>0){html+='<h4 class="modal-title">'+b.title+"</h4>"}html+="</div>";html+='<div class="modal-body" '+c+">";html+=b.message;html+="</div>";a("body").prepend(html);a("#myModal").modal().on("hidden.bs.modal",function(){a(this).remove()})}})(jQuery);
//     $('.view-pdf').on('click',function(){
//       var pdf_link = $(this).attr('href');
//       var iframe = '<div class="iframe-container"><iframe src="'+pdf_link+'"></iframe></div>'
//       $.createModal({
//         title:'My Title',
//         message: iframe,
//         scrollable:false
//       });
//       return false;
//     });
//   }
//   render(){
//     var videoJsOptions = [{
//       autoplay: true,
//       controls: true,
//       sources: [{
//         src: this.state.previewVideo,
//         type: 'video/mp4'
//       }]
//     }]
//
//     let imageData = this.state.imageSpecifications||[];
//     let that = this;
//     const Images = imageData.map(function(show,id) {
//       return(
//         <div className="thumbnail"key={id}>
//           {that.state.imagesLock[id] ? <FontAwesome onClick={()=>that.toggleImageLock(id)} name='lock' /> : <FontAwesome onClick={()=>that.toggleImageLock(id)} name='unlock'/> }
//           <a href="" data-toggle="modal" data-target=".imagepop" onClick={that.random.bind(that,show.fileUrl,id)} ><img src={show.fileUrl}/></a>
//           <div id="images" className="title">{show.fileName}</div>
//         </div>
//       )
//     });
//
//     let templateData =  this.state.templateSpecifications || [];
//     const Templates = templateData.map(function(show,id) {
//       return(
//         <div className="thumbnail"key={id}>
//           {that.state.templatesLock[id] ? <FontAwesome onClick={()=>that.toggleTemplateLock(id)} name='lock' /> : <FontAwesome onClick={()=>that.toggleTemplateLock(id)} name='unlock'/> }
//           <a href="" data-toggle="modal" data-target=".templatepop" onClick={that.randomTemplate.bind(that,show.fileUrl,id)} ><img src={show.fileUrl}/></a>
//           <div id="templates" className="title">{show.fileName}</div>
//         </div>
//       )
//     });
//
//
//
//     let videodata= this.state.videoSpecifications || [];
//     const videos = videodata.map(function(show,id){
//       return(
//         <div className="thumbnail">
//           {that.state.videosLock[id] ? <FontAwesome onClick={()=>that.toggleVideoLock(id)} name='lock' /> : <FontAwesome onClick={()=>that.toggleVideoLock(id)} name='unlock'/> }
//           <a href="" data-toggle="modal" data-target=".videopop" onClick={that.randomVideo.bind(that,show.fileUrl,id)}>
//             <video width="120" height="100" controls>
//               <source src={show.fileUrl}type="video/mp4"></source>
//             </video>
//           </a>
//           <div className="title">{show.fileName}</div>
//         </div>
//       )
//     });
//     // let data2= this.state.data2 || [];
//     // const documents = data2.map(function(show){
//     //   return(
//     //     <div className="thumbnail"><FontAwesome name='unlock'/><a href="" data-toggle="modal" data-target=".imagepop"><video width="320" height="240" controls>
//     //       <source src="https://s3.ap-south-1.amazonaws.com/moolya-users/registrationDocuments/SampleVideo_1280x720_1mb.mp4" type="video/mp4"></source></video></a><div className="title">Video</div></div>
//     //   )
//     // });
//     return (
//       <div>
//         <h2>Library</h2>
//         {/*<Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>*/}
//         <Modal isOpen={this.state.modal} toggle={this.toggle} className={'library-popup'}>
//           <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
//           <ModalBody>
//             <img src="/images/video_1.jpg"/>
//           </ModalBody>
//         </Modal>
//         <div className="modal fade bs-example-modal-sm library-popup imagepop" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//               </div>
//               <div className="modal-body" >
//                 <div className="img_scroll"><img src={this.state.previewImage}/></div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="modal fade bs-example-modal-sm library-popup templatepop" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//               </div>
//               <div className="modal-body" >
//                 <div className="img_scroll"><img src={this.state.previewTemplate}/></div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="modal fade bs-example-modal-sm library-popup pdfpop" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//               </div>
//               <div className="modal-body">
//                 <div className="img_scroll"><img src="/images/zomato-bs.png"/></div>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <div className="modal fade bs-example-modal-sm library-popup videopop" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//               </div>
//               <div className="modal-body" >
//                 {this.state.previewVideo ? <MlVideoPlayer  videoAttributes = {videoJsOptions} /> : <div></div>}
//                 {/*<iframe width="560" height="315" src={this.state.videoUpload} frameborder="0" allowfullscreen></iframe>*/}
//               </div>
//             </div>
//           </div>
//         </div>
//
//         {/*<div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-left">*/}
//
//         {/*<div className="panel panel-default">*/}
//         {/*<div className="panel-heading">*/}
//         {/*Documents<input type="file" className="upload_file upload" name="file_source" />*/}
//
//         {/*</div>*/}
//         {/*<div className="panel-body">*/}
//         {/*/!*<div className="thumbnail"><FontAwesome name='unlock'/><a className="view-pdf" href="/images/sample.pdf"><img src="/images/ppt.png"/></a><div className="title">Document</div></div>*!/*/}
//         {/*<div className="thumbnail"><FontAwesome name='unlock'/><a data-toggle="modal" data-target=".pdfpop" href=""><img src="/images/ppt.png"/></a><div className="title">Document</div></div>*/}
//         {/*</div>*/}
//         {/*</div>*/}
//         {/*</div>*/}
//         <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-right">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               Images
//              {/* <div className="fileUpload upload_file_mask pull-right">
//                 <a href="javascript:void(0);"><span className="ml ml-upload"></span>
//                   <input type="file" className="upload_file upload" name="image_source" id="image_upload" onChange={that.ImageUpload.bind(that)} />
//                 </a>
//               </div>*/}
//             </div>
//             <ul>
//               <li>
//                 <div className="panel-body">
//                   {Images}
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-left">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               Videos
//              {/* <div className="fileUpload upload_file_mask pull-right">
//                 <a href="javascript:void(0);"><span className="ml ml-upload"></span>
//                   <input type="file" className="upload_file upload" name="video_source" id="video_upload" onChange={that.videoUpload.bind(that)} />
//                 </a>
//               </div>*/}
//             </div>
//             <ul>
//               <li>
//                 <div className="panel-body">
//                   {videos}
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-right">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               Templates
//              {/* <div className="fileUpload upload_file_mask pull-right">
//                 <a href="javascript:void(0);"><span className="ml ml-upload"></span>
//                   <input type="file" className="upload_file upload" name="image_source" id="template_upload" onChange={that.TemplateUpload.bind(that)} />
//                 </a>
//               </div>*/}
//             </div>
//           </div>
//
//           <ul>
//             <li>
//               <div className="panel-body">
//                 {Templates}
//               </div>
//             </li>
//           </ul>
//         </div>
//
//         {/*<div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-right">*/}
//         {/*<div className="panel panel-default">*/}
//         {/*<div className="panel-heading">*/}
//         {/*Templates  <span className="see-more pull-right">*/}
//         {/*<input type="file" className="upload_file upload" name="image_source" id="image_upload" onChange={this.TemplateUpload.bind(this)} /></span>*/}
//         {/*</div>*/}
//         {/*<div className="panel-body">*/}
//         {/*<div className="thumbnail"><FontAwesome name='lock'/><img src="/images/template_1.jpg"/><div className="title">Template</div></div>*/}
//         {/*</div>*/}
//         {/*<ul>*/}
//         {/*<li>*/}
//         {/*<div className="panel-body">*/}
//         {/*{Templates}*/}
//         {/*</div>*/}
//         {/*</li>*/}
//         {/*</ul>*/}
//         {/*</div>*/}
//         {/*</div>*/}
//         {/*--------------------------------------*/}
//
//         {/*<h2>Documents</h2>*/}
//         {/*<div className="col-md-12 library-wrap-details">*/}
//         {/*<div className="row">*/}
//         {/*<div className="col-lg-2 col-md-3 col-sm-3">*/}
//         {/*<div className="list_block">*/}
//         {/*<div className="cluster_status"><FontAwesome name='lock'/></div>*/}
//
//         {/*<h3>Document</h3>*/}
//         {/*</div>*/}
//         {/*</div>*/}
//         {/*<div className="col-lg-2 col-md-3 col-sm-3">*/}
//         {/*<div className="list_block">*/}
//         {/*<div className="cluster_status"><FontAwesome name='lock'/></div>*/}
//
//         {/*<h3>Document</h3>*/}
//         {/*</div>*/}
//         {/*</div>*/}
//         {/*<div className="col-lg-2 col-md-3 col-sm-3">*/}
//         {/*<div className="list_block">*/}
//         {/*<div className="cluster_status"><FontAwesome name='lock'/></div>*/}
//
//         {/*<h3>Document</h3>*/}
//         {/*</div>*/}
//         {/*</div>*/}
//         {/*<div className="col-lg-2 col-md-3 col-sm-3">*/}
//         {/*<div className="list_block">*/}
//         {/*<div className="cluster_status"><FontAwesome name='lock'/></div>*/}
//
//         {/*<h3>Document</h3>*/}
//         {/*</div>*/}
//         {/*</div>*/}
//         {/*<div className="col-lg-2 col-md-3 col-sm-3">*/}
//         {/*<a href="/admin/editCluster">*/}
//         {/*<div className="list_block">*/}
//         {/*<div className="cluster_status"><FontAwesome name='lock'/></div>*/}
//
//         {/*<h3>Document</h3>*/}
//         {/*</div>*/}
//         {/*</a>*/}
//         {/*</div>*/}
//         {/*<div className="col-lg-2 col-md-3 col-sm-3">*/}
//         {/*<div className="list_block">*/}
//         {/*<div className="cluster_status"><FontAwesome name='lock'/></div>*/}
//
//         {/*<h3>Document</h3>*/}
//         {/*</div>*/}
//
//         {/*</div>*/}
//
//         {/*</div>*/}
//         {/*</div>*/}
//       </div>
//     )
//   }
// };
