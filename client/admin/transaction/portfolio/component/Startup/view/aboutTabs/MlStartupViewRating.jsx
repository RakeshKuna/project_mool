/**
 * Created by vishwadeep on 21/8/17.
 */
import React, {Component}  from "react";
var Rating = require('react-rating');
import { initalizeLockTitle } from '../../../../../../../commons/utils/formElemUtil.js';
const FontAwesome = require('react-fontawesome');

export default class MlStartupViewRating extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      privateKey: {}
    }
  }

  componentDidMount() {
    const { privateFields } = this.props.ratingDetails;
    _.each(privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock');
    })
    initalizeLockTitle();
  }

  render() {
    console.log(this.props)
    const rating = parseInt(this.props.ratingDetails && this.props.ratingDetails.rating ? this.props.ratingDetails.rating : 4);
    return (
      <div className="requested_input">
        <div className="col-lg-12">
          <div className="row">
            <h2>Add Rating</h2>
            <div className="panel panel-default panel-form hide_unlock">
              <div className="panel-body">
                <div className="form-group nomargin-bottom">
                  <FontAwesome name='unlock' className="input_icon req_header_icon un_lock" id="isRatingPrivate" />
                  <div className="star_ratings">
                    <Rating
                      empty="fa fa-star-o empty"
                      full="fa fa-star fill"
                      fractions={2}
                      initialRate={rating}
                      readonly={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
