import {logoutActionHandler} from "../actions/logoutAction";
export let loginContainer = {
    login(username, password, callback){
        Meteor.loginWithPassword({username:username},password, function (result)
        {
            if(result && result.error){
                callback(result);
            }
             else{
                var user = Meteor.user();
                 if(user && user.profile){
                   Meteor.logoutOtherClients();
                      callback(user);
                 }
             }
        })
    },
    /*this function is depricated.*/
    depricatedLogout(callback){
        let originalLogout = Meteor.logout;
        Meteor.logout()
        {

            let user = Meteor.user();
            // console.log(user);
            if (user && user.profile && user.profile.isMoolyaBackend === true) {
                originalLogout.apply(Meteor, arguments);
            }

            if(callback) {
              callback();
            }
        }
    },
  logout(callback){
    const localStorageLoginToken = localStorage.getItem('Meteor.loginToken');
    const logoutPromise =  logoutActionHandler(localStorageLoginToken);
    logoutPromise.then(res =>{
      //handle logout success
      if(res&&res.data&&res.data.logout&&res.data.logout.success){
        if(callback)callback();
        //handle logout failure
      }else{

      };
    });

  }
}

