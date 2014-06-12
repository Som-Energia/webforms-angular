'use strict';

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
        $httpProvider.defaults.transformRequest = function (data) {
            return data === undefined ? data : jQuery.param(data);
        };
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/prepagament', {
                templateUrl: 'views/prepayment.html',
                controller: 'PrepaymentCtrl'
            })
            .when('/:locale', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/:locale/soci', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/:locale/contractacio', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
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
                NOM: 'Nombre',
                COGNOMS: 'Apellidos',
                RAO_SOCIAL: 'Razón social',
                PERSONA_REPRESENTANT: 'Persona representante',
                REPETEIX_EMAIL: 'Repetir email',
                TELEFON: 'Teléfono',
                ADRECA: 'Dirección',
                CODI_POSTAL: 'Código postal',
                PROVINCIA: 'Província',
                POBLACIO: 'Población',
                ACCEPTO_POLITICA_PRIVACITAT: 'Acepto la <strong><a target="_blank" href="#">política de privacidad</a></strong> de Som Energia',
                METODE_PAGAMENT: 'Forma de pago',
                REBUT_BANCARI: 'Recibo bancario',
                TARGETA_CREDIT: 'Tarjeta de crédito',
                COST: 'Coste para la cooperativa',
                INFO_APORTACIO: 'La aportación para ser socio/a son 100€<br/>Los 100€ se pagan una sola vez, no hay cuota anual y son retornables si te das de baja.',
                FINALITZA_PROCES: 'Continuar el proceso',
                FORMULARI_NO_DISPONIBLE: 'Formulario no disponible, disculpen las moléstias.',
                INVALID: 'Inválido',
                EMAIL_NO_IGUALS: 'Emails diferentes',
                REGISTRE_EXISTENT: 'Este registro ya existe',
                REGISTRE_OK: 'Felicidades!',
                REGISTRE_OK_MSG: 'Has completado el registro correctamente',
                ACCEDINT_SERVEI_PAGAMENT: 'Acediendo al servicio de pago'
            })
            .translations('ca', {
                SELECCIONA: 'Sel·lecciona',
                SELECCIONA_PARTICULAR: 'Particular',
                SELECCIONA_EMPRESA: 'Empresa',
                OBLIGATORI: 'Obligatori',
                IDIOMA: 'Idioma',
                SELECCIONA_IDIOMA: 'Sel·lecciona idioma',
                NOM: 'Nom',
                COGNOMS: 'Cognoms',
                RAO_SOCIAL: 'Raó social',
                PERSONA_REPRESENTANT: 'Persona representant',
                REPETEIX_EMAIL: 'Repeteix email',
                TELEFON: 'Telèfon',
                ADRECA: 'Adreça',
                CODI_POSTAL: 'Codi postal',
                PROVINCIA: 'Provincia',
                POBLACIO: 'Població',
                ACCEPTO_POLITICA_PRIVACITAT: 'Accepto la <strong><a target="_blank" href="#">política de privacitat</a></strong> de Som Energia',
                METODE_PAGAMENT: 'Mètode de pagament',
                REBUT_BANCARI: 'Rebut bancari',
                TARGETA_CREDIT: 'Targeta de crèdit',
                COST: 'Cost per a la cooperativa',
                INFO_APORTACIO: 'L\'aportació per a esdevenir soci/a són 100€<br/>Els 100€ es paguen una sola vegada, no hi ha quota anual i són retornables si et dones de baixa.',
                FINALITZA_PROCES: 'Continuar el procés',
                FORMULARI_NO_DISPONIBLE: 'Formulari no disponible, disculpeu les molèsties.',
                INVALID: 'Invàlid',
                EMAIL_NO_IGUALS: 'Emails diferents',
                REGISTRE_EXISTENT: 'Aquest registre ja existeix',
                REGISTRE_OK: 'Felicitats!',
                REGISTRE_OK_MSG: 'Has completat el registre correctament',
                ACCEDINT_SERVEI_PAGAMENT: 'Accedint al servei de pagament'
            })
            .preferredLanguage('ca')
        ;
    })
    .constant('cfg', {
        API_BASE_URL: 'http://somenergia-api-webforms.gisce.net/',
        STATUS_OFFLINE: 'OFFLINE',
        STATUS_ONLINE: 'ONLINE',
        STATE_TRUE: true,
        STATE_FALSE: false,
        PAYMENT_METHOD_BANK_ACCOUNT: 'rebut',
        PAYMENT_METHOD_CREDIT_CARD: 'tpv',
        USER_TYPE_PERSON: 'fisica',
        USER_TYPE_COMPANY: 'juridica'
    })
    .directive('radioButtonUser', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs) {
                element.bind('click', function () {
                    jQuery('#form-user-type1').removeClass('active');
                    jQuery('#form-user-type2').removeClass('active');
                    jQuery('#' + element.id).addClass('active');
                    scope.$apply(function () {
                        scope.form.usertype = attrs.value;
                    });
                });
            }
        };
    })
    .directive('radioButtonPayment', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs) {
                element.bind('click', function () {
                    jQuery('#form-payment-type1').removeClass('active');
                    jQuery('#form-payment-type2').removeClass('active');
                    jQuery('#' + element.id).addClass('active');
                    scope.$apply(function () {
                        scope.form.payment = attrs.value;
                    });
                });
            }
        };
    })
;
