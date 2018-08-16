/**
 * Created by venkatsrinag on 2/5/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'

MlIdeas = new Mongo.Collection('mlIdeas');

ideaSchema = new SimpleSchema({
    userId:{
        type:String,
        optional:true
    },
    portfolioId:{
        type:String,
        optional:true
    },
    title:{
        type:String,
        optional:true
    },
    isIdeaTitlePrivate: {
        type: Boolean,
        optional: true
    },
    ideaDescription:{
        type:String,
        optional:true
    },
    isIdeaPrivate: {
      type: Boolean,
      optional: true
    },
    isActive: {
        type: Boolean,
        defaultValue:true,
        optional: true
    },
    'ideaImage':{
      type: Object,
      optional:true
    },
    'ideaImage.fileUrl':{
      type:String,
      optional:false
    },
    'ideaImage.fileName':{
      type:String,
      optional:false
    },
})

MlIdeas.attachSchema(ideaSchema);
MlCollections['MlIdeas'] = MlIdeas;
