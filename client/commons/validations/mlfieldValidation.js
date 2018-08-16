var Select = require('react-select');
// import {isValidNumber, format} from 'libphonenumber-js';
var PhoneNumber = require( 'awesome-phonenumber' );

//import Moolyaselect from '../../commons/containers/select/MlSelectComposer'
export function mlFieldValidations(elements) {
  for (var  key in  elements) {
    let element = elements[key];
    if (element instanceof Select) {
      {
        var selectObj = element;
        let isRequired = selectObj.props['data-required'];
        let value = selectObj.props['value']
        if (isRequired && !value) {
          return selectObj.props['data-errMsg']
        }

      }
    }else if(element instanceof Object &&  element['props'] instanceof Object && element['props']!==undefined){
      var selectObj = element;
      var isRequired = selectObj.props['data-required'];
       var value = selectObj.props['selectedValue']?selectObj.props['selectedValue']:selectObj.props['value'];
      if (typeof value !== 'object' && !value){
        value = selectObj.props['defaultValue'] ? selectObj.props['defaultValue'] : null                                /**case for the date-time required field*/
        var  multi= selectObj.props['multiSelect']

        if (isRequired && multi) {
          return selectObj.props['data-errMsg']
        }else if (isRequired && !value) {
          return selectObj.props['data-errMsg']
        }
      }else if(typeof value === 'object' && !value || (value && !value.length)){
        value = selectObj.props['defaultValue'] ? selectObj.props['defaultValue'] : null                                /**case for the date-time required field*/
        var  multi= selectObj.props['multiSelect']

        if (isRequired && multi) {
          return selectObj.props['data-errMsg']
        }else if (isRequired && !value) {
          return selectObj.props['data-errMsg']
        }
      }
       


    }
    else if (element && element.getAttribute('data-required') && !element.value) {
        return element.getAttribute('data-errMsg');
      }
  }

}

/**
 * Validate the phone number based on country code
 * @param countryCode
 * @param contactNumber
 * @return {boolean}
 */
export function validatedPhoneNumber(countryCode, contactNumber){
  let isValidPhoneNumber = true;
  if (contactNumber) {
    // isValidPhoneNumber = isValidNumber(format({country: countryCode, phone: contactNumber }, 'International'));
    //var pn = new PhoneNumber( `0${contactNumber}`, countryCode);
    var cCode = PhoneNumber.getCountryCodeForRegionCode(countryCode);
    var regionCode = PhoneNumber.getRegionCodeForCountryCode(cCode);
    var pn = new PhoneNumber(contactNumber, regionCode );
    isValidPhoneNumber = pn.isValid( );
  }
  return isValidPhoneNumber;
}

/**
 * Validate the phone number based on country code
 * @param countryCode
 * @param contactNumber
 * @return {boolean}
 */
export function validatedPhoneNumber_strict(countryCode, contactNumber){
  let isValidPhoneNumber = false;
  if (contactNumber  && countryCode) {
    var cCode = PhoneNumber.getCountryCodeForRegionCode(countryCode);
    var regionCode = PhoneNumber.getRegionCodeForCountryCode(cCode);
    var pn = new PhoneNumber(contactNumber, regionCode );
    isValidPhoneNumber = pn.isValid( );
  }
  return isValidPhoneNumber;
}

export function validatedEmailId(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validatedURL(value){
  //var url = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
  var url = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
  return url.test(value);
}

export function isUrl(s) {
  if (!isUrl.rx_url) {
    isUrl.rx_url=/^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    isUrl.prefixes=['http:\/\/', 'https:\/\/', 'ftp:\/\/', 'www.'];
    isUrl.domains=['com','ru','net','org','de','jp','uk','br','pl','in','it','fr','au','info','nl','ir','cn','es','cz','kr','ua','ca','eu','biz','za','gr','co','ro','se','tw','mx','vn','tr','ch','hu','at','be','dk','tv','me','ar','no','us','sk','xyz','fi','id','cl','by','nz','il','ie','pt','kz','io','my','lt','hk','cc','sg','edu','pk','su','bg','th','top','lv','hr','pe','club','rs','ae','az','si','ph','pro','ng','tk','ee','asia','mobi'];
  }

  if (!isUrl.rx_url.test(s)) return false;
  for (let i=0; i<isUrl.prefixes.length; i++) if (s.startsWith(isUrl.prefixes[i])) return true;
  for (let i=0; i<isUrl.domains.length; i++) if (s.endsWith('.'+isUrl.domains[i]) || s.includes('.'+isUrl.domains[i]+'\/') ||s.includes('.'+isUrl.domains[i]+'?')) return true;
  return false;
}
