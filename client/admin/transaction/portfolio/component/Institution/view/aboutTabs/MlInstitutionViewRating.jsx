/**
 * Created by Birendra on 21/8/17.
 */
import React, {Component}  from "react";
const FontAwesome = require('react-fontawesome');
var Rating = require('react-rating');

export default class MlInstitutionViewRating extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      privateKey: {}
    }
  }

  componentDidMount() {
    this.lockPrivateKeys();
  }
  
  lockPrivateKeys() {
    const { privateFields } = this.props.ratingDetails;
    _.each(privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  render() {
    console.log(this.props)
    let rating = parseInt(this.props.ratingDetails && this.props.ratingDetails.rating ? this.props.ratingDetails.rating : 4);
    return (
      <div className="requested_input">
        <div className="col-lg-12">
          <div className="row">
            <h2>Add Rating</h2>
            <div className="panel panel-default panel-form">
              <div className="panel-body hide_unlock">
                <div className="form-group nomargin-bottom">
                  <div className="star_ratings">
                    <Rating
                      empty="fa fa-star-o empty"
                      full="fa fa-star fill"
                      fractions={2}
                      initialRate={rating}
                      readonly={true}
                    />
                  </div>
                  <FontAwesome name='unlock' className="input_icon" id="isRatingPrivate" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
