/**
 * Created by venkatsrinag on 28/7/17.
 */
import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import moment from 'moment'
import _ from 'lodash'


MlResolver.MlMutationResolver['createFrequencyType'] = (obj, args, context, info) => {
}

MlResolver.MlMutationResolver['updateFrequencyType'] = (obj, args, context, info) => {
}

MlResolver.MlQueryResolver['fetchFrequencyTypes'] = (obj, args, context, info) => {
  var ft = MlFrequencyType.find({isActive:true}).fetch();
  return ft;
}
