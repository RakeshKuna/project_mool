import MlCollections from '../../common/commonSchemas'
import SimpleSchema from 'simpl-schema';

MlNotificationTemplates = new Mongo.Collection('mlNotificationTemplates');

MlNotificationTemplatesSchema = new SimpleSchema({

  type          : { type:String},                 // email/sms/alert/notification
  tempCode      : { type:String,unique:true},                  // Here we need to store the unique template code.
  title         : { type:String,optional:true },                 // its email or sms title
  tempDesc      : { type:String,optional:true },                 // It states more about template description
  isHtmlContent : { type:Boolean,optional:true },                // for email content it is true else false.
  content       : { type: String,optional: true },
  dynamicKeys   : { type:Array,optional:true},
  'dynamicKeys.$':{type:String, optional:true},
  isActive      : { type: Boolean,optional:true },
  updatedBy     : { type: String,optional:true },
  updatedAt     : { type: Date,optional:true},
  createdAt     : { type: Date,optional:true },
  createdBy     : { type: String,optional:true }
});

MlNotificationTemplates.attachSchema(MlNotificationTemplatesSchema);
MlCollections['MlNotificationTemplates'] = MlNotificationTemplates;

