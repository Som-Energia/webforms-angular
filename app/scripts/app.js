'use strict';

var developmentMode = false;

angular.module('newSomEnergiaWebformsApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'pascalprecht.translate',
        'ui.bootstrap'
    ])
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
        $httpProvider.defaults.transformRequest = function(data) {
            return data === undefined ? data : jQuery.param(data);
        };
//        $httpProvider.defaults.useXDomain = true;
    })
    .config(function ($routeProvider, $sceDelegateProvider/*, $locationProvider*/) {
        var base = (
            developmentMode ? '' :
            '//cdn.rawgit.com/Som-Energia/new-api-webforms/v1.4.3/app/'
            );

        $routeProvider
            .when('/', {
                templateUrl: base+'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/prepagament', {
                templateUrl: base+'views/prepayment.html',
                controller: 'PrepaymentCtrl'
            })
            .when('/:locale', {
                templateUrl: base+'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/:locale/soci', {
                templateUrl: base+'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/:locale/contractacio', {
                templateUrl: 'views/order.html', // DGG: No base??
                controller: 'OrderCtrl'
            })
            .when('/:locale/aportacionsvoluntaries', {
                templateUrl: 'views/invest.html', // DGG: No base??
                controller: 'AportacioVoluntariaCtrl'
            })
            .when('/:locale/generationkwh', {
                templateUrl: 'views/generationkwh.html',
                controller: 'GenerationKwhCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        //$locationProvider.html5Mode(true);
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            new RegExp('^(http[s]?):\/\/rawgit.com/.+$'),
            new RegExp('^(http[s]?):\/\/cdn.rawgit.com/.+$'),
        ]);
    })
    .config(function($translateProvider) {
        $translateProvider
            .preferredLanguage('es')
        ;
    })
    .constant('cfg', {
        DEVELOPMENT: developmentMode,
        BASE_DOMAIN: 'somenergia.coop',
        API_BASE_URL: (developmentMode ?
//            'http://localhost:5001/': // development api
            'https://testing.somenergia.coop:5001/': // testing api
            'https://api.somenergia.coop/'),  // production api
        STATUS_OFFLINE: 'OFFLINE',
        STATUS_ONLINE: 'ONLINE',
        STATE_TRUE: true,
        STATE_FALSE: false,
        PAYMENT_METHOD_BANK_ACCOUNT: 'rebut',
        PAYMENT_METHOD_CREDIT_CARD: 'tpv',
        USER_TYPE_PERSON: 'fisica',
        USER_TYPE_COMPANY: 'juridica',
        PAYER_TYPE_TITULAR: 'titular',
        PAYER_TYPE_OTHER: 'altre',
        RATE_20A: '2.0A',
        RATE_20DHA: '2.0DHA',
        RATE_20DHS: '2.0DHS',
        RATE_21A: '2.1A',
        RATE_21DHA: '2.1DHA',
        RATE_21DHS: '2.1DHS',
        RATE_30A: '3.0A',
        DEFAULT_MILLISECONDS_DELAY: 1000,
        MAX_MB_FILE_SIZE: 10,
        THOUSANDS_CONVERSION_FACTOR: 1000
    })
;
