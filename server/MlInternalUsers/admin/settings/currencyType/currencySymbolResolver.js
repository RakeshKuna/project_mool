/**
 * Created by sravani on 3/7/17.
 */
import MlResolver from '../../../../commons/mlResolverDef'
MlResolver.MlQueryResolver['fetchCurrencySymbol'] = (obj, args, context, info) =>{
  let currency;
  currency =  MlCurrencyType.find({isActive: true}).fetch();
  let currencySymbol = [];
    for(i=0;i<currency.length;i++){
      currencySymbol.push({"_id" : currency[i]._id,"currencyCode" :currency[i].currencyCode+' '+ currency[i].symbol_native})
    }
    return currencySymbol;
}
