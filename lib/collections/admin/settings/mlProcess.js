import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlprocessTypes = new Mongo.Collection('mlProcessTypes');

MlprocessTypesSchema = new SimpleSchema({

  processName: {
    type: String,
    optional: false
  },
  displayName: {
    type: String,
    optional: true
  },
  processDesc: {
    type: String,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
  }

})

MlprocessTypes.attachSchema(MlprocessTypesSchema);
MlCollections['MlprocessTypes'] = MlprocessTypes;

