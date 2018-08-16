/**
 * Created by venkatsrinag on 28/7/17.
 */
import {mergeStrings} from "gql-merge";
import MlSchemaDef from "../../../../commons/mlSchemaDef";
import MlResolver from "../../../../commons/mlResolverDef";

let officePackage = `

  type ApplicableCommunity{
    communityName:String,
    communityId:String
  }
  
  type Cluster{
    clusterId:String,
    clusterName:String,
  }
  
  type Chapter{
    chapterId:String,
    chapterName:String,
  }
  
  type SubChapter{
    subChapterId:String,
    subChapterName:String,
  }

  type OfficePackage{
    _id:String,
    serviceCardName:String,
    displayName:String,
    cardType:String,
    frequencyType:String,
    officeAbout:String,
    termsConditions:String,
    validFrom:Date,
    validTo:Date,
    accountType:String,
    officePic:String,
    isMoolya:Boolean,
    isOthers:Boolean,
    isActive:Boolean,
    applicableCommunity:[ApplicableCommunity],
    totalCount:Int,
    principalUserCount:Int,
    teamUserCount:Int,
    availableCommunities:[AvailableCommunities]
    clusters : [Cluster],
    chapters : [Chapter],
    subChapters: [SubChapter],
    barerCount:Int
    isBSpoke :Boolean
  }
  
  input applicableCommunity{
    communityName:String,
    communityId:String
  }
  
  input cluster{
    clusterId:String,
    clusterName:String,
  }
  
  input chapter{
    chapterId:String,
    chapterName:String,
  }
  
  input subChapter{
    subChapterId:String,
    subChapterName:String,
  }

  input officePackage{
    serviceCardName:String,
    displayName:String,
    cardType:String,
    frequencyType:String,
    officeAbout:String,
    termsConditions:String,
    validFrom:Date,
    validTo:Date,
    accountType:String,
    officePic:String,
    isMoolya:Boolean,
    isOthers:Boolean,
    isActive:Boolean,
    applicableCommunity:[applicableCommunity],
    totalCount:Int,
    principalUserCount:Int,
    teamUserCount:Int,
    availableCommunities:[availableCommunities]
    clusters     : [cluster],
    chapters     : [chapter],
    subChapters  : [subChapter],
    barerCount:Int
  }
  
  type Query{
    fetchOfficePackages:[OfficePackage],
    fetchOfficePackageById(officePackageId:String):OfficePackage
  }
  
  type Mutation{
    createOfficePackage(package:officePackage):response
    updateOfficePackage(package:officePackage, packageId:String):response
  }
`
MlSchemaDef['schema'] = mergeStrings([MlSchemaDef['schema'], officePackage]);

let supportedApi = [
    {api: 'createOfficePackage', actionName:'CREATE', moduleName: "OFFICEPACKAGE"},
    {api: 'updateOfficePackage', actionName:'UPDATE', moduleName: "OFFICEPACKAGE"},
    {api: 'fetchOfficePackages', actionName:'READ', moduleName: "OFFICEPACKAGE", isWhiteList:true},
    {api: 'fetchOfficePackageById', actionName:'READ', moduleName: "OFFICEPACKAGE", isWhiteList:true},
]

MlResolver.MlModuleResolver.push(supportedApi)
