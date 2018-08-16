var noData = "not mentioned";


// Will insert SEO-URL in Database
const MlSiteMapInsertion = class MlSiteMapInsertion {


  static  mlCreateSEOUrl(siteMapDetails, urlFormationObject) {

    let uniqueSeoName = siteMapDetails.uniqueSeoName;
    let seoUrl = urlFormationObject.clusterName + '/' + urlFormationObject.chapterName + '/' + urlFormationObject.subChapterName + '/' + urlFormationObject.communityName + '/' + uniqueSeoName;
    let siteMapUrl = Meteor.absoluteUrl() + seoUrl;
    seoUrl = '/' + seoUrl;
    siteMapDetails.originalUrl = seoUrl;
    siteMapDetails.siteMapUrl = siteMapUrl;
    siteMapDetails.seoUrl = seoUrl;


    try {
      let siteMapExistsCount = MlSitemap.find({seoUrl: seoUrl}).count();
      if ( siteMapExistsCount === 0) {

        let seoUrlCount = MlSitemap.find({originalUrl: seoUrl}).count();
        if (seoUrlCount > 0) {
          siteMapDetails.seoUrl = seoUrl + '-' + seoUrlCount;
          siteMapDetails.siteMapUrl = siteMapUrl + '-' + seoUrlCount;
          MlSiteMapInsertion.mlUpdateSiteMap(siteMapDetails);
        } else {
          MlSiteMapInsertion.mlUpdateSiteMap(siteMapDetails);
        }


      } else {

        MlSiteMapInsertion.mlUpdateSiteMap(siteMapDetails);
      }
    } catch (e) {
      console.log("Error" + e);
    }


  }

  static  mlUpdateSiteMap(siteMapDetails) {

    MlSitemap.update(
      {portFolioId: siteMapDetails.portFolioId},
      {
        $set: siteMapDetails
      },
      {upsert: true}
    )
  }


}

export default MlSiteMapInsertion;




