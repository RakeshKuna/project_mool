/*

Meteor.startup(function () {
    var _paq = _paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
        var u="https://piwik.moolya.in/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', '1']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-85219249-1', 'auto');
    ga('send', 'pageview');
});


*/
/**
 * Mobile related changes
 */

var FastClick = require('fastclick');
Meteor.startup(function (){
  const checkAndAskForAccessOfStorage = function (){
    if(cordova.plugins.diagnostic.isExternalStorageAuthorized){
      cordova.plugins.diagnostic.isExternalStorageAuthorized(function(authorized){
        console.log("App is " + (authorized ? "authorized" : "denied") + " access to the external storage");
        cordova.plugins.diagnostic.requestExternalStorageAuthorization(function (){
          console.log("done");
        }, function (error){
          console.log("not done",error);
        });
      }, function(error){
        console.error("The following error occurred: "+error);
      });
    }

  };


  if(Meteor.isCordova){
    checkAndAskForAccessOfStorage();
    /*document.addEventListener("deviceready", function (){
      FastClick.attach(document.body);
    }, false);*/
  }


})
