import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateCityActionHandler(CityDetails) {
  let cityId = CityDetails.id;

  const result = await client.mutate({
    mutation: gql`
    mutation updateCity($cityId:String, $city: cityObject, $moduleName:String, $actionName:String){
      updateCity(
        cityId:$cityId,
        city: $city,
        moduleName:$moduleName,
        actionName:$actionName
      ){
            success,
            code,
            result
        } 
      }
    `,
    variables: {
      cityId:cityId,
      city:CityDetails,
      moduleName:"CITIES",
      actionName:"UPDATE"
    }
  })
  const id = result.data.updateCity;
  return id
}
