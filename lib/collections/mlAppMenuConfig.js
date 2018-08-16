/**
 * Created by venkatsrinag on 9/6/17.
 */
import SimpleSchema from 'simpl-schema';

MlAppMenuConfig = new Mongo.Collection('mlAppMenuConfig');

MlExternalUserMenuConfigSchema = new SimpleSchema({

    communityCode:{
        type:String,
        optional:true
    },

    communityName:{
        type:String,
        optional:true
    },

    menuName:{
        type:String,
        optional:true
    },

    isProfileMenu:{
        type:Boolean,
        optional:true
    },

    isExploreMenu:{
        type:Boolean,
        optional:true
    },

    isActive:{
        type:Boolean,
        optional:true
    }
});

MlAppMenuConfig.attachSchema(MlExternalUserMenuConfigSchema);
