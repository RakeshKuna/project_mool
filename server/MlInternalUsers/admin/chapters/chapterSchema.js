import {mergeStrings} from 'gql-merge';
import MlSchemaDef from '../../../commons/mlSchemaDef'
import MlResolver from '../../../commons/mlResolverDef'

let chapterSchema = `
    type Chapter{
        _id:String,
        clusterId:String,
        clusterName: String 
        chapterCode:String,
        chapterName:String,
        displayName:String,
        about:String,
        chapterImage:String,
        stateName:String,
        stateId:String,
        cityId:String,
        cityName:String,
        latitude:Float,
        longitude:Float,
        email:String,
        showOnMap:Boolean,
        isActive:Boolean
        status:status
    }
    
    type status{
      code: String
      description: String
    }
    
    input chapterObject{
        _id:String,
        clusterId:String,
        chapterCode:String,
        clusterName:String,
        chapterCode:String,
        chapterName:String,
        displayName:String,
        about:String,
        chapterImage:String,
        stateName:String,
        stateId:String,
        cityId:String,
        cityName:String,
        latitude:Float,
        longitude:Float,
        email:String,
        showOnMap:Boolean,
        isActive:Boolean
    }
    
    input associatedChapters{ 
        subChapterId:String
    }
    
    type moolyaSubChapterAccess{
      
      externalUser:UserObject
    }
    type UserObject{
      canSearch:Boolean,
      canView:Boolean,
      canTransact:Boolean
    }
    
    type objectiveOutput {
      description: String
      status: Boolean
    }
    
    type contactDetailsOutput{
      addressTypeName : String
      contactNumber: String
      buildingNumber: String,
      street: String,
      landmark: String,
      area: String,
      cityId: String,
      cityName: String,
      stateId: String,
      countryId: String,
      pincode: String,
      latitude: String,
      longitude: String,
    }
  
    type SubChapter{
        _id:String
        clusterId:String
        isDefaultSubChapter:Boolean
        clusterName: String
        chapterId:String
        subChapterUrl : String
        subChapterImageLink:String
        chapterName :String
        stateName : String
        subChapterName :String
        subChapterDisplayName: String
        subChapterCode:String,
        aboutSubChapter: String
        subChapterImageLink: String
        subChapterEmail: String
        isEmailNotified: Boolean 
        showOnMap : Boolean
        isActive: Boolean
        latitude:Float
        longitude:Float
        isBespokeRegistration:Boolean
        isBespokeWorkFlow:Boolean
        userCategoryId : String
        moolyaSubChapterAccess:moolyaSubChapterAccess
        associatedObj : [relatedSubChaptersOutput]
        objective: [objectiveOutput]
        contactDetails: [contactDetailsOutput]
    }
    
    input moolyaSubChapterAccessObject{
      externalUser:UserInputObject,
    }
    input UserInputObject{
      canSearch:Boolean,
      canView:Boolean,
      canTransact:Boolean
    }
    
    input objectiveInput {
     description : String
     status : Boolean
    }
    
    input contactDetailsInput {
      addressTypeName : String
      contactNumber: String
      buildingNumber: String,
      street: String,
      landmark: String,
      area: String,
      cityId: String,
      stateId: String,
      countryId: String,
      pincode: String,
      latitude: String,
      longitude: String,
    }
    
    input subChapterObject{
        subChapterId:String,
        isDefaultSubChapter:Boolean,
        clusterId:String, 
        clusterName:String,
        stateId:String,
        stateName : String,
        chapterId:String,
        chapterName:String,
        subChapterCode:String,
        subChapterName:String,
        subChapterDisplayName:String,
        subChapterUrl:String,
        isUrlNotified:Boolean,
        subChapterEmail:String,
        isEmailNotified:Boolean,
        aboutSubChapter:String,
        subChapterImageLink:String,
        showOnMap:Boolean,
        isActive:Boolean,
        isBespokeRegistration:Boolean,
        latitude:Float,
        longitude:Float,
        isBespokeWorkFlow:Boolean,
        userCategoryId : String
        moolyaSubChapterAccess:moolyaSubChapterAccessObject
        associatedObj : [relatedSubChaptersInput]
        objective : [objectiveInput]
        contactDetails: [contactDetailsInput]
    }
    
    input relatedSubChaptersInput {
      subChapters: [subChaptersInput]
      backendUser: UserInputObject,
      externalUser: UserInputObject,
      isActive : Boolean
    }

    type relatedSubChaptersOutput {
      subChapters : [subChaptersOutput]
      backendUser : UserObject
      externalUser: UserObject
      isActive : Boolean
    }
    
    input subChaptersInput {
      subChapterId: String,
      chapterId : String
    }
    
    type subChaptersOutput {
      subChapterId: String,
      chapterId : String
    }
    
     type SubChapterResponse{
         data:[SubChapter]
    }
    
    type Query{ 
        fetchChapter(clusterId:String, chapterId: String): Chapter
        fetchChapters(id:String):[Chapter]
        fetchChaptersWithoutAll(id:String):[Chapter]
        fetchSubChapter(clusterId: String, chapterId: String, subChapterId: String, communityId: String):SubChapter
        fetchSubChapters(clusterId: String, chapterId: String):SubChapterResponse
        fetchChaptersForMap:[Chapter]
        fetchSubChaptersSelect(id: String,displayAllOption:Boolean):[SubChapter]
        fetchActiveSubChapters:[SubChapter]
        fetchSubChaptersSelectNonMoolya(chapterId: String,clusterId:String, subChapterId : String):[SubChapter]
        fetchActiveClusterChapters(clusters:[String],displayAllOption:Boolean):[Chapter]
        fetchActiveStatesChapters(states:[String],clusters:[String]):[Chapter]
        fetchActiveChaptersSubChapters(chapters:[String],clusters:[String],displayAllOption:Boolean):[SubChapter],
        fetchSubChaptersForRegistration(id: String):[SubChapter]
        fetchSubChaptersSelectMoolya(chapterId: String,clusterId:String):[SubChapter]
        fetchRelatedSubChapters(subChapterId: String): [relatedSubChaptersOutput]
        isSubChapterMoolyaNonMoolya(id : String):SubChapter
        fetchActiveClusterChaptersList(id:[String]):[Chapter]
        fetchActiveSubChapterList(id:[String]):[SubChapter]
    }
    
     type Mutation {
        createChapter(chapter:chapterObject):String
        updateChapter(chapterId:String, chapter:chapterObject):String

        createSubChapter(clusterId:String, chapterId:String, subChapterId:String, subChapter:subChapterObject, moduleName:String, actionName:String):response        
        updateSubChapter(clusterId:String, chapterId:String, subChapterId:String, subChapterDetails:subChapterObject, moduleName:String, actionName:String):response
        createRelatedSubChapters(associatedObj: relatedSubChaptersInput): response
        updateRelatedSubChapters(associatedObj: relatedSubChaptersInput): response
     }
`

MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], chapterSchema]);
let supportedApi = [
    {api:'createChapter', actionName:'CREATE', moduleName:"CHAPTER"},
    {api:'createSubChapter', actionName:'CREATE', moduleName:"SUBCHAPTER"},
    {api:'updateChapter', actionName:'UPDATE', moduleName:"CHAPTER"},
    {api:'updateSubChapter', actionName:'UPDATE', moduleName:"SUBCHAPTER"},
    {api:'fetchChapter', actionName:'READ', moduleName:"CHAPTER"},
    {api:'fetchChaptersWithoutAll', actionName:'READ', moduleName:"CHAPTER", isWhiteList:true},
    {api:'fetchChapters', actionName:'READ', moduleName:"CHAPTER", isWhiteList:true},
    {api:'fetchSubChapter', actionName:'READ', moduleName:"SUBCHAPTER"},
    {api:'fetchSubChaptersSelect', actionName:'READ', moduleName:"SUBCHAPTER", isWhiteList:true},
    {api:'fetchActiveSubChapters', actionName:'READ', moduleName:"SUBCHAPTER", isWhiteList:true},
    {api:'fetchSubChaptersSelectNonMoolya', actionName:'READ', moduleName:"SUBCHAPTER", isWhiteList:true},
    {api:'fetchActiveClusterChapters', actionName:'READ', moduleName:"CHAPTER", isWhiteList:true},
    {api:'fetchActiveStatesChapters', actionName:'READ', moduleName:"CHAPTER"},
    {api:'fetchActiveChaptersSubChapters', actionName:'READ', moduleName:"SUBCHAPTER", isWhiteList:true},
    {api:'fetchSubChaptersForRegistration', actionName:'READ', moduleName:"SUBCHAPTER"},
    {api:'fetchSubChaptersSelectMoolya', actionName:'READ', moduleName:"SUBCHAPTER"},
    {api:'fetchRelatedSubChapters', actionName:'READ', moduleName:"SUBCHAPTER"},
    {api:'updateRelatedSubChapters', actionName:'READ', moduleName:"SUBCHAPTER"},
    {api:'isSubChapterMoolyaNonMoolya', actionName:'READ', moduleName:"SUBCHAPTER", isWhiteList:true},
    {api:'fetchActiveClusterChaptersList', actionName:'READ', moduleName:"CHAPTER", isWhiteList:true},
    {api:'fetchActiveSubChapterList', actionName:'READ', moduleName:"SUBCHAPTER", isWhiteList:true},
]
MlResolver.MlModuleResolver.push(supportedApi)

// backendUser:UserInputObject,
// backendUser:UserObject
