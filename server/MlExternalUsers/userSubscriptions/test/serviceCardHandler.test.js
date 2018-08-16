/**
 * Created by venkatsrinag on 19/7/17.
 */
<<<<<<< Updated upstream
const mlPayload = require('../mlPayload.js');
=======

import mlserviceCardHandler from '../serviceCardHandler'

describe('Service Card Handler', function () {
    beforeEach(function () {
    });

    // it("should return correct response from validateResource", function () {
    //     var query         = "";
    //     var context       = "";
    //     var bodyVariables = {}
    //     msc.validateResource(query, context, bodyVariables);
    // });

    it("should return exception from validateResource", function () {
        var query         = "";
        var context       = "";
        var bodyVariables = {}
        mlserviceCardHandler.validateResource(query, context, bodyVariables);
    });

    it("should return correct response from getQueryDetails", function () {

    });
})
>>>>>>> Stashed changes
