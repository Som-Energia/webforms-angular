'use strict';

const developmentMode = false;

const localMode = false;

const mode = developmentMode ? ( localMode ? 'local' : 'devel') : 'prod';
const apiBase = {
    'local': 'http://localhost:5001/',
    'devel': 'https://testapi.somenergia.coop:4433/',
    'prod':  'https://api.somenergia.coop/',
}[mode];

const apiV2Base = {
    'local': 'http://localhost:5001/',
    'devel': 'https://testapi.somenergia.coop:4433/',
    'prod':  'https://apiv2.somenergia.coop/',
}[mode];

angular.module('SomEnergiaWebForms', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'pascalprecht.translate',
        'ui.bootstrap'
    ])
    .config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.crossDomain = true;
        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        $httpProvider.defaults.transformRequest = function(data) {
            return data === undefined ? data : jQuery.param(data);
        };
//        $httpProvider.defaults.useXDomain = true;
    })
    .config(function ($routeProvider, $sceDelegateProvider/*, $locationProvider*/) {
        $routeProvider
            .when('/', {
                templateUrl: 'scripts/pages/newmember.html',
                controller: 'NewMemberCtrl'
            })
            .when('/:locale', {
                templateUrl: 'scripts/pages/newmember.html',
                controller: 'NewMemberCtrl'
            })
            .when('/:locale/soci', {
                templateUrl: 'scripts/pages/newmember.html',
                controller: 'NewMemberCtrl'
            })
            .when('/:locale/prepagament', {
                templateUrl: 'scripts/pages/prepayment.html',
                controller: 'PrepaymentCtrl'
            })
            .when('/:locale/contractacio', {
                templateUrl: 'scripts/pages/contract.html',
                controller: 'OrderCtrl'
            })
            .when('/:locale/aportacionsvoluntaries', {
                templateUrl: 'scripts/pages/invest.html',
                controller: 'InvestCtrl'
            })
            .when('/:locale/generationkwh', {
                templateUrl: 'scripts/pages/generationkwh.html',
                controller: 'GenerationKwhCtrl'
            })
            .when('/:locale/modifica', {
                templateUrl: 'scripts/pages/modify.html',
                controller: 'ModifyCtrl'
            })
            .when('/:locale/intercoop/contract', {
                templateUrl: 'scripts/pages/intercoop.html',
                controller: 'IntercoopCtrl'
            })
            .otherwise({
				// TODO: An error page, just to know we are doing something wrong
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
        API_BASE_URL: apiBase,
        APIV2_BASE_URL: apiV2Base,
        STATUS_OFFLINE: 'OFFLINE',
        STATUS_ONLINE: 'ONLINE',
        STATE_TRUE: true,
        STATE_FALSE: false,
        PAYMENT_METHOD_BANK_ACCOUNT: 'rebut',
        PAYMENT_METHOD_PAYMENT_ORDER: 'remesa',
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
