/**
 * Created by venkatsrinag on 7/6/17.
 */

// let stages = [
//   'likes',
//   'comment',
//   'wishlist',
//   'shortlist',
//   'onboard'
// ]

let stages = [
  {
    name: 'likes',
    displayName: 'Liked',
    code: 'LIKES',
    isActive: true
  },
  {
    name: 'comment',
    displayName: 'Commented',
    code: 'COMMENT',
    isActive: true
  },
  {
    name: 'wishlist',
    displayName: 'Wishlist',
    code: 'WISHLIST',
    isActive: true
  },
  {
    name: 'shortlist',
    displayName: 'Shortlisted',
    code: 'SHORTLIST',
    isActive: true
  },
  {
    name: 'onboard',
    displayName: 'Onboarded',
    code: 'ONBOARD',
    isActive: true
  }
];

Meteor.startup(function () {
    for (i = 0; i < stages.length; i++) {
        let stage = MlProcessStages.findOne({name: stages[i].name});
        if (!stage) {
//            stage = {name: stages[i], displayName: stages[i], code: stages[i].toUpperCase(), isActive: true};
            MlProcessStages.insert(stages[i]);
        }
    }
});
