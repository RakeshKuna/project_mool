/**
 * Created by venkatasrinag on 3/4/17.
 */
import SimpleSchema from 'simpl-schema';

MlPortfolioLibrary = new Mongo.Collection('mlPortfolioLibrary');

MlPortfolioLibrarySchema = new SimpleSchema({
      fileType:{
          type:String,
          optional:true
      },

      fileName:{
          type:String,
          optional:true
      },

      fileUrl:{
          type:String,
          optional:true
      },

      portfolioId:{
          type:String,
          optional:true
      },

      isActive:{
          type:Boolean,
          optional:true
      }
})

MlPortfolioLibrary.attachSchema(MlPortfolioLibrarySchema);
