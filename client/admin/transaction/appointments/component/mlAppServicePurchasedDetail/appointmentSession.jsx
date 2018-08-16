/**
 * Created by pankaj on 13/9/17.
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar';
var options = [
  { value: 'role', label: 'Role' },
  { value: 'role', label: 'Role' }
];
function logChange(val) {
  console.log("Selected: " + val);
}
function ScheduledBtn(cell, row) {
  return '<a href="#" class="fileUpload mlUpload_btn">Rescheduled</a>';
};
function Info(cell, row) {
  return '<a href="#" class="fileUpload mlUpload_btn">i</a>';
};


const taxes = [{
  id: 1,
  info: 'Session 1st',
  dateTime: '2:00 Hours',
  userId: 'i',
  name: 'Booked',
  tarId: '27/07/2017 : 10:40:00',
  cluster: 'Rescheduled'

},
{
  id: 2,
  info: 'Session 2nd',
  dateTime: '2:00 Hours',
  userId: 'i',
  name: 'Booked',
  tarId: '27/07/2017 : 10:40:00',
  cluster: 'Rescheduled'

},
{
  id: 3,
  info: 'Session 3rd',
  dateTime: '2:00 Hours',
  userId: 'i',
  name: 'Booked',
  tarId: '27/07/2017 : 10:40:00',
  cluster: 'Rescheduled'

},
{
  id: 4,
  info: 'Session 4th',
  dateTime: '2:00 Hours',
  userId: 'i',
  name: 'Booked',
  tarId: '27/07/2017 : 10:40:00',
  cluster: 'Rescheduled'

}
];

class InnerTable extends React.Component {
  render() {
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th scope="row">21st May 2017 <br /> 08:00 am</th>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
            </tr>
            <tr>
              <th scope="row">21st May 2017 <br /> 08:00 am</th>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
            </tr>
            <tr>
              <th scope="row">21st May 2017 <br /> 08:00 am</th>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
              <td>21st May 2017 <br /> 08:00 am</td>
            </tr>
          </tbody>
        </table>
        <div className="clearfix"></div>
        <div className="mart20 text-center"><a href="#" className="fileUpload mlUpload_btn">Book</a> <a href="#" className="fileUpload mlUpload_btn">Cancel</a></div>
      </div>

    );
  }
}

const selectRow = {
  mode: 'checkbox',
  bgColor: '#fff',
  clickToSelect: true, // click to select, default is false
  clickToExpand: true // click to expand row, default is false
};

export default class Appointments extends React.Component {
  componentDidMount() {
    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      sessions: []
    }
  }

  componentWillReceiveProps(nextProps) {
    let sessions = [];
    nextProps.appointment.sessionInfo.forEach((session, index) => {
      sessions.push({
        id: index,
        info: `Session ${index}`,
        dateTime: `${session.duration.hours}:${session.duration.minutes} Hours`,
        userId: nextProps.appointment.client.userId,
        status: session.status,
        tarId: session.startDate,
        cluster: 'Rescheduled'
      })
    });
    this.setState({ sessions });
  }

  isExpandableRow(row) {
    if (row.id <= 1) {
      return true;
    } else {
      return false;
    }
  }

  expandComponent(row) {
    // return (
    //   // <InnerTable data={row.expand} />
    //   ""
    // );
  }
  render() {
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)'
    };
    return (
      <div className="main_wrap_scroll">
        <ScrollArea
          speed={0.8}
          className="main_wrap_scroll"
          smoothScrolling={true}
          default={true}
        >

          <BootstrapTable data={this.state.sessions}
            options={options}
            expandableRow={false}
            expandComponent={this.expandComponent}
            selectRow={selectRow}
          >
            <TableHeaderColumn dataField="id" isKey={true} dataSort={true} width='62px' dataAlign='center'>S.No</TableHeaderColumn>
            <TableHeaderColumn dataField="info">Session</TableHeaderColumn>
            <TableHeaderColumn dataField="dateTime">Time</TableHeaderColumn>
            {/* <TableHeaderColumn dataField="userId" dataFormat={Info}>Info</TableHeaderColumn> */}
            <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
            <TableHeaderColumn dataField="tarId">Date</TableHeaderColumn>
            {/* <TableHeaderColumn dataField="cluster" dataFormat={ScheduledBtn}>Scheduled</TableHeaderColumn> */}
          </BootstrapTable>

        </ScrollArea>
      </div>
    )
  }
}
;
