import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

/**
 * Created by venkatasrinag on 28/1/17.
 */
MlModules = new Mongo.Collection('mlModules');

MlModulesSchema = new SimpleSchema({
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
MlCollections['MlModules'] = MlModules;
