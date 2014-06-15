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
                PARTICULAR: 'Particular',
                EMPRESA: 'Empresa',
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
                PROVINCIA: 'Provincia',
                POBLACIO: 'Población',
                ACCEPTO_POLITICA_PRIVACITAT: 'Acepto la <strong><a target="_blank" href="#">política de privacidad</a></strong> de Som Energia',
                METODE_PAGAMENT: 'Forma de pago',
                REBUT_BANCARI: 'Recibo bancario',
                TARGETA_CREDIT: 'Tarjeta de crédito',
                COST: 'Coste para la cooperativa',
                INFO_APORTACIO: 'La aportación para ser socio/a es de 100€<br/>Los 100€ se pagan una sola vez, no hay cuota anual y son retornables si te das de baja.',
                FINALITZA_PROCES: 'Continuar el proceso',
                FORMULARI_NO_DISPONIBLE: 'Formulario no disponible, disculpen las moléstias.',
                INVALID: 'Inválido',
                EMAIL_NO_IGUALS: 'Emails diferentes',
                REGISTRE_EXISTENT: 'Este registro ya existe',
                REGISTRE_OK: 'Felicidades!',
                REGISTRE_OK_MSG: 'Has completado el registro correctamente',
                ACCEDINT_SERVEI_PAGAMENT: 'Acediendo al servicio de pago',
                FORMULARI_CONTRACTACIO: 'Formulario de contratación',
                NUMERO_SOCI: 'Número de socio/a',
                HELP_POPOVER: '?',
                CARREGAR_DADES_SOCI_VINCULAT: 'Cargar datos del socio/a viculado',
                SOCI_VINCULAT: 'Socio vinculado',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'No se ha encontrado ningún socio/a vinculado a estos datos!',
                NO_ETS_SOCI_FES_TE_AQUI: '¿No eres socio? Hazte socio/a aquí!',
                INICIAR_CONTRACTACIO: 'Iniciar contratación',
                DADES_PUNT_SUBMINISTRAMENT: 'Datos del punto de suministro',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Lorem ipsum...',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CUPS: '?',
                HELP_POPOVER_CNAE: '?',
                QUINA_POTENCIA_TENS_CONTRACTADA: '¿Cuanta potencia tienes contratada',
                HELP_POPOVER_POWER: '?',
                QUINA_TARIFA_TENS_CONTRACTADA: '¿Que tarifa tienes contratada',
                SELECCIONAR: 'Seleccionar',
                HELP_POPOVER_RATE: '?',
                INFORMACIO_OPCIONAL: 'Información opcional',
                HELP_POPOVER_OPTIONAL_INFO: '?',
                CONSUM_ANUAL_ESTIMAT: 'Consumo anual estimado',
                REFERENCIA_CATASTRAL: 'Referencia cadastral del inmueble',
                ADJUNTAR_ULTIMA_FACTURA: 'Adjuntar la última factura eléctrica',
                SEGUENT_PAS: 'Siguiente paso',
                DADES_TITULAR_NOU_CONTRACTE: 'Datos del titular del contrato',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: '?',
                VOLS_FER_CANVI_TITULAR: '¿Quieres hacer un cambio de titular',
                SI: 'Si',
                NO: 'No',
                HELP_POPOVER_OWNER: '?',
                EL_TITULAR_ES: 'El titular es',
                EL_TITULAR_ES_SOCI_VINCULAT_AL_CONTRACTE: '',
                DADES_PAGAMENT: 'Datos de pago'
            })
            .translations('ca', {
                SELECCIONA: 'Sel·lecciona',
                PARTICULAR: 'Particular',
                EMPRESA: 'Empresa',
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
                PROVINCIA: 'Província',
                POBLACIO: 'Població',
                ACCEPTO_POLITICA_PRIVACITAT: 'Accepto la <strong><a target="_blank" href="#">política de privacitat</a></strong> de Som Energia',
                METODE_PAGAMENT: 'Mètode de pagament',
                REBUT_BANCARI: 'Rebut bancari',
                TARGETA_CREDIT: 'Targeta de crèdit',
                COST: 'Cost per a la cooperativa',
                INFO_APORTACIO: 'L\'aportació per a esdevenir soci/a és de 100€<br/>Els 100€ es paguen una sola vegada, no hi ha quota anual i són retornables si et dones de baixa.',
                FINALITZA_PROCES: 'Continuar el procés',
                FORMULARI_NO_DISPONIBLE: 'Formulari no disponible, disculpeu les molèsties.',
                INVALID: 'Invàlid',
                EMAIL_NO_IGUALS: 'Emails diferents',
                REGISTRE_EXISTENT: 'Aquest registre ja existeix',
                REGISTRE_OK: 'Felicitats!',
                REGISTRE_OK_MSG: 'Has completat el registre correctament',
                ACCEDINT_SERVEI_PAGAMENT: 'Accedint al servei de pagament',
                FORMULARI_CONTRACTACIO: 'Formulari de contractació',
                NUMERO_SOCI: 'Número de soci/a',
                HELP_POPOVER: '?',
                CARREGAR_DADES_SOCI_VINCULAT: 'Carregar les dades del soci/a vinculat',
                SOCI_VINCULAT: 'Soci vinculat',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'No trobem cap soci/a vinculat a aquestes dades!',
                NO_ETS_SOCI_FES_TE_AQUI: 'No ets soci/a? Fes-te soci/a aquí!',
                INICIAR_CONTRACTACIO: 'Iniciar contractació',
                DADES_PUNT_SUBMINISTRAMENT: 'Dades del punt de subministrament',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Lorem ipsum...',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CUPS: '?',
                HELP_POPOVER_CNAE: '?',
                QUINA_POTENCIA_TENS_CONTRACTADA: 'Quina potència tens contractada',
                HELP_POPOVER_POWER: '?',
                QUINA_TARIFA_TENS_CONTRACTADA: 'Quina tarifa tens contractada',
                SELECCIONAR: 'Seleccionar',
                HELP_POPOVER_RATE: '?',
                INFORMACIO_OPCIONAL: 'Informació opcional',
                HELP_POPOVER_OPTIONAL_INFO: '?',
                CONSUM_ANUAL_ESTIMAT: 'Consum anual estimat (kW/h)',
                REFERENCIA_CATASTRAL: 'Referència cadestral de l\'immoble',
                ADJUNTAR_ULTIMA_FACTURA: 'Adjuntar última factura elèctrica (PDF o JPG) - 10Mb màxim',
                SEGUENT_PAS: 'Següent pas',
                DADES_TITULAR_NOU_CONTRACTE: 'Dades del/la titular del nou contracte amb Som Energia',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: '?',
                VOLS_FER_CANVI_TITULAR: 'Vols fer un canvi de titular',
                SI: 'Sí',
                NO: 'No',
                HELP_POPOVER_OWNER: '?',
                EL_TITULAR_ES: 'El titular és',
                EL_TITULAR_ES_SOCI_VINCULAT_AL_CONTRACTE: 'El titular és el soci vinculat a aquest contracte',
                DADES_PAGAMENT: 'Dades de pagament'
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
;
