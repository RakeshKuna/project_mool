import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {client} from '../core/apolloConnection';
import {ApolloProvider} from 'react-apollo';
import MlAdminApp from '../core/components/MlAdminApp';
import MetaTags from 'react-meta-tags';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import mlStartupEditTemplateReducer from '../transaction/portfolio/component/Startup/edit/reducer';

const store = createStore(
  combineReducers({
    mlStartupEditTemplateReducer,
  }),
  {}, // initial state
  compose(
    // applyMiddleware(client.middlewareLink()),
    (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  )
);

export default class  AdminLayout extends Component {
  constructor(props,context){
    super(props,context);
  }

  componentDidMount(){

  }
  render(){
    return (
      //To Provide the Apollo Context
      //To Provide Context for Theme,Language and Menu/Role
     <div>
       <MetaTags>
          <title> {'moolya'}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
       </MetaTags>
        <ApolloProvider store={store} client={client}>
          <div className="moolya_admin">
            <MlAdminApp {...this.props}/>

            <ToastContainer hideProgressBar={true} />
          </div>
        </ApolloProvider>
     </div>
    )
  }
}
