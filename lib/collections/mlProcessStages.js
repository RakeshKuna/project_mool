/**
 * Created by venkatsrinag on 7/6/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlProcessStages = new Mongo.Collection('mlProcessStages');

MlProcessStagesSchema = new SimpleSchema({
    name:{
        type:String,
        optional:false
    },

    displayName:{
        type:String,
        optional:false
    },

    code:{
        type:String,
        optional:false
    },

    isActive:{
        type:Boolean,
        optional:false
    }
})

MlProcessStages.attachSchema(MlProcessStagesSchema);
MlCollections['MlProcessStages'] = MlProcessStages;
