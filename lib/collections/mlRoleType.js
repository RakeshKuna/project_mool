import SimpleSchema from 'simpl-schema';
/**
 * Created by murali on 14/2/17.
 */
MlRoleTypes = new Mongo.Collection('mlRoleTypes');

MlRoleTypesSchema = new SimpleSchema({

 roleTypeName: {
    type: String,
    optional: false
  },
  roleTypeDisplayName: {
    type: String,
    optional: true
  },
  roleTypeDescription: {
    type: String,
    optional: true
  },
  isActive: {
    type: Boolean,
    optional: true
  }

})

MlRoleTypes.attachSchema(MlRoleTypesSchema);
