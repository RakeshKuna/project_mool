// /** ************************************************************
//  * Date: 19 Jun, 2017
//  * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
//  * Description : This will manage the library actions across all the porfolios
//  * JavaScript XML file PortfolioLibrary.jsx
//  * *************************************************************** */
//
// /**
//  * Imports libs and components
//  */
//
// import React from 'react';
// var FontAwesome = require('react-fontawesome');
// var Select = require('react-select');
// import { Modal, ModalHeader, ModalBody} from 'reactstrap';
// import {multipartASyncFormHandler} from '../../MlMultipartFormAction'
// import {createLibrary, fetchLibrary, updateLibraryData, updatePrivacyDetails, updateLibrary, fetchDataFromCentralLibrary, fetchSharedLibraryHandler} from '../../actions/mlLibraryActionHandler'
// import MlVideoPlayer from  '../../videoPlayer/MlVideoPlayer'
// import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
// import formHandler from "../../../commons/containers/MlFormHandler";
// import MlAccordion from "../../../app/commons/components/MlAccordion";
// import MlAppActionComponent from '../../../app/commons/components/MlAppActionComponent'
// import PopoverActionIcon from '../../../app/appActions/components/PopoverActionIcon';
// import SharePopOver from './sharePopOver'
// import MlConnectionHeader from './connectionHeader'
// import SharedLibrary from './sharedLibrary'
//
// export default class  LibraryView extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {modal: false}
//     this.toggle = this.toggle.bind(this);
//   }
//
//   /**
//    * Method :: toggle
//    * Desc   :: toggles the Modal component
//    * @returns Void
//    */
//
//   toggle() {
//     this.setState({
//       modal: !this.state.modal
//     });
//   }
//
//
//   images() {
//     const {userLibraryElements, libraryElements, isLibrary, isAdmin, isExploring } = this.props;
//     let imageData = isLibrary ? userLibraryElements && userLibraryElements.images ? userLibraryElements["images"] : [] :libraryElements && libraryElements.images ? libraryElements["images"] : [];
//     const Images = imageData.map(function (show, id) {
//       return (
//         <div className="thumbnail" key={id}>
//           {/*<FontAwesome name='lock'/>*/}
//           {/*<FontAwesome name='unlock'/>*/}
//           {isExploring ? "" : <FontAwesome name='trash-o' />}
//           <a href="" data-toggle="modal" data-target=".imagepop"><img src={show.fileUrl}/></a>
//           <div id="images" className="title">{show.fileName}</div>
//         </div>
//       )
//     });
//     return Images
//   }
//
//   render() {
//     const {
//       isLibrary, isExploring, userLibraryData, libraryElements, imageUpload, videoUpload, documentUpload, templateUpload,
//       action, isAdmin, portfolioDetailsId, popOverActions
//     } = this.props;
//
//     let ImageDetails = {
//       id: "create_client",
//       toDisplay: this.images(),
//       placement: "bottom",
//       title: "Images"
//     }
//
//      return (
//       <div>
//         <div className="col-lg-6 col-md-6 col-sm-12 library-wrap nopadding-left">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               Images
//               <div className="fileUpload upload_file_mask pull-right" id="create_client">
//               <a href="javascript:void(0);">
//               {isExploring ? "" : isLibrary ?
//               <span className="ml ml-upload"><input type="file" className="upload_file upload"
//               name="video_source" id="video_upload"
//               onChange={this.props.imageUpload(this)}/></span> :
//               <span className="ml ml-upload" onClick={this.props.PopOverAction.bind(this, ImageDetails)}></span>}
//               </a>
//               </div>
//             </div>
//             <div className="panel-body" onContextMenu={(e) => e.preventDefault()}>
//               {this.images()}
//             </div>
//           </div>
//         </div>
//         <Popover placement={popOverActions.placement} isOpen={popOverActions.popoverOpen} target={popOverActions.target}>
//           <PopoverTitle>{popOverActions.title}</PopoverTitle>
//           <PopoverContent>
//             <div className="ml_create_client">
//               <div className="medium-popover">
//                 <div className="form-group popover_thumbnail">
//                   {popOverActions.toDisplay}
//                 </div>
//                 <div className="fileUpload mlUpload_btn">
//                   <span>Upload</span>
//                   {popOverActions.file === "Images" ?
//                     <input type="file" className="upload" ref="upload" onChange={this.props.imageUpload.bind(this)}/> :
//                     popOverActions.file === "Videos" ?
//                       <input type="file" className="upload_file upload" name="video_source" id="video_upload"
//                              onChange={this.props.videoUpload.bind(this)}/> :
//                       popOverActions.file === "Documents" ? <input type="file" className="upload" ref="upload"
//                                                                onChange={this.props.documentUpload.bind(this)}/> :
//                         popOverActions.file === "Templates" ? <input type="file" className="upload" ref="upload"
//                                                                  onChange={this.props.templateUpload.bind(this)}/> : ""}
//                 </div>
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>
//         {/*{isLibrary ? <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} /> : ""}*/}
//       </div>
//     )
//   }
// }
