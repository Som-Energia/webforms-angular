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
        $httpProvider.defaults.transformRequest = function(data) {
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
                PARTICULAR: 'Persona física',
                EMPRESA: 'Persona jurídica',
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
                POBLACIO: 'Municipio',
                ACCEPTO_POLITICA_PRIVACITAT: 'Acepto la <strong><a target="_blank" href="http://www.somenergia.coop/es/politica-de-privacidad">política de privacidad</a></strong> de Som Energia',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Acepto las <strong><a target="_blank" href="#">condiciones generales del contrato</a></strong> i la <strong><a target="_blank" href="#">política de privacidad</a></strong>',
                METODE_PAGAMENT: 'Forma de pago',
                REBUT_BANCARI: 'Recibo bancario',
                TARGETA_CREDIT: 'Tarjeta de crédito',
                COST: 'Coste para la cooperativa',
                INFO_APORTACIO: 'La aportación para ser socio/a es de 100€<br/>Los 100€ se pagan una sola vez, no hay cuota anual y son retornables si te das de baja.',
                FINALITZA_PROCES: 'Finalizar el proceso',
                FORMULARI_NO_DISPONIBLE: 'Formulario no disponible, disculpen las molestias.',
                INVALID: 'Inválido',
                EMAIL_NO_IGUALS: 'Emails diferentes',
                REGISTRE_EXISTENT: 'Este registro ya existe',
                REGISTRE_OK: 'Felicidades!',
                REGISTRE_OK_MSG: 'Has completado el registro correctamente',
                ACCEDINT_SERVEI_PAGAMENT: 'Acediendo al servicio de pago',
                FORMULARI_CONTRACTACIO: 'Formulario de contratación',
                NUMERO_SOCI: 'Número de socio/a',
                HELP_POPOVER_DNI: 'Ejemplo nº socio: 1250 Ejemplo DNI: 12345678P (con letra final)',
                HELP_POPOVER_IDIOMA: 'Éste será el idioma con el que nos comunicaremos a partir de ahora',
                CARREGAR_DADES_SOCI_VINCULAT: 'Cargar datos del socio/a viculado',
                SOCI_VINCULAT: 'Socio vinculado',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'No se ha encontrado ningún socio/a vinculado a estos datos!',
                NO_ETS_SOCI_FES_TE_AQUI: '¿No eres socio? Hazte socio/a aquí!',
                INICIAR_CONTRACTACIO: 'Iniciar contratación',
                DADES_PUNT_SUBMINISTRAMENT: 'Datos del punto de suministro',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Poner los datos tal cual estan en vuestra factura actual. Si queréis hacer cambios de tarifa o poténcia, hace falta que os esperéis a tener primero el contrato con Som Energia para luego solicitarlos. Si queréis hacer un cambio en el titular del contrato, lo podréis hacer en el paso núm.2 de este formulario.',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CUPS: 'Lo encontrarás en tu factura actual. Es un codigo de 20 o 22 cifras y letras.',
                HELP_POPOVER_CNAE: 'En caso de ser una vivienda poner: 9820. En caso de ser una empresa poner el de vuestra actividad económica.',
                QUINA_POTENCIA_TENS_CONTRACTADA: '¿Qué potencia tienes contratada?',
                HELP_POPOVER_POWER: 'Anota la poténcia ACTUAL de tu contrato',
                QUINA_TARIFA_TENS_CONTRACTADA: '¿Qué tarifa tienes contratada?',
                SELECCIONAR: 'Seleccionar',
                HELP_POPOVER_RATE: 'Lo encontraréis en vuestra factura actual. Para más información consultar el apartado de Ayuda de la web.',
                INFORMACIO_OPCIONAL: 'Información opcional',
                HELP_POPOVER_OPTIONAL_INFO: 'No es obligatoria, pero si muy recomendable',
                CONSUM_ANUAL_ESTIMAT: 'Consumo anual estimado',
                REFERENCIA_CATASTRAL: 'Referencia cadastral del inmueble',
                HELP_POPOVER_REFERENCIA_CATASTRAL: 'Mas información aquí:<br/><a target="_blank" href="https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=CONSULTA">España</a><br/><a target="_blank" href="http://www.bizkaia.net/home2/Temas/DetalleTema.asp?Tem_Codigo=5181&Idioma=CA">Bizkaia</a><br/><a target="_blank" href="http://catastroalava.tracasa.es/navegar/?lang=es">Araba</a><br/><a target="_blank" href="http://www4.gipuzkoa.net/ogasuna/catastro/presenta.asp">Guipuzkoa</a>',
                ADJUNTAR_ULTIMA_FACTURA: 'Adjuntar la última factura eléctrica (PDF o JPG) - 10Mb máximo',
                BAD_EXTENSION: 'Adjuntar sólo PDF o JPG',
                SEGUENT_PAS: 'Siguiente paso',
                PAS_ANTERIOR: 'Paso anterior',
                DADES_TITULAR_NOU_CONTRACTE: 'Datos del titular del contrato',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: 'Poner los datos de quien va a ser el titular del nuevo contrato con Som Energia. Puede ser el mismo que aparece en vuestro contrato anterior o podéis aprovechar ahora para cambiarlo.',
                VOLS_FER_CANVI_TITULAR: '¿Quieres hacer un cambio de titular?',
                SI: 'Si',
                NO: 'No',
                HELP_POPOVER_OWNER: '¿Comparado con tu contracto actual, en el nuevo contrato quieres poner a otra persona de titular?',
                EL_TITULAR_ES: 'El titular es',
                EL_TITULAR_ES_SOCI_VINCULAT_AL_CONTRACTE: '¿El titular es socio/a vinculado al contrato?',
                DADES_PAGAMENT: 'Datos de pago',
                QUI_ES_TITULAR_COMPTE_BANCARI: 'Quién es el titular de la cuenta bancaria?',
                TITULAR_CONTRACTE_ELECTRICITAT: 'Titular del contrato de electricidad',
                SOCI_SOM_ENERGIA: 'Socio/a de Som Energia',
                ALTRE_TITULAR: 'Otro titular',
                NUM_COMPTE: 'Número de cuenta bancaria',
                BANC: 'Banco',
                OFICINA: 'Oficina',
                COMPTE: 'Número cuenta',
                CONFIRMO_TITULAR_COMPTE_ACCEPTA_DOMICILIACIO: 'Confirmo que el titular de la cuenta bancaria autoriza la domicilación de las facturas de electricidad',
                SOM_UNA_COOPERATIVA_SENSE_ANIM_DE_LUCRE: 'Somos una Cooperativa sin ánimo de lucro con el objetivo firme de cambiar el modelo energético',
                VOLS_PARTICIPAR_AMB_LA_TEVA_ENERGIA: '¿Quieres participar con tu energia a hacerlo posible?',
                DONATIU_VOLUNTARI: 'Donativo voluntario 0,01€/kWh',
                ELS_SOCIS_I_SOCIES_QUE_HO_DESITGIN_PODEN_REALITZAR_UN_DONATIU_VOLUNTARI: 'Los socios y socias que lo deseen pueden realizar un donativo voluntario',
                CONFIRMAR_CONTRACTACIO: 'Confirmar contratación',
                LOADING: 'Enviando datos...',
                ENVIANT_DADES: 'Si has adjuntado una factura este proceso puede tardar un tiempo y este tiempo dependerá del peso del archivo y de tu conexión a internet. Ánimos y buenas energías, que ya casi lo has conseguido! :)'
            })
            .translations('ca', {
                SELECCIONA: 'Sel·lecciona',
                PARTICULAR: 'Persona física',
                EMPRESA: 'Persona jurídica',
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
                POBLACIO: 'Municipi',
                ACCEPTO_POLITICA_PRIVACITAT: 'Accepto la <strong><a target="_blank" href="http://www.somenergia.coop/politica-de-privacitat">política de privacitat</a></strong> de Som Energia',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Accepto les <strong><a target="_blank" href="#">condicions generals del contracte</a></strong> i la <strong><a target="_blank" href="#">política de privacidad</a></strong>',
                METODE_PAGAMENT: 'Mètode de pagament',
                REBUT_BANCARI: 'Rebut bancari',
                TARGETA_CREDIT: 'Targeta de crèdit',
                COST: 'Cost per a la cooperativa',
                INFO_APORTACIO: 'L\'aportació per a esdevenir soci/a és de 100€<br/>Els 100€ es paguen una sola vegada, no hi ha quota anual i són retornables si et dones de baixa.',
                FINALITZA_PROCES: 'Finalitzar el procés',
                FORMULARI_NO_DISPONIBLE: 'Formulari no disponible, disculpeu les molèsties.',
                INVALID: 'Invàlid',
                EMAIL_NO_IGUALS: 'Emails diferents',
                REGISTRE_EXISTENT: 'Aquest registre ja existeix',
                REGISTRE_OK: 'Felicitats!',
                REGISTRE_OK_MSG: 'Has completat el registre correctament',
                ACCEDINT_SERVEI_PAGAMENT: 'Accedint al servei de pagament',
                FORMULARI_CONTRACTACIO: 'Formulari de contractació',
                NUMERO_SOCI: 'Número de soci/a',
                HELP_POPOVER_DNI: 'Exemple nº soci: 1250 Exemple DNI: 12345678P (amb lletra final)',
                HELP_POPOVER_IDIOMA: 'Aquest serà l\'idioma amb el que ens comunicarem amb tu a partir d\'ara',
                CARREGAR_DADES_SOCI_VINCULAT: 'Carregar les dades del soci/a vinculat',
                SOCI_VINCULAT: 'Soci vinculat',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'No trobem cap soci/a vinculat a aquestes dades!',
                NO_ETS_SOCI_FES_TE_AQUI: 'No ets soci/a? Fes-te soci/a aquí!',
                INICIAR_CONTRACTACIO: 'Iniciar contractació',
                DADES_PUNT_SUBMINISTRAMENT: 'Dades del punt de subministrament',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Poseu-hi les dades tal i com estan en la factura actual. Si voleu fer canvis de tarifa o potència, cal que us espereu a tenir el contracte amb Som Energia per solicitar-nos-els. Si voleu fer un canvi de titular, el podreu fer en el pas nº2 d\'aquest formulari.',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CUPS: 'Ho trobareu a la vostra factura actual. És un codi de 20 o 22 xifres i lletres',
                HELP_POPOVER_CNAE: 'En cas d\'habitatges: 9820. En cas d\'empreses el de la vostra activitat econòmica',
                QUINA_POTENCIA_TENS_CONTRACTADA: 'Quina potència tens contractada?',
                HELP_POPOVER_POWER: 'Anota la potència ACTUAL del teu contracte',
                QUINA_TARIFA_TENS_CONTRACTADA: 'Quina tarifa tens contractada?',
                SELECCIONAR: 'Seleccionar',
                HELP_POPOVER_RATE: 'Ho trobareu a la vostra factura actual. Podeu trobar més informació a l\'apartat FAQ',
                INFORMACIO_OPCIONAL: 'Informació opcional',
                HELP_POPOVER_OPTIONAL_INFO: 'No és obligatòria, però sí molt recomanable',
                CONSUM_ANUAL_ESTIMAT: 'Consum anual estimat (kW/h)',
                REFERENCIA_CATASTRAL: 'Referència cadestral de l\'immoble',
                HELP_POPOVER_REFERENCIA_CATASTRAL: 'Més informació aquí:<br/><a target="_blank" href="https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=CONSULTA">Espanya</a><br/><a target="_blank" href="http://www.bizkaia.net/home2/Temas/DetalleTema.asp?Tem_Codigo=5181&Idioma=CA">Bizkaia</a><br/><a target="_blank" href="http://catastroalava.tracasa.es/navegar/?lang=es">Araba</a><br/><a target="_blank" href="http://www4.gipuzkoa.net/ogasuna/catastro/presenta.asp">Guipuzkoa</a>',
                ADJUNTAR_ULTIMA_FACTURA: 'Adjuntar última factura elèctrica (PDF o JPG) - 10Mb màxim',
                BAD_EXTENSION: 'Adjuntar només PDF o JPG',
                SEGUENT_PAS: 'Següent pas',
                PAS_ANTERIOR: 'Pas anterior',
                DADES_TITULAR_NOU_CONTRACTE: 'Dades del/la titular del nou contracte amb Som Energia',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: 'Poseu les dades de qui serà el titular del nou contracte amb Som Energia. Pot ser el mateix que apareix en el vostre contracte anterior o podeu aprofitar per canviar-ho.',
                VOLS_FER_CANVI_TITULAR: 'Vols fer un canvi de titular?',
                SI: 'Sí',
                NO: 'No',
                HELP_POPOVER_OWNER: 'Comparat amb el vostre contracte actual, al nou contracte voleu posar a una altre persona de titular?',
                EL_TITULAR_ES: 'El titular és',
                EL_TITULAR_ES_SOCI_VINCULAT_AL_CONTRACTE: 'El titular és el soci vinculat a aquest contracte?',
                DADES_PAGAMENT: 'Dades de pagament',
                QUI_ES_TITULAR_COMPTE_BANCARI: 'Qui és el titular del compte bancari?',
                TITULAR_CONTRACTE_ELECTRICITAT: 'Titular del contracte d\'electricitat',
                SOCI_SOM_ENERGIA: 'Soci/a de Som Energia',
                ALTRE_TITULAR: 'Un altre titular',
                NUM_COMPTE: 'Número de compte bancari',
                BANC: 'Banc',
                OFICINA: 'Oficina',
                COMPTE: 'Número compte',
                CONFIRMO_TITULAR_COMPTE_ACCEPTA_DOMICILIACIO: 'Confirmo que el titular del compte bancari autoritza la dominicilació de les factures d\'electricitat',
                SOM_UNA_COOPERATIVA_SENSE_ANIM_DE_LUCRE: 'Som una Cooperativa sense ànim de lucre amb l\'objectiu ferm de canviar el model energètic',
                VOLS_PARTICIPAR_AMB_LA_TEVA_ENERGIA: 'Vols participar amb la teva energia a fer-ho possible?',
                DONATIU_VOLUNTARI: 'Donatiu voluntari de 0,01€/kWh',
                ELS_SOCIS_I_SOCIES_QUE_HO_DESITGIN_PODEN_REALITZAR_UN_DONATIU_VOLUNTARI: 'Els socis i sòcies que ho desitgin poden realitzar un donatiu voluntari de 0,01€/kWh destinat a recolzar i facilitar l\'acció social i voluntària dels més de 50 Grups Locals repartits pel territori. Per un consum mitjà d\'una família (aproximadament 300kWh/mes) això representa un increment de 3€ mensuals. Sempre que ho vulguis podràs activar o desactivar aquest donatiu a l\'instant des de l\'Oficinal Virtual.',
                CONFIRMAR_CONTRACTACIO: 'Confirmar contractació',
                LOADING: 'Enviant dades...',
                ENVIANT_DADES: 'Si has adjuntat una factura aquest procès pot tardar una estona i aquesta estona dependrà del pes de l\'arxiu i de la teva connexió a internet. Ànims i bona energia, que ja gairebé ho has aconseguit! :)'
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
