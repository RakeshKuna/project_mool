import MlSchemas from '../common/commonSchemas'
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlHierarchyFinalApproval = new Mongo.Collection('mlHierarchyFinalApproval');

MlHierarchyFinalApprovalSchema = new SimpleSchema({
  parentDepartment: {
    type: String,
    optional: false
  },
  parentSubDepartment: {
    type: String,
    optional: true
  },
  clusterId:{
    type: String,
    optional: true
  },
  department: {
    type: String,
    optional: true
  },
  subDepartment:{
    type:String,
    optional:true
  },
  role:{
    type:String,
    optional:true
  }
})

MlHierarchyFinalApproval.attachSchema(MlHierarchyFinalApprovalSchema);
MlSchemas["MlHierarchyFinalApproval"] = MlHierarchyFinalApprovalSchema;
MlCollections['MlHierarchyFinalApproval'] = MlHierarchyFinalApproval;
