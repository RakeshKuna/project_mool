import EmailVerification from '../../app/verification/EmailVerification';
import {mount} from 'react-mounter';

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    // const resp= verifyEmail(params.token);
    // console.log(resp);
    mount(EmailVerification,{token:params.token});
  }
  });

