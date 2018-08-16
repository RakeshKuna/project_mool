import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'

MlDocuments = new Mongo.Collection('mlDocuments');

MlDocumentsSchema = new SimpleSchema({
})

MlDocuments.attachSchema(MlDocumentsSchema);
MlCollections['MlDocuments'] = MlDocuments;

