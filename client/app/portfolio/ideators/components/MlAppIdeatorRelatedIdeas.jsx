import React from "react";
import {render} from "react-dom";
import _ from 'lodash'
import {fetchIdeaActionHandler} from '../actions/ideatorActionHandler'

export default class MlIdeatorRelatedIdeas extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading:true,ideas:[]};
    this.fetchIdeatorIdeas.bind(this)
    return this;
  }

  componentWillMount(){
    const resp = this.fetchIdeatorIdeas();
    return resp
  }
  async fetchIdeatorIdeas() {
    const response = await fetchIdeaActionHandler();
    if(!_.isEmpty(response)){
      this.setState({loading:false, ideas:response})
    }
  }

  selectedIdea(ideaId, portfolioId, e){
    FlowRouter.go('/app/ideator/'+portfolioId);
  }

  render() {
    let that = this;
    return (
      <div className="related_buttons">
        <ul>
          {(that.state.ideas && that.state.ideas.length > 0) ? that.state.ideas.map(function (idea, idx) {
            return (
              <li onClick={that.selectedIdea.bind(that, idea._id, idea.portfolioId)} key={idx}><a href=""><span
                className="ml my-ml-Ideator"></span><br />{idea.title}</a></li>
            )
          }):<li style={{'width':'95%'}} className="notext"><span>No Related Data Available</span></li> }
        </ul>
      </div>
    )
  }
};
