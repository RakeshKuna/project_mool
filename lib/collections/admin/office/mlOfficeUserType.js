/**
 * Created by venkatsrinag on 14/7/17.
 */
import SimpleSchema from "simpl-schema";
import MlCollections from "../../../common/commonSchemas";

MlOfficeUserType = new Mongo.Collection('mlOfficeUserType');
MlOfficeUserTypeSchema = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },

    code: {
      type: String,
      optional: true
    },

    displayName: {
        type: String,
        optional: true
    },

    isActive: {
        type: Boolean,
        optional: true
    }
})

MlOfficeUserType.attachSchema(MlOfficeUserTypeSchema);
MlCollections['MlOfficeUserType'] = MlOfficeUserType;
