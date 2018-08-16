let NotificationTemplates = [

  {
    "tempCode": "SMS_account_registratation",
    "tempDesc": "when ever the user registered with us then use this sms service.",
    "type": "sms",
    "title":"Thank you for your interest. Please check your email to proceed to the next steps.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_account_activated",
    "tempDesc": "When ever the user virified email and phone number then we need to send this sms service.",
    "type": "sms",
    "title":"Congratulations ! Your moolya account login has now been verified and activated. Login to moolya now!",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_account_login_remainder",
    "tempDesc": "Use this sms service, when ever the user didnt connect with us from past few days.",
    "type": "sms",
    "title":"Hello {{ firstName }}, We miss you on moolya. Don't miss out on all the action on the World's 1st digital startup ecosystem. Login now!",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_incorrect_password_attempts",
    "tempDesc": "Use this sms service for Incorrect Password Attempt.",
    "type": "sms",
    "title":"Alert! Incorrect Password Attempt made for your moolya account on {{ timeStamp }}",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_incorrect_password_attempts_acc_lock",
    "tempDesc": "Use this sms service for Incorrect Password Attempt account lock.",
    "type": "sms",
    "title":"Alert! Your account has been locked due to {{ attempts }} incorrect attempts for your moolya account. Check your email for next steps.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_acc_activatation_or_reActivatation",
    "tempDesc": "At registratation when ever we sent the email verigication mailer, use this sms service to intimate to the user.",
    "type": "sms",
    "title":"Alert! We have sent a new email verification link for moolya. Check your email and click on the link before '{{ time }}' hours.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_password_reset",
    "tempDesc": "When ever we send the password reset email, use this sms service",
    "type": "sms",
    "title":"Alert! We have sent a password reset email for moolya login. Check your email and click on the link within 'L' hours.",
    "isHtmlContent": false,
    "content":""
  },{
    "tempCode": "SMS_password_reset_unsuccessful",
    "tempDesc": "Use  this service, when ever the user made unsuccessful passowrd reset.",
    "type": "sms",
    "title":"Alert! Your moolya account password reset was unsuccessful on {{ timeStamp }}. Please contact support.",
    "isHtmlContent": false,
    "content":""
  },{
    "tempCode": "SMS_",
    "tempDesc": "",
    "type": "sms",
    "title":"Hello {{ firstName }}, We miss you on moolya. Don't miss out on all the action on the World's 1st digital startup ecosystem. Login now!",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_complete_profile_remainder",
    "tempDesc": "Use this service to to intimate user to complete the user profile.",
    "type": "sms",
    "title":"Mr. / Ms. {{ firstName }},  {{ role }} will be your Community Manager on moolya and will help you complete your moolya profile. Login now to explore more.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_profile_updation_",
    "tempDesc": "Only If End User Updates. Use this sms service to intimate to the user.",
    "type": "sms",
    "title":"Your {{ attributeName }} in your moolya profile has been updated on {{ timeStamp }}.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_kyc_upload_pending_remainder",
    "tempDesc": "Use this sms service for every 3 days once to remainder the user to upload his KYC pending.",
    "type": "sms",
    "title":"Your KYC upload is pending. Please login to your moolya account and complete the KYC upload. Thank you.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_kyc_approved",
    "tempDesc": "Use this sms service to the user. If the user KYC has been approved.",
    "type": "sms",
    "title":"Your KYC have been approved by the Admin. Please login to your moolya account and complete the next steps. Thank you.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_kyc_declined",
    "tempDesc": "Use this sms service to the user. If the user KYC declined by the admin.",
    "type": "sms",
    "title":"Your KYC have been declined by the Admin. Please login to your moolya account and complete the KYC upload. Thank you.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_kyc_mandate_doc_remainder",
    "tempDesc": "Notice to the user to proivide the additional KYC required documents for his profile.",
    "type": "sms",
    "title":"As per new rules, additional KYC {{ attribbuteName }} for your {{ profileName }} on moolya has been mandated. Please login and complete the upload.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_new_user_registratation_informatation",
    "tempDesc": "Use this service for newly registered user to send his registratation sms alert.",
    "type": "sms",
    "title":"New registration request for {{ registrationType }} on moolya has been submitted on {{ timeStamp }}",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_password_updation_info",
    "tempDesc": "When ever the user account password is changed, then use this sms service to intimate the user.",
    "type": "sms",
    "title":"Your moolya login password was changed on {{ timeStamp }}. Contact moolya support immediately if you did not change the password word.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_portfolio_updation_info",
    "tempDesc": "When ever the user portfolio is changed, then use this sms service to intimate the user.",
    "type": "sms",
    "title":"Your moolya portfolio has been changed on {{ timeStamp }}",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_go-live_request_aprroved",
    "tempDesc": "When ever the user  Go-Live request has been approved, then user use this.",
    "type": "sms",
    "title":"Your Go-Live request for {{ profileType }} has been approved on {{ timeStamp }}. Login to moolya for next steps.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_go-live_request_declined",
    "tempDesc": "When ever the user  Go-Live request has been declined, then user use this.",
    "type": "sms",
    "title":"Your Go-Live request for {{ profileType }} has been declined on {{ timeStamp }}. Login to moolya for next steps.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_enquiry_request_info",
    "tempDesc": "When ever the user get the enquiry request, then user this sms service.",
    "type": "sms",
    "title":"You have received an enquiry request from {{ firstName }} on moolya on {{ timeStamp }}. Login now to respond to it.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_received_review_info",
    "tempDesc": "When ever the user get the review, then user this to send the review information.",
    "type": "sms",
    "title":"You have received a review from {{ firstName }} on moolya on {{ timeStamp }}. Login now to view it now.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_review_reject_by_admin",
    "tempDesc":  "When ever the admin reject the review, then send this sms to the user to intimate the status of his review.",
    "type": "sms",
    "title":"Your review for {{ firstName }} was rejected by the admin",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_collaboration_request_info",
    "tempDesc": "When ever the user get the collaboration request, then use this to intimate about it.",
    "type": "sms",
    "title":"You have received a new collaboration request from {{ firstName }} on moolya on {{ timeStamp }}",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_received_feedback_info",
    "tempDesc": "When ever the user get the feedback, then user this.",
    "type": "sms",
    "title":"You have received a new feedback from {{ firstName }} on moolya on {{ timeStamp }}",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_portfolio_annotations_accepted",
    "tempDesc": "When ever the user portfolio annotations accepted by the admin, then use this sms service to intimate to the user.",
    "type": "sms",
    "title":"Your portfolio annotations have been accepted by the admin {{ timeStamp }}",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_portfolio_annotations_rejected",
    "tempDesc":  "When ever the user portfolio annotations rejected by the admin, then use this sms service to intimate to the user.",
    "type": "sms",
    "title":"Your portfolio annotations was rejected by the admin {{ timeStamp }}",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_investor_process_setup_started",
    "tempDesc": "Wen ever the User Investor Process Setup has started for user moolya profile, Then use this sms service",
    "type": "sms",
    "title":"Investor Process Setup has started for your moolya profile. Thank you.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_payment_link_email_sent_info",
    "tempDesc": "When the payment link sent to the user email, then use this service to send info though sms.",
    "type": "sms",
    "title":"Payment link for {{ activity }} has been sent by email. Please check your email to process the payment.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_investor_process_setup_completed",
    "tempDesc": "Wen ever the User Investor Process Setup has completed for user moolya profile, Then use this sms service",
    "type": "sms",
    "title":"Investor Process Setup has been completed for your moolya profile. Thank you.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_new_branch_added",
    "tempDesc": "When ever the new branch added to the user profile, then user this.",
    "type": "sms",
    "title":"New Branch was added for your profile {{ profileName }} on {{ timeStamp }}. Thank you.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_customized_office_activated",
    "tempDesc": "When ever the user customized office has been activated, then user this.",
    "type": "sms",
    "title":"Your customized office has been activated on moolya on {{ timeStamp }}. Login and check it out now.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_office_category_upgraded",
    "tempDesc": "When ever the user office category has been upgraded, then use it.",
    "type": "sms",
    "title":"Your office category has been upgraded on moolya on {{ timeStamp }}. Login and check it out now.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_profile_deactivatation_request_info",
    "tempDesc": "When ever the user made Profile deactivation request, then send this sms to intimate to the user.",
    "type": "sms",
    "title":"Your request for Profile deactivation on moolya has been placed on {{ timeStamp }}. We will process the request in {{ days }} days.",
    "isHtmlContent": false,
    "content":""
  },
  {
    "tempCode": "SMS_profile_deactivated_end_info",
    "tempDesc": "When ever the user Profile has been deactivated, then send this sms to intimate to the user.",
    "type": "sms",
    "title":"Your profile {{ profileName }} on moolya has been deactivated. You can reactivate the profile within the next {{ days }} days, else all details will be deleted.",
    "isHtmlContent": false,
    "content":""
  }

]

/*
Meteor.startup(function () {

  let count = MlNotificationTemplates.find({ type: "sms"  }).count()  // To find the no:of doc in Notifi Temp sms Collection.
  let length = NotificationTemplates.length
  if (count != length) {
    for (var i = 0; i < NotificationTemplates.length; i++) { // Looping the doc to insert in Notifi Temp sms Collection.
      let TemplateData = MlNotificationTemplates.findOne({tempCode: NotificationTemplates[i].tempCode});
      if (!TemplateData) {      // If doc is not present in collection then push doc.
        MlNotificationTemplates.insert(NotificationTemplates[i]);
      }
    }
  }
});
*/
