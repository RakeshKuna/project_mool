/**
 * Created by venkatasrinag on 10/1/17.
 */
export let mlValidations = {
    formValidations(elements, errMessages){
        if(elements != null && elements.length > 0){
            for(element of elements)
            {
                if(element instanceof HTMLInputElement && element.required){
                    if(element.checkValidity() == false){
                          let obj = {element:element, errMsg:errMessages[element.name]}
                          obj[element.name] = true;
                          return obj;
                    }
                }
            }
        }
    }
}
