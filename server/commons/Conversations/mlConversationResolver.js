/**
 * Created by venkatsrinag on 8/21/17.
 */
import MlResolver from "../../commons/mlResolverDef";
import MlRespPayload from "../../commons/mlPayload";
import mlConversationsRepo from './mlConversationsRepo'

MlResolver.MlQueryResolver['fetchConversationAuthToken'] = (obj, args, context, info) => {
    var user = Meteor.users.findOne({_id:context.userId});
    if(!user){
      return new MlRespPayload().errorPayload("Invalid User", 400);
    }
    var result = mlConversationsRepo.login(context)
    return result;
}
/**this resolver have no use need to remove it*/
