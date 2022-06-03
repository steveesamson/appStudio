'use strict';

import { writable } from 'svelte/store';
import { useStore } from 'utils/store';
import urlBase64ToUint8Array from 'utils/common/urlBase64ToUint8Array';
import { state } from './appState';

const PUB_VAPID_KEY = 'BCHhaVQcJJOs_-cL86Shwo7EWnil4ZWMqZmVT8YL-scKiRnTWY8Lf-i4QgF-eCp0g29Gmxxkj_2MsKQnNJBQ6wY';
const notifications = useStore('notifications');
export const isSubscribed = writable(false);
export const notificationIsSupported = writable('');

//Push notification button
const canProceed = (cb) => {
  //Check `push notification` is supported or not
  if (!('PushManager' in window)) {
    console.error("Sorry, Push notification isn't supported in your browser.");
    notificationIsSupported.set('NO');
    return cb();
  }

  //To check `push notification` permission is denied by user
  if (Notification.permission === 'denied') {
    console.error('User has blocked push notification.');
    notificationIsSupported.set('NO');
    return cb();
  }
  notificationIsSupported.set('YES');
  //Get `push notification` subscription
  //If `serviceWorker` is registered and ready
  navigator.serviceWorker.ready
    .then(function (registration) {
      cb(registration);
    })
    .catch((err) => {
      console.error('No registration ', error);
      cb();
    });
};

//To check `push notification` is supported or not
export function isPushSupported() {
  canProceed((registration) => {
    if (!registration) return;

    registration.pushManager
      .getSubscription()
      .then(function (subscription) {
        //If already access granted, enable push button status
        if (subscription) {
          saveSubscription(subscription);
        } else {
          changePushStatus(false);
        }
      })
      .catch(function (error) {
        console.error('Error occurred while enabling push ', error);
      });
  });
}

// Ask User if he/she wants to subscribe to push notifications and then
// ..subscribe and send push notification
export function subscribePush() {
  canProceed((registration) => {
    if (!registration) return;
    //To subscribe `push notification` from push manager
    registration.pushManager
      .subscribe({
        userVisibleOnly: true, //Always show notification when received
        applicationServerKey: urlBase64ToUint8Array(PUB_VAPID_KEY),
      })
      .then(function (subscription) {
        console.log('Push notification subscribed.');
        saveSubscription(subscription);
      })
      .catch(function (error) {
        changePushStatus(false);
        console.log('Push notification subscription error: ', error);
      });
  });
}

// Unsubscribe the user from push notifications
export function unsubscribePush() {
  canProceed((registration) => {
    if (!registration) return;

    registration.pushManager
      .getSubscription()
      .then(function (subscription) {
        //If no `push subscription`, then return
        if (!subscription) {
          console.error('Unable to unregister push notification.');
          return;
        }

        //Unsubscribe `push notification`
        subscription
          .unsubscribe()
          .then(function () {
            // toast('Unsubscribed successfully.');
            console.info('Push notification unsubscribed.');
            // console.log(subscription);
            removeSubscription();
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error('Failed to unsubscribe push notification.');
      });
  });
}

//To change status
function changePushStatus(status) {
  isSubscribed.set(status);
  // console.log('changePushStatus: ', status);
}

async function saveSubscription(subscription) {
  // console.log('Subscription', subscription);
  const { error } = await notifications.save({ id: 'dudId', subscription });
  !error && changePushStatus(true);
}

async function removeSubscription() {
  // console.log('Subscription', subscription);
  const { error } = await notifications.save({ id: 'dudId', subscription: '' });
  if (!error) {
    changePushStatus(false);
    state.set({});
  }
}
