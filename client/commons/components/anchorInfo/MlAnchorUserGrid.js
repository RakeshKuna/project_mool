import React, { PureComponent } from 'react';
import ScrollArea from 'react-scrollbar';
import CDNImage from '../CDNImage/CDNImage';
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';

export default class MlAnchorUserGrid extends PureComponent {

  render() {
    const {selectedUserId} = this.props
    return (
      <div>
        {
          !this.props.users.length && <div className={this.props.classNames || 'col-md-6 col-sm-6'} key="1">
            <div className="list_block provider_block">
              <div className="provider_mask">
                <CDNImage className="user_pic" src='/images/def_profile.png' />
              </div>
              <h3>No anchor user</h3>
            </div>
          </div>
        }
        {
          this.props.users.map((user, index) => (
            <div className={this.props.classNames || "col-md-6 col-sm-6"} key={index}>
              <div className={`list_block provider_block ${selectedUserId == user.userId ? "active_block" : null}`} onClick={() => this.props.clickHandler(user.userId)}>
                <div className="provider_mask">
                  <CDNImage className="user_pic" src={user.profileImage ? generateAbsolutePath(user.profileImage) : '/images/def_profile.png'} />
                </div>
                <h3>{user.displayName}</h3>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

MlAnchorUserGrid.propTypes = {
  users: React.PropTypes.array.isRequired,
  clickHandler: React.PropTypes.func,
  classnames: React.PropTypes.string,
};
