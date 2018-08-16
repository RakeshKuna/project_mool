var specialchar_list = ['!','@','#','$','%','^','&','*','(',')','-','_','=','+','{','}','[',']'];
export default function passwordSAS_validate(field_data, all_data){
  var validation={isValid:true};
  var passcount=0;

  if  (/[A-Z]+/.test(field_data)){
    passcount = passcount + 1;
  }

  if  (/[a-z]+/.test(field_data)){
    passcount = passcount + 1;
  }

  if  (/[0-9]+/.test(field_data)){
    passcount = passcount + 1;
  }

  var i = field_data.length;
  while (i--) {
    var char=field_data[i];
    if(specialchar_list.indexOf(char)>=0){
      passcount = passcount + 1;
      break;
    }
  }
  if(field_data && passcount>3){
    if(field_data.length<8){
      validation={isValid:false,errCode:417,errorMsg:"Min 8 chars, uppercase , lower case, number and special char mandatory"};
    }

  }else{
    validation={isValid:false,errCode:417,errorMsg:"Min 8 chars, uppercase , lower case, number and special char mandatory"};
  }

  return validation;
}
