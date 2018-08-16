/**
 * Created by venkatsrinag on 20/7/17.
 */


import SimpleSchema from "simpl-schema";
import MlCollections from '../../common/commonSchemas'

MlServiceLedger = new Mongo.Collection('mlServiceLedger');

ServiceCardLedgerSchema = new SimpleSchema({
  tasks:{
    type: Array,
    optional: true
  },
  'tasks.$':{
    type: Object,
    optional: true
  },
  'tasks.$.id':{
    type: String,
    optional: true
  },
  'tasks.$.sequence':{
    type: String,
    optional: true
  },
  'tasks.$.sessions':{
    type: Array,
    optional: true
  },
  'tasks.$.sessions.$':{
    type: Object,
    optional: true
  },
  'tasks.$.sessions.$.id':{
    type: String,
    optional: true
  },
  'tasks.$.sessions.$.sequence':{
    type: String,
    optional: true
  },
  'tasks.$.sessions.$.isCompleted':{
    type: Boolean,
    optional: true
  }
})

ServiceLedgerSchema = new SimpleSchema({
  userId:{
    type:String,
    optional:true
  },
  profileId:{
    type:String,
    optional:true
  },
  serviceId:{
    type:String,
    optional:true
  },
  serviceType:{
    type:String,
    optional:true
  },
  serviceCard:{
    type:ServiceCardLedgerSchema,
    optional:true
  }
})

MlServiceLedger.attachSchema(ServiceLedgerSchema);
MlCollections['MlServiceLedger'] = MlServiceLedger;

