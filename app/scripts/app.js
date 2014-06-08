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
            .translations('es', {
                SELECCIONA: 'Selecciona',
                SELECCIONA_PARTICULAR: 'Particular',
                SELECCIONA_EMPRESA: 'Empresa',
                OBLIGATORI: 'Obligatorio',
                IDIOMA: 'Idioma',
                SELECCIONA_IDIOMA: 'Selecciona idioma',
                RAO_SOCIAL: 'Razón social',
                PERSONA_REPRESENTANT: 'Persona representante',
                REPETEIX_EMAIL: 'Repetir email',
                TELEFON: 'Teléfono',
                ADRECA: 'Dirección',
                CODI_POSTAL: 'Código postal',
                PROVINCIA: 'Província',
                POBLACIO: 'Población',
                ACCEPTO_POLITICA_PRIVACITAT: 'Acepto la <strong><a target="_blank" href="#">política de privacidad</a></strong> de Som Energia'
            })
            .translations('ca', {
                SELECCIONA: 'Sel·lecciona',
                SELECCIONA_PARTICULAR: 'Particular',
                SELECCIONA_EMPRESA: 'Empresa',
                OBLIGATORI: 'Obligatori',
                IDIOMA: 'Idioma',
                SELECCIONA_IDIOMA: 'Sel·lecciona idioma',
                RAO_SOCIAL: 'Raó social',
                PERSONA_REPRESENTANT: 'Persona representant',
                REPETEIX_EMAIL: 'Repeteix email',
                TELEFON: 'Telèfon',
                ADRECA: 'Adreça',
                CODI_POSTAL: 'Codi postal',
                PROVINCIA: 'Provincia',
                POBLACIO: 'Població',
                ACCEPTO_POLITICA_PRIVACITAT: 'Accepto la <strong><a target="_blank" href="#">política de privacitat</a></strong> de Som Energia'
            })
            .preferredLanguage('ca')
        ;
    })
    .constant('cfg', {
        API_BASE_URL: 'http://somenergia-api-webforms.gisce.net/',
        STATUS_OFFLINE: 'OFFLINE',
        STATUS_ONLINE: 'ONLINE',
        STATE_TRUE: true,
        STATE_FALSE: false
    })
;
