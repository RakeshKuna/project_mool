/**
 * Created by venkatsrinag on 8/21/17.
 */
import SimpleSchema from 'simpl-schema';

MlConversations = new Mongo.Collection('mlConversations');

MlConversationSchema = new SimpleSchema({
  apiKey:{
    type:String,
    optional: true
  },

  isActive:{
    type:Boolean,
    optional:true
  },
  timestamp: {
    type: Date,
    optional: true,
    defaultValue: new Date()
  }
});


MlConversations.attachSchema(MlConversationSchema);
