import React, {Component} from 'react';
import PortfolioLibrary from './PortfolioLibrary';
import SharedLibrary from  './sharedLibrary';
import { fetchSharedLibraryHandler } from '../../actions/mlLibraryActionHandler';
import MlConnectionHeader from './connectionHeader'
// import MlFilePreview from '../../../app/commons/components/MlFilePreview';
import MlVideoPlayer from '../../videoPlayer/MlVideoPlayer'
// import ShowMore from './seeMore'


export default class LibraryParentContainer extends Component {
  constructor(props) {
    super(props)
    this.state ={
      // componentToLoad: props.componentToLoad ? props.componentToLoad : "",
      data:[],
      sharedFiles:[],
      currentState:""
    }

    // this.previewClicked = this.previewClicked.bind(this);
    // this.closePreview = this.closePreview.bind(this);
  }
  //
  // componentWillReceiveProps(nextProps){
  //   let state = {};
  //   if(nextProps.componentToLoad && nextProps.componentToLoad !== this.state.componentToLoad){
  //     state.previewComponentToLoad = this.state.componentToLoad;
  //   }
  //
  //   state.componentToLoad = nextProps.componentToLoad;
  //
  //   this.setState(state);
  // }

  viewComponent(view) {
    this.setState({
      componentToLoad: view
    })
  }

  sharedData(data) {
    this.setState({data: data})
  }

  showLibrary(response) {
    this.setState({ componentToLoad: "MainLibrary" })
  }

  connectionManagement(userId) {
    this.setState({ sharedFiles: [] })
    this.getSharedFiles(userId);
  }

  async getSharedFiles(userId) {
    const resp = await fetchSharedLibraryHandler(userId)
    this.setState({ sharedFiles: resp, showSharedFiles: true })
    this.setState({componentToLoad: "ShareLibrary" , data: resp})
  }

  seeMoreData(toView, data, current, type) {
    this.setState({ componentToLoad: toView, data: data, currentState: current, type: type})
  }

  seeMoreDataInShare(toView, data, current, type) {
    this.setState({ componentToLoad: toView, data: data, currentState: current, type: type})
  }

  // closePreview(){
  //   this.setState({ componentToLoad: this.state.previewComponentToLoad , previewComponentToLoad :''});
  // }
  //
  // previewClicked(fileType, filePath){
  //   this.setState({
  //     componentToLoad :'preview',
  //     fileType,
  //     filePath
  //   });
  // }


  render() {

    switch(this.state.componentToLoad){

      case "PortfolioLibrary":
        return (
        <PortfolioLibrary
          isAdmin={this.props.isAdmin}
          tabName="Library"
          client={this.props.client}
          // previewClicked = {this.props.previewClicked}
          key="7"
          portfolioDetailsId={this.props.portfolioDetailsId}
          getSelectedAnnotations={this.props.getSelectedAnnotations}
          viewComponent={this.viewComponent.bind(this)}
          seeMoreData={this.seeMoreData.bind(this)}
        />
  )
      break;


      case "MainLibrary":
        return(
          <div className="app_main_wrap">
            <div className="app_padding_wrap">
              <PortfolioLibrary
                client={this.props.client}
                isAdmin={this.props.isAdmin ? this.props.isAdmin : false }
                viewComponent={this.viewComponent.bind(this)}
                sharedData={this.sharedData.bind(this)}
                seeMoreData={this.seeMoreData.bind(this)}
              />
            </div>
          </div>
        )
        break;


      case "ShareLibrary":
        return (
          <div className="app_main_wrap">
            <div className="app_padding_wrap">
              <h2>Library</h2>
              <MlConnectionHeader showLibrary={this.showLibrary.bind(this)} connectionManagement={this.connectionManagement.bind(this)} />
              <SharedLibrary
                data={this.state.data}
                seeMoreDataInShare={this.seeMoreDataInShare.bind(this)}
              />
            </div>
          </div>
        )
        break;


      // case "SeeMore":
      //   return (
      //     <div className="app_main_wrap">
      //       <div className="app_padding_wrap">
      //         <h2>Library</h2>
      //         <ShowMore
      //           data={this.state.data}
      //           type={this.state.type}
      //           currentState={this.state.currentState}
      //           viewComponent={this.viewComponent.bind(this)}
      //           seeMoreData={this.seeMoreData.bind(this)}
      //         />
      //       </div>
      //     </div>
      //   )
      //   break;


      case "preview":
        return (
          <div className={`modal fade bs-example-modal-sm library-popup ${this.props.fileType}pop`}
               onContextMenu={(e) => e.preventDefault()} tabindex="-1" role="dialog"
               aria-labelledby="mySmallModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                    aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body">

                  {(this.props.fileType === 'image' || this.props.fileType === 'template')?<div className="img_scroll"><img src={this.props.filePath} /></div>:<div></div>}

                  {this.props.fileType === 'video' ? <MlVideoPlayer videoAttributes={
                    [{
                      autoplay: true,
                      controls: true,
                      sources: [{ src: this.props.filePath, type: 'video/mp4' }]
                    }]
                  } /> : <div></div>}

                  {this.props.fileType === 'document'? <iframe src={`https://docs.google.com/gview?url=${this.props.filePath}&embedded=true`} />:<div></div>}

                </div>
              </div>
            </div>
          </div>
          // <MlFilePreview fileType = {this.state.fileType} filePath = {this.state.filePath}
    // closePreview={this.closePreview}/>
        )
        break;
    }
  }
}
