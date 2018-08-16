/**
 * Created by venkatasrinag on 28/1/17.
 */
import {graphql} from 'react-apollo';
import response from './mlResponse'
import gql from 'graphql-tag';

const mlRequest = class mlRequestHandler{
    constructor(){
    }

    query(Query, variables){
        return graphql(Query)(response);
    }
}

module.exports = mlRequest;
