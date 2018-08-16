App.info({
    name: 'moolya',
    description: 'moolya',
    author: 'raksan',
    email: 'contactus@raksan.in',
    website: 'https://moolya.global',
    version: '1.0',
    id:"com.raksan.moolya"
});
App.icons({
    // iOS
    'iphone_2x': 'resources/icons/icon-60x60@2x.png',
    'iphone_3x': 'resources/icons/icon-60x60@3x.png',
    'ipad': 'resources/icons/icon-76x76.png',
    'ipad_2x': 'resources/icons/icon-76x76@2x.png',
    'ios_settings': 'resources/icons/icon-29x29.png',
    'ios_settings_2x': 'resources/icons/icon-29x29@2x.png',
    'ios_settings_3x': 'resources/icons/icon-29x29@3x.png',
    'ios_spotlight': 'resources/icons/icon-40x40.png',
    'ios_spotlight_2x': 'resources/icons/icon-40x40@2x.png',



    // Android
    'android_mdpi': 'resources/icons/icon-48x48.png',
    'android_hdpi': 'resources/icons/icon-72x72.png',
    'android_xhdpi': 'resources/icons/icon-96x96.png',
    'android_xxhdpi': 'resources/icons/icon-144x144.png',
    'android_xxxhdpi': 'resources/icons/icon-192x192.png'
});

App.launchScreens({
    // iOS
    'iphone_2x': 'resources/splash/splash-320x480@2x.png',
    'iphone5': 'resources/splash/splash-320x568@2x.png',
    'iphone6':'resources/splash/splash-375x667@2x.png',
    'iphone6p_portrait': 'resources/splash/splash-414x736@3x.png',
    'ipad_portrait': 'resources/splash/splash-768x1024.png',
    'ipad_portrait_2x': 'resources/splash/splash-768x1024@2x.png',
    'ipad_landscape': 'resources/splash/splash-1024x768.png',
    'ipad_landscape_2x': 'resources/splash/splash-1024x768@2x.png',

    // Android
    'android_mdpi_portrait': 'resources/splash/splash-320x480.png',
    'android_mdpi_landscape': 'resources/splash/splash-480x320.png',
    'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
    'android_hdpi_landscape': 'resources/splash/splash-800x480.png',
    'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
    'android_xhdpi_landscape': 'resources/splash/splash-1280x720.png'
});
App.setPreference('Orientation', 'default', 'android'); //for android
App.setPreference('Orientation', 'all', 'ios'); //for ios
App.accessRule('*');
App.setPreference('loadUrlTimeoutValue', 100000);
//App.setPreference('SplashShowOnlyFirstTime', 'false');

