import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlDocumentCategories = new Mongo.Collection('mlDocumentCategory');

MlDocumentCategoriesSchema = new SimpleSchema({
  docCategoryName:{
    type:String,
    optional:false
  },
  docCategoryDisplayName:{
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


MlDocumentCategories.attachSchema(MlDocumentCategoriesSchema);
MlCollections['MlDocumentCategories'] = MlDocumentCategories;

