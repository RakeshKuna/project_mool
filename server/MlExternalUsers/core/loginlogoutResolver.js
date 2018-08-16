import {Accounts} from 'meteor/accounts-base'
import {Random} from 'meteor/random';
import _ from 'lodash';
import MlResolver from '../../commons/mlResolverDef';
let getConnection= function (connection) {
  return _.extend({
    id: Random.id(),
    close () {
      // nothing to close here
    }
  },connection);
}

MlResolver.MlMutationResolver['logout'] = (obj, {token}, context, info) => {
  if (token && context.userId) {
    const hashedToken = Accounts._hashLoginToken(token);
    Accounts.destroyToken(context.userId, hashedToken);
  }else{
    return { success: false ,code:400,result:''};
  }
  const connection = getConnection({clientAddress:context.ip,httpHeaders:{'user-agent':context.browser,'host':context.url}});
  Accounts._successfulLogout(connection, context.userId);
  return { success: true ,code:200,result:''};
}
