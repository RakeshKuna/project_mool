importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '790772047633'
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {

console.log('[firebase-messaging-sw.js] Received background message ', payload);

// Customize notification here
const notificationTitle = JSON.parse(payload.data.notification).title;
const notificationOptions = {
  body: JSON.parse(payload.data.notification).body,
  icon: JSON.parse(payload.data.notification).icon,
  click_action: JSON.parse(payload.data.notification).click_action
};

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(JSON.parse(payload.data.notification).click_action));
});

return self.registration.showNotification(notificationTitle,
  notificationOptions);
});
