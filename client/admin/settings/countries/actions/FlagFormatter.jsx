import React from 'react';
class FlagFormatter extends React.Component {

  onChange(data) {
    alert(data?data.userName:"");
  }

  render() {
    return (
     <img src={Meteor.settings.public.countriesFlagBaseUrl+this.props.data.url}/>
      );
  }
};

export default FlagFormatter;
