import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
// import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
const Rating = require('react-rating');
import _ from "lodash";
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import MlLoader from '../../../../../../../commons/components/loader/loader';

const KEY = 'rating'

class MlStartupRating extends Component {
  constructor(props, context) {
    super(props);
    // console.log(this.props);
    this.state = {
      loading: true,
      data: this.props.ratingDetails || {},
      privateKey: {}
    }
    this.onRatingChange.bind(this);
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentWillMount() {

    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.rating);
    if (!empty) {
      this.setState({loading: false, data: this.context.startupPortfolio.rating}, () => {
        this.lockPrivateKeys();
      });
    } else {
      this.setState({loading: false}, () => {
        this.lockPrivateKeys();
      })
    }

    // this.setState({ loading: false },()=>{
    //   this.lockPrivateKeys();
    // })
  }

  lockPrivateKeys() {
    const privateValues = this.state.data.privateFields;
    const filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName})
    const filterRemovePrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName})
    const finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    const keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onClick(fieldName, field, e) {
    let isPrivate = false;
    const className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true;
    }

    var privateKey = {
      keyName: fieldName,
      booleanKey: field,
      isPrivate: isPrivate,
      tabName: KEY
    }
    this.setState({privateKey: privateKey}, function () {
      this.sendDataToParent()
    })
  }

  onRatingChange(rate) {
    let details = this.state.data;
    details = _.omit(details, "rating");
    details = _.extend(details, {"rating": rate});
    this.setState({data: details}, function () {
      this.sendDataToParent()
    })
  }

  sendDataToParent() {
    let data = this.state.data;
    data = _.omit(data, ["privateFields"]);
    this.props.getStartupRating(data, this.state.privateKey)
  }

  render() {
    let rating = parseInt(this.state.data && this.state.data.rating ? this.state.data.rating : 4);
    const showLoader = this.state.loading;
    return (
      <div className="requested_input">
        {showLoader === true ? (<MlLoader/>) : (
          <div className="col-lg-12">
            <div className="row">
              <h2>Add Rating</h2>
              <div className="panel panel-default panel-form">
                <div className="panel-body">
                  <div className="form-group nomargin-bottom">
                    <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isRatingPrivate"
                                 onClick={this.onClick.bind(this, "rating", "isRatingPrivate")}/>
                    <div className="star_ratings">
                      <Rating
                        empty="fa fa-star-o empty"
                        full="fa fa-star fill"
                        fractions={2}
                        initialRate={rating}
                        onChange={this.onRatingChange.bind(this)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    )
  }
}

MlStartupRating.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};


// const mapStateToProps = (state, ownProps) => {
//   return {
//     keys: state.mlStartupEditTemplateReducer.privateKeys
//   };
// }
//
// export default connect(mapStateToProps)(MlStartupRating);
export default MlStartupRating;
