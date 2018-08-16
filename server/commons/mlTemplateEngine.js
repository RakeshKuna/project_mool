

import _ from 'underscore';

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

export default NotificationTemplateEngine= class NotificationTemplateEngine{

  static getNotificationTemplateDefinition(code,type){
    var template= MlNotificationTemplates.findOne({tempCode:code,type:type})||{};
    return template;
  }

  static interpolateTemplateContent(content,reqObj){
    var content=content||'';
    var obj=reqObj||{};
    try{
      var template = _.template(content);
      content=template(obj);
    }catch(e){
    }
    //unescape the content
     content= _.unescape(content);
    return content;
  }

  static fetchTemplateContent(code,type,reqObj){

    /**get template definition*/
    var template=NotificationTemplateEngine.getNotificationTemplateDefinition(code,type);
    var content=template.content||'';

    /**interpolate the content*/
    var interpolatedContent=NotificationTemplateEngine.interpolateTemplateContent(content,reqObj);

    return {tempConfig:template,content:interpolatedContent};

  }

}
