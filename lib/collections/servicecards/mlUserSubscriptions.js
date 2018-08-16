/**
 * Created by venkatsrinag on 7/6/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

MlUserServiceCards = new Mongo.Collection('mlUserServiceCards');

UserSubscriptionSchema = new SimpleSchema({
    userId:{
        type:String,
        optional:true
    },

    resId:{
        type:String,
        optional:true
    },

    resType:{
        type:String,
        optional:true
    },

    transactionId:{
        type:String,
        optional:true
    },

    profileId:{
        type:String,
        optional:true
    },

    serviceCardId:{
        type:String,
        optional:true
    },

    serviceCardType:{
        type:String,
        optional:true
    },

    startDate:{
        type:Date,
        optional:true
    },
    endDate:{
        type:Date,
        optional:true
    },

    isActive:{
        type:Boolean,
        optional:true
    }
});


MlUserServiceCards.attachSchema(UserSubscriptionSchema);
MlCollections['MlUserServiceCards'] = MlUserServiceCards;
