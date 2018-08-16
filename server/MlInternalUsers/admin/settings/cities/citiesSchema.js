import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../../commons/mlSchemaDef'
import MlResolver from '../../../../commons/mlResolverDef'

let citiesSchema = `       
    type Cities
    {     
        _id         : String,
        name        : String,
        stateId     : String,
        countryId   : String,
        countryCode : String,
        displayName : String,
        about       : String,
        isActive    : Boolean
    }
    
    input cityObject{
        id         : String,
        name        : String,
        stateId     : String,
        countryId   : String,
        countryCode : String,
        displayName : String,
        about       : String,
        isActive    : Boolean
    }
    
     type citiesSearchResult{
      results:[Cities],
      totalCount:Int
     }
    
    type Query {
        fetchCities: SearchResp
        fetchCity(cityId: String): Cities
        fetchCities:[Cities]
        fetchCitiesPerState(stateId: String):[Cities]
        fetchCitiesPerStates(stateIds: [String], countryId:String):[Cities]
        fetchCitiesPerCountry(countryId: String):[Cities]
        searchCities(searchQuery:String,displayAllOption:Boolean):[Cities]
        fetchCitiesPerCountryAPI(countryId: String,cityName:String,limit:Int):citiesSearchResult
        fetchBrachesOfRegisteredCommunity(searchQuery:String,displayAllOption:Boolean,countryId: [String]):[Cities]
        fetchHeadQuarterOfRegisteredCommunity(searchQuery:String,displayAllOption:Boolean,countryId: String):[Cities]
        
    }
    
    type Mutation {
        updateCity(cityId: String, city:cityObject, moduleName:String, actionName:String):response      
    }
`

MlSchemaDef['schema']=mergeStrings([MlSchemaDef['schema'], citiesSchema]);
let supportedApi = [
  {api:'fetchCities', actionName:'READ', moduleName:"CITIES", isWhiteList:true},
  {api:'fetchCity', actionName:'READ', moduleName:"CITIES"},
  {api:'fetchCitiesPerState', actionName:'READ', moduleName:"CITIES", isWhiteList:true},
  {api:'fetchCitiesPerStates', actionName:'READ', moduleName:"CITIES", isWhiteList:true},
  {api:'fetchCitiesPerCountry', actionName:'READ', moduleName:"CITIES", isWhiteList:true},
  {api:'searchCities', actionName:'READ', moduleName:"CITIES", isWhiteList:true},
  {api:'updateCity', actionName:'UPDATE', moduleName:"CITIES"},
  {api:'fetchBrachesOfRegisteredCommunity', actionName:'READ', moduleName:"CITIES", isWhiteList:true},
  {api:'fetchHeadQuarterOfRegisteredCommunity', actionName:'READ', moduleName:"CITIES", isWhiteList:true},
]
MlResolver.MlModuleResolver.push(supportedApi)

