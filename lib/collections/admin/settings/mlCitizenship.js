import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlCitizenship = new Mongo.Collection('mlCitizenship');

MlCitizenshipSchema = new SimpleSchema({
  citizenshipTypeName:{
    type:String,
    optional:false
  },
  citizenshipTypeDisplayName:{
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


MlCitizenship.attachSchema(MlCitizenshipSchema);
MlCollections['MlCitizenship'] = MlCitizenship;

