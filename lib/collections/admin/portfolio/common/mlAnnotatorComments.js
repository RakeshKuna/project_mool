/**
 * Created by venkatasrinag on 3/4/17.
 */
import SimpleSchema from 'simpl-schema';

MlAnnotatorComments = new Mongo.Collection('mlAnnotatorComments');

MlAnnotatorCommentsSchema = new SimpleSchema({
    annotatorId:{
        type:String,
        optional:true
    },

    portfolioId:{
        type:String,
        optional:true
    },

    comment:{
        type:String,
        optional:true
    },
    userId : {
      type:String,
      optional:true
    },
    userName : {
      type:String,
      optional:true
    },
    firstName:{   //isResolved
      type:String,
      optional:true
    },

    lastName:{    //isReopened
      type:String,
      optional:true
    },
    createdAt:{
      type:Date,
      optional : true,
     }
})

MlAnnotatorComments.attachSchema(MlAnnotatorCommentsSchema);
