/**
 * Created by venkatasrinag on 4/4/17.
 */
import SimpleSchema from 'simpl-schema';


MlPortfolioMenu = new Mongo.Collection('mlPortfolioMenu');

MlPortfolioMenuSchema = new SimpleSchema({
    communityType:{
        type:String,
        optional:false
    },
    templateName:{
        type:String,
        optional:false
    },
    menu:{
       type:Array,
       optional:true,
       blackbox:true
    },
    'menu.$':{
        type:Object,
       optional:true,
       blackbox:true
    }
})



MlPortfolioMenu.attachSchema(MlPortfolioMenuSchema);
