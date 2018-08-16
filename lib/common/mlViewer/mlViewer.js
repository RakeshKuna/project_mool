/**
 * Created by mohammed.mohasin on 03/02/17.
 */
import { Meteor } from 'meteor/meteor';
const MlViewerTypes = {'LIST':'LIST','TABLE':'TABLE','GRID':'GRID','MAP':'MAP'};
//MlViewer contains client configuration for all the Grid,List and Table views of the Moolya Admin Application.
const MlViewer = {};
//MlViewerSecure contains server configuration for all the Grid,List and Table views of the Moolya Admin Application.
const MlViewerSecure = {};
MlViewer.viewsByName = {};

MlViewer.View = class {
  constructor(options) {
    if (!options) throw new Error('MlViewer.View options argument is required');
    if (!options.viewType) throw new Error('MlViewer.View options must specify view Type');
   // if (!options.viewComponent) throw new Error('MlViewer.View options must specify view Component');
    if (!options.name) throw new Error('MlViewer.View options must specify name');
   // if (!options.columns) throw new Error('MlViewer.View options must specify columns');

    //Removed as Collection should always be accessed in server and client should initialize the tabular for its use in the client side only.
    //MlTabularSecure contains the Collection on server and is secure
    /*if (!(options.collection instanceof Mongo.Collection
        || options.collection instanceof Mongo.constructor // Fix: error if `collection: Meteor.users`
      )) {
      throw new Error('Tabular.Table options must specify collection');
    }*/

    this.name = options.name;
    this.module=options.module;
    this.showImage=options.showImage;
    //this.collection = options.collection;

    this.viewType = options.viewType;
    this.viewComponent = options.viewComponent;
    this.graphQlQuery = options.graphQlQuery;
    this.queryOptions=options.queryOptions;
    this.buildQueryOptions = options.buildQueryOptions;
    this.showActionComponent = options.showActionComponent;
    this.actionConfiguration = options.actionConfiguration;
    this.filter=options.filter;
    this.filterComponent=options.filterComponent;
    this.filterData=options.filterData;
    this.fetchCenter = options.fetchCenter;
    this.fetchCenterHandler = options.fetchCenterHandler;
   
    if(options.viewType==="TABLE"){
      this.tableHeaderClass=options.tableHeaderClass;
      this.trClassName=options.trClassName; //color for table row
      this.selectRow=options.selectRow;
    }else if(options.viewType==='MAP'){
      this.mapFooterComponent=options.mapFooterComponent;
      this.mapMarkerComponent=options.mapMarkerComponent;
      this.fetchZoom=options.fetchZoom;
      this.fetchZoomHandler=options.fetchZoomHandler;
      this.disableHover=options.disableHover;
    }

    this.pub = options.pub || 'tabular_genericPub';

    // By default we use core `Meteor.subscribe`, but you can pass
    // a subscription manager like `sub: new SubsManager({cacheLimit: 20, expireIn: 3})`
    this.sub = options.sub || Meteor;

    this.onUnload = options.onUnload;
    this.allow = options.allow;
    this.allow = options.allow;
    this.search = options.search;
    this.changeSelector = options.changeSelector;
    this.throttleRefresh = options.throttleRefresh;
    this.alternativeCount = options.alternativeCount;
    this.skipCount = options.skipCount;

    if (_.isArray(options.extraFields)) {
      const fields = {};
      _.each(options.extraFields, fieldName => {
        fields[fieldName] = 1;
      });
      this.extraFields = fields;
    }

    this.selector = options.selector;
    this.pagination=options.pagination||false;
    this.isExpandableRow=options.isExpandableRow;
    this.expandComponent=options.expandComponent;
    this.asyncExpand=options.asyncExpand;
    this.asyncExpandRowKey=options.asyncExpandRowKey;
    this.columns=options.columns;
    this.fields=options.fields;
    this.extraFields=options.extraFields;
    this.fieldsMap=options.fieldsMap;
    this.multiSelect=options.multiSelect;

    this.options = _.omit(
      options,
      'collection',
      'pub',
      'sub',
      'onUnload',
      'allow',
      'allowFields',
      'changeSelector',
      'throttleRefresh',
      'extraFields',
      'alternativeCount',
      'skipCount',
      'name',
      'selector'
    );

    MlViewer.viewsByName[this.name] = this;
  }
}

//client-side= to fetch the collection based on table name
//server-side= to fetch the collection based on table name, run secure selectors and authorizations
  //MlTabularSecure['userList']={'collection':MlSoftRegistration,changeSelector:null,allow:null,allowFields:null};
//MlTabularSecure['userListHard']={'collection':MlHardRegistration,changeSelector:null,allow:null,allowFields:null};

export {MlViewer,MlViewerSecure,MlViewerTypes};
