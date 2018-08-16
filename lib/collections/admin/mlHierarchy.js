import SimpleSchema from "simpl-schema";
import MlCollections from "../../common/commonSchemas";
/**
 * Created by venkatasrinag on 27/1/17.
 * Updated by mohdmohasin on 15/02/2017
 */
MlHierarchy = new Mongo.Collection('mlHierarchy');

MlHierarchySpecifics=new SimpleSchema({
  code:{ //unique code for each hierarchy level Cluster,Chapter,SubChapter,Community
    type:String,
    optional:false
  },
  level:{ //level assigned(bottoms top)
    type: SimpleSchema.Integer,
    optional:false
  },
  module:{ //module for the hierarchy such as Cluster,Chapter,Sub Chapter or Community
    type:String,
    optional:true
  },
  moduleFieldRef:{ //module specific unique field for clusterId,chapterId,subChapterId or communityId
    type:String,
    optional:true
  },
  isParent:{ //if the hierarchy is the parent level
    type:Boolean,
    optional:true
  },
  // menuName:{
  //   type:String,
  //   optional:true
  // },
  menuName: {     //separate menu for moolya and non-moolya
    type: Array,
    optional: true
  },
  'menuName.$': {
    type: Object,
    optional: true
  },
  'menuName.$.isMoolya': {
    type: Boolean,
    optional: true
  },
  'menuName.$.menuName': {
    type: String,
    optional: true
  },
  role:{
    type:String,
    optional:true
  }
});

MlHierarchySchema = new SimpleSchema({
  immediateParentCode:{
    type:String,
     optional:true
  },
  immediateParentLevel:{
    type: SimpleSchema.Integer,
    optional:true
  },
  parent:{
    type:Array,
    optional:true
  },
  "parent.$":{
    type:MlHierarchySpecifics,
    optional:true
  },
  child:{
    type:Array,
    optional:true
  },
  "child.$":{
    type:MlHierarchySpecifics,
    optional:true
  }
});

MlHierarchySchema.extend(MlHierarchySpecifics);
MlHierarchy.attachSchema(MlHierarchySchema);
MlCollections['MlHierarchy'] = MlHierarchy;
