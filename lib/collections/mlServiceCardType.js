/**
 * Created by venkatsrinag on 28/7/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../common/commonSchemas'


MlServiceCardType = new Mongo.Collection('mlServiceCardType');

MlServiceCardTypeSchema = new SimpleSchema({
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

    isActive: {
        type: Boolean,
        optional: true
    }
})

MlServiceCardType.attachSchema(MlServiceCardTypeSchema);
MlCollections['MlServiceCardType'] = MlServiceCardType;
