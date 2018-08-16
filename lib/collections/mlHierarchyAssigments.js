import MlSchemas from '../common/commonSchemas'
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'
MlHierarchyAssignments = new Mongo.Collection('mlHierarchyAssignments');

MlHierarchyAssignmentsSchema = new SimpleSchema({

    parentDepartment: {
      type: String,
      optional: true
    },
    parentSubDepartment: {
      type: String,
      optional: true
    },
    clusterId:{
      type: String,
      optional: true
    },
    subChapterId:{
      type : String,
      optional : true
    },
    isDefaultSubChapter:{
      type : Boolean,
      optional : true
    },
    teamStructureAssignment : {
      type:Array,
      optional:true
    },
    'teamStructureAssignment.$':{
      type:Object,
      optional:true
    },
    'teamStructureAssignment.$.roleId':{
      type:String,
      optional:true
    },
    'teamStructureAssignment.$.roleName':{
      type:String,
      optional:true
    },
    'teamStructureAssignment.$.displayName':{
      type:String,
      optional:true
    },
    'teamStructureAssignment.$.roleType':{
      type:String,
      optional:true
    },
    'teamStructureAssignment.$.isAssigned':{
      type:Boolean,
      optional:true
    },
   'teamStructureAssignment.$.assignedLevel':{
      type:String,
      optional:true
    },
    'teamStructureAssignment.$.levelCode':{
      type:String,
      optional:true
    },
    'teamStructureAssignment.$.reportingRole':{
      type:String,
      optional:true
    },
    finalApproval:{
      type:Object,
      optional:true
    },
    'finalApproval.department': {
      type: String,
      optional: true
    },
    'finalApproval.subDepartment':{
      type:String,
      optional:true
    },
    'finalApproval.role':{
      type:String,
      optional:true
    },
    'finalApproval.isChecked':{
      type:Boolean,
      optional:true
    }

})

MlHierarchyAssignments.attachSchema(MlHierarchyAssignmentsSchema);

MlSchemas["MlHierarchyAssignments"] = MlHierarchyAssignmentsSchema;
MlCollections['MlHierarchyAssignments'] = MlHierarchyAssignments;
