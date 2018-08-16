/**
 * Created by venkatasrinag on 9/1/17.
 */
import MoolyaloginContainer from '../containers/loginContainer'
import mlConversationUtils from '../../commons/conversations/utils/mlconversationUtils'

export let loginActionHandler = {
    onLoginFormSubmit(details,callback){
        let logincontainer=MoolyaloginContainer.loginContainer
        logincontainer.login(details.username, details.password, function (result) {
            if(result && result.error){
                console.log(result.reason)
                callback(result.reason)
            }
            else if(result && result.profile && result.profile.isInternaluser == true){
                FlowRouter.redirect("/admin");
                // mlConversationUtils.login(client)
            }

            else if(result && result.profile && result.profile.isExternaluser == true){
                FlowRouter.redirect("/app");
                mlConversationUtils.login()
            }
            mlConversationUtils.buildVersion();
        });
    },
    onLogout(callback){
      let logoutcontainer=MoolyaloginContainer.loginContainer;
      logoutcontainer.logout(callback);
    }
}
