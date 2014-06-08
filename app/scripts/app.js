'use strict';

angular
    .module('newSomEnergiaWebformsApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'pascalprecht.translate'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function($translateProvider) {
        $translateProvider
            .translations('en', {
                HEADLINE: 'Hello there, This is my awesome app!',
                INTRO_TEXT: 'And it has i18n support!'
            });
    })
    .constant('cfg', {
        API_BASE_URL: 'http://somenergia-api-webforms.gisce.net/',
        STATUS_OFFLINE: 'OFFLINE',
        STATUS_ONLINE: 'ONLINE',
        STATE_TRUE: true,
        STATE_FALSE: false
    })
;
