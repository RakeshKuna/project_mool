/**
 * Created by venkatsrinag on 28/4/17.
 */
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import bodyParser from 'body-parser';
import express from 'express';
import _ from 'lodash';
import mlConversationsRepo from '../commons/Conversations/mlConversationsRepo'

import getContext from '../commons/mlAuthContext'
import MlResolver from '../commons/mlResolverDef';
import MlSchemaDef from '../commons/mlSchemaDef';
import MlRespPayload from '../commons/mlPayload';
import mlserviceCardHandler from '../MlExternalUsers/userSubscriptions/serviceCardHandler'
import mlNotificationRepo from '../mlNotifications/mlNotificationRepo';

let cors = require('cors');
let multipart 	= require('connect-multiparty'),
    fs 			    = require('fs'),
    multipartMiddleware = multipart();

const resolvers=_.extend({Query: MlResolver.MlQueryResolver,Mutation:MlResolver.MlMutationResolver},MlResolver.MlUnionResolver,MlResolver.MlScalarResolver);
const typeDefs = MlSchemaDef['schema']
const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});
var qs = require('querystring');
var crypto = require('crypto');

// default server configuration object
const defaultServerConfig = {
  path: '/moolya',
  configServer: graphQLServer => {},
  graphiql: Meteor.isDevelopment,
  graphiqlPath: '/graphiqlApp',
  conversationPath: '/conversationlogin',
  paymentReturnUrlPath:'/moolyaPaymentStatus',
  userPushNotification:'/userPushNotification',
  graphiqlOptions : {
    passHeader : "'meteor-login-token': localStorage['Meteor.loginToken']"
  },
};

// default graphql options to enhance the graphQLExpress server
const defaultGraphQLOptions = {
  context: {},
  formatError: e => ({
    message: e.message,
    locations: e.locations,
    path: e.path
  }),
  debug: Meteor.isDevelopment,
};


export const createApolloServer = (customOptions = {}, customConfig = {}) =>
{
    const config = {
      ...defaultServerConfig,
      ...customConfig,
    };

    if (customConfig.graphiqlOptions) {
        config.graphiqlOptions = {
          ...defaultServerConfig.graphiqlOptions,
          ...customConfig.graphiqlOptions
        }
    }
    const graphQLServer = express();
    config.configServer(graphQLServer)
    graphQLServer.use(config.path, bodyParser.json(), graphqlExpress(async (req, res) =>
    {
        try {
            const customOptionsObject = typeof customOptions === 'function' ? customOptions(req) : customOptions;
            const options = {
               ...executableSchema,
               ...defaultGraphQLOptions,
               ...customOptionsObject,
            };
          // var context = getContext({req});
          var context = getContext({req});

            if(!context||!context.userId){
              res.json({ invalidToken: true, message: "Invalid Token"})
              return;
            }

            let ret = mlserviceCardHandler.validateResource(req.body.query, context, req.body.variables);
            if(!ret.success){
                var response = new MlRespPayload().errorPayload(ret.msg, 400);
                res.json({data:{data:response}})
                return
            }
            return {
                schema  : executableSchema,
                context : context
            }
        }catch (error){
            console.error('[Meteor Apollo Integration] Something bad happened when handling a request on the GraphQL server. Your GraphQL server is not working as expected:', error);
            return defaultGraphQLOptions;
        }
    }));

    if (config.graphiql){
        graphQLServer.use(config.graphiqlPath, graphiqlExpress({
            ...config.graphiqlOptions,
            endpointURL: config.path,
        }));
    }
    //context = getContext({req});
    // return url for payment gateway, Need to send transcation type on payment
    if(config.paymentReturnUrlPath){
      graphQLServer.options(config.paymentReturnUrlPath, cors());
        graphQLServer.post(config.paymentReturnUrlPath, bodyParser.json(), Meteor.bindEnvironment( function (req, res){
        if(req){
            var body = "";
            req.on("data", function (data) {
              body += data;
            });
            req.on("end", async function () {
              try {
                // context = await getContext({req});
                let user = mlDBController.findOne('users', {"profile.email": 'systemadmin@moolya.global'}, context) || {};
                let context = {
                  ip: req.headers['x-forwarded-for']||req.headers['X-Forwarded-For'],
                  url: req.headers['referer']
                }
                context.userId = user._id;context.url=Meteor.absoluteUrl("");context.browser="server";
                var post = qs.parse(body);
                var data_string = post['TxId'] + post['TxStatus'] + post['amount']
                  + post['pgTxnNo'] + post['issuerRefNo'] + post['authIdCode']
                  + post['firstName'] + post['lastName'] + post['pgRespCode'] + post['addressZip'];
                var signature = crypto.createHmac('sha1', '22b7cc7ea856cd35e42c2ed6a76eff8e2f27a470').update(data_string).digest('hex');
                if (signature == post['signature']) {
                  let payObj={
                    "transID":post.TxId,
                    "paymentStatus":post.TxStatus,
                  };
                  let response = MlResolver.MlMutationResolver['updatePayment'](null, payObj, context, null);
                  if(response){
                      //res.redirect(Meteor.absoluteUrl()+"app/transaction",{query:{"status":post.TxStatus}});
                    const query = qs.stringify({
                      "status":post.TxStatus
                    });
                    if(post && post.TxStatus && post.TxStatus.toLowerCase() == "canceled"){
                      res.redirect(Meteor.absoluteUrl()+"app/payOfficeSubscription/"+response+"?"+query);
                    }else{
                      res.redirect(Meteor.absoluteUrl()+"app/transaction?"+query);
                    }

                  }
                }
                else {
                  //res.writeHead(403, { "Content-Type": "text/html" });
                  let code = 403;
                  var error = { "error" : "Transaction Failed", "message": "Signature Verification Failed" };

                  let result = {message:"The request did not have valid authorization credentials"}
                  let response = new MlRespPayload().errorPayload(result, code);
                  res.send(response);
                }
                res.end();
              }
              catch (err2) {
                console.log(err2);
              }
            })
            /*let data = req.body;
            let apiKey = req.header("apiKey");
            // console.log(data);
            if(apiKey&&apiKey==="741432fd-8c10-404b-b65c-a4c4e9928d32"){
              console.log(data);
              let response = MlResolver.MlMutationResolver['updatePayment'](null, data, context, null);
              res.send(response);
            }else{
              let code = 401;
              let result = {message:"The request did not have valid authorization credentials"}
              let response = new MlRespPayload().errorPayload(result, code);
              console.log(response);
              res.send(response);
            }*/
          }else {
            res.send(new MlRespPayload().errorPayload("Request Payload not provided", 400));
          }
        }))
    }

    if(config.conversationPath){
      graphQLServer.options(config.conversationPath, cors());
      graphQLServer.post(config.conversationPath, bodyParser.json(), Meteor.bindEnvironment(function (req, res){
        var context = getContext({req});
        mlConversationsRepo.login(context, function (ret) {
          res.send(ret)
        });

      }))
    }

    if(config.userPushNotification){
      graphQLServer.options(config.userPushNotification, cors());
      graphQLServer.post(config.userPushNotification, bodyParser.json(), Meteor.bindEnvironment(function (req, res){
        var context = getContext({req});
        context.firebaseId = req.body.firebaseId;
        context.isAllowedNotifications = req.body.isAllowedNotifications;
        mlNotificationRepo.updateFirebaseId(context, function(result){
          res.send({success:true});
        })
      }))
    }
    WebApp.connectHandlers.use(Meteor.bindEnvironment(graphQLServer));
}
createApolloServer(defaultGraphQLOptions, defaultServerConfig);
