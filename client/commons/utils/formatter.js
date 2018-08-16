import isArray from 'lodash/isArray';
import moment from 'moment';
/**
 * This method Formats the array string values
 * @param data:String/Array
 * @param this:Object eg:{returnValueOnNull:'All'} custom value to be returned
 * returns resultant formatted value
 */
export function stringTitleFormatter(data){
  let formatterData=data&&isArray(data)&&data.length>0?data:null;
  if(formatterData){
       return `${formatterData.join()}`;
  }else{
    return data;
  };
}
export function stringTitleAllFormatter(data){
  let formatterData=data&&isArray(data)&&data.length>0?data:null;
  if(formatterData){
    return `${formatterData.join()}`;
  }else{
    return 'All';
  };
}

/**
 * This method Formats the date to String
 * @param data:Date
 * returns resultant formatted value
 */
export function dateTitleFormatter(data){
  if(data){
    return moment(data).format(Meteor.settings.public.dateFormat);
  }else{
    return data;
  };
}

