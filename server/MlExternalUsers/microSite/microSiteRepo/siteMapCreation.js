/**
 * Created by kanwarjeet on 9/22/17.
 */

import _ from 'lodash'
async function getSiteMapUrls() {


  let urls = [];
  const siteMapUrls = MlSitemap.find({},{sort:{"$natural": 1}}).fetch();
  _.forEach(siteMapUrls, (sMapUrl) => {
    urls.push({
      url: '/view' +sMapUrl.seoUrl,
      changefreq: sMapUrl.changeFreq,
      priority: sMapUrl.priority,
      lastmodISO: sMapUrl.lastmodISO?sMapUrl.lastmodISO:'2015-06-27T15:30:00.000Z'
    })
  })
  return urls
}
export  default  getSiteMapUrls;
