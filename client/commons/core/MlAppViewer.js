/** ************************************************************
 * Date: 12 Jul, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : Viewer component will contain all client configuration
 * JavaScript file MlAppViewer.js
 * *************************************************************** */

const MlAppViewer = class {
  constructor(options) {
    if (!options) throw new Error('MlViewer.View options argument is required');
    // if (!options.viewType) throw new Error('MlViewer.View options must specify view Type');
    // if (!options.viewComponent) throw new Error('MlViewer.View options must specify view Component');
    if (!options.name) throw new Error('MlViewer.View options must specify name');
    // if (!options.columns) throw new Error('MlViewer.View options must specify columns');

    this.name = options.name;
    this.module=options.module;
    this.moduleName=options.moduleName;
    this.showImage=options.showImage;
    this.buildQueryOptions = options.buildQueryOptions;
    this.fetchCenter = options.fetchCenter;
    this.fetchCenterHandler = options.fetchCenterHandler;
    this.mapMarkerComponent = options.mapMarkerComponent;
    this.fetchZoom=options.fetchZoom;
    this.fetchZoomHandler=options.fetchZoomHandler;
    this.actionConfiguration = options.actionConfiguration;
    this.viewComponent = options.viewComponent;
    this.graphQlQuery = options.graphQlQuery;
    this.queryOptions=options.queryOptions;
    this.header = options.header;
    this.headerComponents = options.headerComponents;
    this.perPageLimit = options.perPageLimit;
    this.isApp = true;
    this.mapFooterComponent = options.mapFooterComponent;
  }
};


export {MlAppViewer};

