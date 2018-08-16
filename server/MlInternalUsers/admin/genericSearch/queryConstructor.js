
export function searchFunction(args) {
  let query={};
  let ary=[];
  let filterArray = []
  let fieldsArgs=args.fieldsData||[];
  _.each(fieldsArgs,function (s,v) {
    let json={};
    if(s.operator == "$and"){
      if(s.fieldType == "List"){
        if(s.value){
          json[s.fieldName]={$in: [s.value]}
        }

      }else if(s.fieldType == "Date"){
        if(s.value){
          let dateObject =  JSON.parse(s.value)
          json[s.fieldName]={$gte: new Date(dateObject.$gte),$lte : new Date(dateObject.$lt)}
        }

      }else  if(s.fieldType == "Boolean"){
        let selectedValue = null;
        if(s.value){
          if(s.value==="true"){
            selectedValue=true;
          }else if(s.value==="false"){
            selectedValue=false;
          }else{
            selectedValue=false;
          }
          json[s.fieldName]=selectedValue
        }

      }else{
        if(s.value){
          let regex={$regex:".*"+s.value+".*",$options:"i"};
          json[s.fieldName]=regex
        }
      }
      filterArray.push(json);
    }else if(s.operator == "Starts_With"){
      let regex={$regex:"\^"+s.value.trim()+".*",$options:"i"};
      json[s.fieldName]=regex;
      ary.push(json);
    }else{
      let regex={$regex:".*"+s.value+".*",$options:"i"};
      json[s.fieldName]=regex
      ary.push(json);
    }


  })

  if(ary&&ary.length>0){
    query.$or=ary;
  }
  if(filterArray&&filterArray.length>0){
    query.$and=filterArray;
  }
  return query;
}

export function sortFunction(args) {
  let sortObj={};
  let a={};
  _.each(args.sortData,function (s,v) {
    let sign=null;
    if (s.sort=='desc'){
      sign = -1;
    }else if(s.sort=='asc'){
      sign=1;
    }
    a[s.fieldName]=sign;
  });
  sortObj=a;
  return sortObj;
}
