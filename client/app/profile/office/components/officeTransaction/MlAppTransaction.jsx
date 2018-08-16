/**
 * Created by vishwadeep on 9/6/17.
 */
import React, {Component} from 'react';
import StepZilla from '../../../../../../client/commons/components/stepzilla/StepZilla'
import MlAppUserBasicInfo from './MlAppUserBasicInfo';

export default class MlAppTransaction extends Component{
  constructor(props){
    super(props);
    return this
  }
  render(){
    const steps =
      [
        {name: 'Basic info', component: <MlAppUserBasicInfo />}
      ]
    return(
      <div>
        <div className='step-progress' >
          <div id="root" >
            <StepZilla steps={steps} stepsNavigation={false} prevBtnOnLastStep={true} />
          </div>
        </div>
        this is a test id :- {this.props.config.id}
      </div>
    )
  }
}
