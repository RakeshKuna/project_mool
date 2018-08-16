import SimpleSchema from 'simpl-schema';
/**
 * Created by venkatasrinag on 25/1/17.
 */
import MlCollections from '../../common/commonSchemas'

MlActions = new Mongo.Collection('mlActions');

MlActionsSchema = new SimpleSchema({
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
    },
     isAdmin:{
       type:Boolean,
       optional:false
    },
      actionIcon:{
        type:String,
        optional:true
  },
  isProcessAction:{
    type:Boolean,
    optional:true
  },

})

MlActions.attachSchema(MlActionsSchema);
MlCollections['MlActions'] = MlActions;

