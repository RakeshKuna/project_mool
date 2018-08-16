import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlEntity = new Mongo.Collection('mlEntityType');

MlEntitySchema = new SimpleSchema({
  entityName:{
    type:String,
    optional:false
  },
  entityDisplayName:{
    type:String,
    optional:true
  },
  about:{
    type: String,
    optional:true
  },
  createdBy:{
    type:String,
    optional: true
  },
  createdDate:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional: true
  },
  updatedDate:{
    type:Date,
    optional:true
  },
  isActive:{
    type:Boolean,
    optional:true
  }
})


MlEntity.attachSchema(MlEntitySchema);
MlCollections['MlEntity'] = MlEntity;
