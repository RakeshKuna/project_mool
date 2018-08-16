import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {appClient} from '../core/appConnection';
import {ApolloProvider} from 'react-apollo';
import MetaTags from 'react-meta-tags';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import MlAppLayout from '../core/components/MlAppComponent'

const store = createStore(
  combineReducers({
    appRedux: () => ({type: 'App'}),
    // apollo: appClient.reducer(),
  }),
  {}, // initial state
  compose(
    // applyMiddleware(appClient.middleware()),
    // (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  )
);

export default class AppLayout extends Component{
    constructor(props,AppLayoutcontext){
        super(props, AppLayoutcontext);
    }

    render(){
        return(
            <div>
                <MetaTags>
                    <title> {'moolya'}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </MetaTags>
                <ApolloProvider store={store} client={appClient}>
                    <div className="moolya_app">
                        <MlAppLayout {...this.props}/>
                    </div>
                </ApolloProvider>
            </div>
        )
    }
}
