'use strict';

angular
  .module('newSomEnergiaWebformsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
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
    .constant('cfg', {
        API_BASE_URL: 'http://somenergia-api-webforms.gisce.net/',
        STATUS_OFFLINE: 'OFFLINE',
        STATUS_ONLINE: 'ONLINE',
        STATE_TRUE: true,
        STATE_FALSE: false
    })
;
