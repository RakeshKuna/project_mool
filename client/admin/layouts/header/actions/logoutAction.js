import {loginActionHandler} from '../../../../login/actions/loginActions';


export function logout() {
  loginActionHandler.onLogout(function(){
    // FlowRouter.go("/login");
    FlowRouter.go("/logout");
  });
}
