/**
 * Created by venkatasrinag on 1/2/17.
 */
"use strict";
import _ from 'lodash'

module.exports = class MlRespPayload{
    constructor(){
    }
    successPayload(result, code){
        let response = {};
        response.success = true;
        response.code = code;
        if(typeof result == 'object')
          response.result = JSON.stringify(result);
        else
          response.result = result;
        return response;
    }

    errorPayload(errMsg, code){
        let response = {};
        response.success = false;
        response.code = code;
        response.result = errMsg;
        return response;
    }

    getArrayDifference(a1, a2)
    {

        var result = [], longerLength = a1.length >= a2.length ? a1.length : a2.length;
        var activeDiff = [], inactiveDiff = [];
        if(a1.length == 0 && a2.length == 0)
          return [];

        if(a1.length == 0){
          result.push({difference:[], isActive:false},{difference:a2, isActive:true});
          return result;
        }
        else if(a2.length == 0){
          result.push({difference:a1, isActive:false},{difference:[], isActive:true});
          return result;
        }

        if(a1.length > a2.length || a2.length > a1.length)
        {
            inactiveDiff = _.difference(a1, a2);
            activeDiff = _.difference(a2, a1);
            result.push({difference:inactiveDiff, isActive:false},{difference:activeDiff, isActive:true});
            return result;
        }

        for (i = 0; i < longerLength; i++){
            if ((a1[i] !== a2[i]) && a2[i]!= undefined) {
                a1[i]!= undefined && inactiveDiff.push(a1[i])
                activeDiff.push(a2[i])
            }
        }
        result.push({difference:inactiveDiff, isActive:false},{difference:activeDiff, isActive:true});
        return result;
    }
}
