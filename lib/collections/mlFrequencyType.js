/**
 * Created by venkatsrinag on 28/7/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'

MlFrequencyType = new Mongo.Collection('mlFrequencyType');

MlFrequencyTypeSchema = new SimpleSchema({
    name: {
        type: String,
        optional: false
    },

    displayName: {
        type: String,
        optional: true
    },

    code: {
        type: String,
        optional: true
    },

    description:{
        type:String,
        optional:true
    },

    value:{
        type:Number,
        optional:true
    },

    isActive: {
        type: Boolean,
        optional: true
    }
})

MlFrequencyType.attachSchema(MlFrequencyTypeSchema);
MlCollections['MlFrequencyType'] = MlFrequencyType;
