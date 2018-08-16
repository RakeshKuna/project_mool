import React from 'react';

export default class CalendarPopOver extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="popover-sm">
        <div className="form-group">
          <span>Updating Calendar Settings will cancel your scheduled appointments.</span>
        </div>
        <div className="ml_btn">
          <a href="" className="save_btn"
            onClick={(e) => { this.props.save(); this.props.toggle(); }}
          >Save</a>
          <a href="" className="cancel_btn"
            onClick={this.props.toggle.bind(this)}
          >Cancel</a>
        </div>
      </div>
    )
  }
}
