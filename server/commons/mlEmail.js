/**
 * Created by venkatasrinag on 6/1/17.
 */
"use strict";


//TODO: Remove the dependency of Meteor Email Package and use NodeMailer(npm) package.
var from = Meteor.settings.private.fromEmailAddr;
Meteor.startup(function () {
  //console.log(encodeURIComponent("qasmtp@moolya.in"));
  process.env.MAIL_URL = Meteor.settings.private.smtpMailUrl;
});


var sendEmailViaNotificationEngine = function (bodyEmail) {
  var request = require("request");

  var options = {
    method: 'POST',
    url: Meteor.settings.private.notificationEngineURL + '/email/send',
    headers:
      {
        accesskey: Meteor.settings.private.notificationEngineAccessKey,
        'content-type': 'application/json'
      },
    body: bodyEmail,
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });

}

class SmtpEmail {
  constructor() {
    this._createEmailJSON.bind(this);
    this._createEmailHTML.bind(this);
    this._createEmailAttachment.bind(this);
  }

  send(email) {
    Email.send(this._createEmailJSON(email));
  };

/**
 * 
 * @param {*} email 
 * @todo {*} reverted to the old code.
 */
  sendHTML(email) {

    // sendEmailViaNotificationEngine(this._createEmailHTML(email));
    Email.send(this._createEmailHTML(email));
  };

  sendAttachment(email) {
    Email.send(this._createEmailAttachment(email));
  };

  _createEmailJSON(email) {
    return {
      "from": email.from || from,
      "to": email.to,
      "subject": email.subject,
      "text": email.text
    };
  };

  _createEmailHTML(email) {
    let response = {
      "from": email.from || from,
      "to": email.to,
      "subject": email.subject,
      "html": email.html
    }
    if (email.cc)
      response.cc = email.cc
    return response
    // return {
    //   "from": email.from || from,
    //   "to": email.to,
    //   "subject": email.subject,
    //   "html": email.html
    // }
  };

  _createEmailAttachment(email) {
    var emailConfig = {
      "from": email.from || from,
      "to": email.to,
      "subject": email.subject,
      attachments: [{contents: email.content, contentType: email.contentType, fileName: email.fileName}]
    }
    if (email.cc) {
      emailConfig.cc = email.cc;
    }
    return emailConfig;
  };
}


class eMailObjectCreation {
  createJson(email) {
    check(email, Object);
    return {
      "message": {
        "text": email.text,
        "subject": email.subject,
        "from_email": email.from,
        "from_name": "Moolya",
        "to": [
          {
            "email": email.to,
            "type": "to"
          }
        ],
        "important": true,
        "async": true
      }
    }
  }

  createAttachement(email) {
    check(email, Object);
    return {
      "message": {
        "text": email.text,
        "subject": email.subject,
        "from_email": email.from,
        "from_name": "Moolya",
        "to": [
          {
            "email": email.to,
            "type": "to"
          }
        ],
        "attachments": email.attachments,
        "important": true,
        "async": true
      }
    }
  }

  createHTML(email) {
    check(email, Object);
    return {
      "message": {
        "html": email.html,
        "subject": email.subject,
        "from_email": email.from,
        "from_name": "Moolya",
        "to": [
          {
            "email": email.to,
            "type": "to"
          }
        ],
        "important": true,
        "async": true
      }
    }
  }
}


module.exports = class moolyaEmail {
  constructor() {
    //  Mandrill.config({username: Meteor.settings.private.emailConfig.username, key: Meteor.settings.private.emailConfig.key});
    //  this.emailObj = new eMailObjectCreation();
    this.emailObj = new SmtpEmail();
  }

  sendHtml(object) {
    //Mandrill.messages.send(this.emailObj.createHTML(object));
    this.emailObj.sendHTML(object);
  }

  sendJson(object) {
    //Mandrill.messages.send(this.emailObj.createJson(object));
    this.emailObj.sendJson(object);
  }

  sendAttachment(object) {
    //Mandrill.messages.send(this.emailObj.createAttachement(object));
    this.emailObj.sendAttachment(object);
  }
}
