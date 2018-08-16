import BugReport from '../../../commons/containers/bugReport/MlBugReportComposer';
import React from 'react';
import {client} from '../../core/apolloConnection';

/**
 * Method :: anonymous
 * Desc   :: wraps the generic BugReport component with apollo connection for admin
 * @returns  {<React.Component>}
 */
export default ()=>{
  return <BugReport  connection={client}/>;
}
