/**
 * Created by mohammed.mohasin on 22/05/17.
 */
import moment from 'moment';
import {GraphQLScalarType, GraphQLError, Kind} from 'graphql';

export default MoolyaCustomDateType = new GraphQLScalarType({
  name: 'Date',
  /**
   * Serialize date value into string
   * @param  {moment} value date value
   * @return {String} date as string
   */
  serialize: function (value) {
    if (value && value != 'Invalid date') {
      let date = moment(value);
      if (!date.isValid()) {
        throw new GraphQLError('Field serialize error: value is an invalid Date');
      }
      return date.format();
    } else {
      return value
    }
  },
  /**
   * Parse value into date
   * @param  {*} value serialized date value
   * @return {moment} date value
   */
  parseValue: function (value) {
    if (value && value != 'Invalid date') {
      let date = moment(value, Meteor.settings.public.dateFormat);
      if (!date.isValid()) {
        throw new GraphQLError('Field parse error: value is an invalid Date');
      }
      return date.toDate();
    } else {
      return value
    }

  },
  /**
   * Parse ast literal to date
   * @param  {Object} ast graphql ast
   * @return {moment} date value
   */
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Can only parse strings to date but got: ' + ast.kind);
    }
    let date = moment(ast.value, Meteor.settings.public.dateFormat);
    if (!date.isValid()) {
      throw new GraphQLError('Query error: Invalid date');
    }
    return date.toDate();
  }
});
