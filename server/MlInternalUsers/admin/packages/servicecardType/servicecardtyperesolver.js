/**
 * Created by venkatsrinag on 28/7/17.
 */
import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import moment from 'moment'
import _ from 'lodash'


MlResolver.MlMutationResolver['createServiceCardType'] = (obj, args, context, info) => {
}

MlResolver.MlMutationResolver['updateServicecardType'] = (obj, args, context, info) => {
}

MlResolver.MlQueryResolver['fetchServicecardTypes'] = (obj, args, context, info) => {
  var sct = MlServiceCardType.find({isActive:true}).fetch();
  return sct;
}
