import BugReport from '../../../commons/containers/bugReport/MlBugReportComposer';
import React from 'react';
import {appClient} from '../../core/appConnection';

/**
 * Method :: anonymous
 * Desc   :: wraps the generic BugReport component with apollo connection for app
 * @returns  {<React.Component>}
 */
export default ()=>{

  return <BugReport  connection={appClient}/>;
}
