import React, { Component, PropTypes } from 'react';
import { ALL, ACCELERATOR, INCUBATOR, CO_WORKING, OTHERS } from '../../../commons/utils/constants.js';

class MlAppDashboardFilters extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(community) {
        this.props.onStatusChange(community);
    }
    render() {
        return (
            <div>
                <a data-toggle="tooltip" title={ALL.value} data-placement="bottom" className="STU Startups" data-filter="startup">
                    <p className='title'>{ALL.key}</p>
                    <span className="ml my-ml-Startups st" onClick={() => this.handleChange(ALL.value)}></span>
                </a>
                <a data-toggle="tooltip" title={ACCELERATOR} data-placement="bottom" className="STU Startups" data-filter="startup">
                    <p className='title'>{ACCELERATOR}</p>
                    <span className="ml my-ml-Startups st" onClick={() => this.handleChange(ACCELERATOR)}></span>
                </a>
                <a data-toggle="tooltip" title={CO_WORKING} data-placement="bottom" className="IDE Ideators" data-filter="ideator">
                    <p className='title'>{CO_WORKING}</p>
                    <span className="ml my-ml-Ideator id" onClick={() => this.handleChange(CO_WORKING)}></span>
                </a>
                <a data-toggle="tooltip" title={INCUBATOR} data-placement="bottom" className="Service Providers" data-filter="provider">
                    <p className='title'>{INCUBATOR}</p>
                    <span className="ml my-ml-Service-Providers pr" onClick={() => this.handleChange(INCUBATOR)}></span>
                </a>
                <a data-toggle="tooltip" title={OTHERS} data-placement="bottom" className="STU Startups" data-filter="startup">
                    <p className='title'>{OTHERS}</p>
                    <span className="ml my-ml-Startups st" onClick={() => this.handleChange(OTHERS)}></span>
                </a>
            </div>
        );
    }
}

MlAppDashboardFilters.propTypes = {
    onStatusChange: PropTypes.func,
};
export default MlAppDashboardFilters;
