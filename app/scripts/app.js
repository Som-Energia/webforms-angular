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
    .config(function ($routeProvider, $sceDelegateProvider) {
//    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'http://rawgit.com/Som-Energia/new-api-webforms/master/app/views/main.html',
//                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/prepagament', {
                templateUrl: 'http://rawgit.com/Som-Energia/new-api-webforms/master/app/views/prepayment.html',
//                templateUrl: 'views/prepayment.html',
                controller: 'PrepaymentCtrl'
            })
            .when('/:locale', {
                templateUrl: 'http://rawgit.com/Som-Energia/new-api-webforms/master/app/views/main.html',
//                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/:locale/soci', {
                templateUrl: 'http://rawgit.com/Som-Energia/new-api-webforms/master/app/views/main.html',
//                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/:locale/contractacio', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
//        $locationProvider.html5Mode(true);
        $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/rawgit.com/.+$')]);
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
                ACCEPTO_POLITICA_PRIVACITAT: 'Acepto la <strong><a target="_blank" href="http://www.somenergia.coop/politica-de-privacidad-cookies-y-aviso-legal/">política de privacidad</a></strong> de Som Energia',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Acepto las <strong><a target="_blank" href="http://www.somenergia.coop/condiciones-del-contrato-de-som-energia/">condiciones generales del contrato</a></strong> i la <strong><a target="_blank" href="http://www.somenergia.coop/politica-de-privacidad-cookies-y-aviso-legal/">política de privacidad</a></strong>',
                METODE_PAGAMENT: 'Forma de pago',
                REBUT_BANCARI: 'Recibo bancario',
                TARGETA_CREDIT: 'Tarjeta de crédito',
                COST: 'Coste para la cooperativa',
                INFO_APORTACIO: 'La aportación para ser socio/a es de 100€<br/>Los 100€ se pagan una sola vez, no hay cuota anual y son retornables si te das de baja.',
                FINALITZA_PROCES: 'Finalizar el proceso',
                FORMULARI_NO_DISPONIBLE: 'Formulario no disponible, disculpen las molestias.',
                INVALID: 'Inválido',
                EMAIL_NO_IGUALS: 'Emails diferentes',
                DIGITS_LENGTH_5: 'Tiene que ser un número de 5 dígitos',
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
                NO_ETS_SOCI_FES_TE_AQUI: '¿No eres socio? Hazte socio/a <a href="http://www.somenergia.coop/hazte-socio-a/" target="_blank">aquí</a>!',
                INICIAR_CONTRACTACIO: 'Iniciar contratación',
                DADES_PUNT_SUBMINISTRAMENT: 'Datos del punto de suministro',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Poner los datos tal cual estan en vuestra factura actual. Si queréis hacer cambios de tarifa o poténcia, hace falta que os esperéis a tener primero el contrato con Som Energia para luego solicitarlos. Si queréis hacer un cambio en el titular del contrato, lo podréis hacer en el paso núm.2 de este formulario.',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CUPS: 'Lo encontrarás en tu factura actual. Es un codigo de 20 o 22 cifras y letras. Ejemplo: ES0031031321313W0F',
                HELP_POPOVER_CNAE: 'En caso de ser una vivienda poned: 9820. En caso de ser una empresa poned el de vuestra actividad económica.',
                QUINA_POTENCIA_TENS_CONTRACTADA: '¿Qué potencia tienes contratada?',
                HELP_POPOVER_POWER: 'Anota la poténcia ACTUAL de tu contrato',
                QUINA_TARIFA_TENS_CONTRACTADA: '¿Qué tarifa tienes contratada?',
                SELECCIONAR: 'Seleccionar',
                HELP_POPOVER_RATE: 'Lo encontraréis en vuestra factura actual. Para más información consultar el apartado de Ayuda de la web.',
                INFORMACIO_OPCIONAL: 'Información opcional',
                HELP_POPOVER_OPTIONAL_INFO: 'No es obligatoria, pero si muy recomendable',
                CONSUM_ANUAL_ESTIMAT: 'Consumo anual estimado',
                REFERENCIA_CATASTRAL: 'Referencia catastral del inmueble',
                HELP_POPOVER_REFERENCIA_CATASTRAL: 'Mas información aquí:<br/><a target="_blank" href="https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=CONSULTA">España</a><br/><a target="_blank" href="http://www.bizkaia.net/home2/Temas/DetalleTema.asp?Tem_Codigo=5181&Idioma=CA">Bizkaia</a><br/><a target="_blank" href="http://catastroalava.tracasa.es/navegar/?lang=es">Araba</a><br/><a target="_blank" href="http://www4.gipuzkoa.net/ogasuna/catastro/presenta.asp">Guipuzkoa</a><br/><a target="_blank" href="https://catastro.navarra.es/">Navarra</a>',
                ADJUNTAR_ULTIMA_FACTURA: 'Adjuntar la última factura eléctrica (PDF o JPG) - 10Mb máximo',
                BAD_EXTENSION: 'Adjuntar sólo archivos PDF o JPG',
                OVERFLOW_FILE: 'El archivo adjunto NO puede ocupar més de 10Mb',
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
                ENVIANT_DADES: 'Si has adjuntado una factura este proceso puede tardar un tiempo y este tiempo dependerá del peso del archivo y de tu conexión a internet. Ánimos y buenas energías, que ya casi lo has conseguido! :)',
                REVISIO_CONFIRMACIO_DADES: 'Revisión y confirmación de los datos',
                EL_CONTRACTE_CANVIA_TITULAR: '¿El contrato cambia de titular?',
                TARIFA: 'Tarifa',
                POTENCIA_CONTRACTADA: 'Potencia contratada',
                NOM_O_RAO_SOCIAL: 'Nombre o razón social',
                SI_LES_DADES_SON_CORRECTES: 'Si los datos son correctos pulse Sí para finalizar el proceso de contratación',
                SI_TOT_CORRECTE: 'Sí, todo correcto'
            })
            .translations('ca', {
                SELECCIONA: 'Selecciona',
                PARTICULAR: 'Persona física',
                EMPRESA: 'Persona jurídica',
                OBLIGATORI: 'Obligatori',
                IDIOMA: 'Idioma',
                SELECCIONA_IDIOMA: 'Selecciona idioma',
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
                ACCEPTO_POLITICA_PRIVACITAT: 'Accepto la <strong><a target="_blank" href="http://www.somenergia.coop/ca/politica-de-privacitat-cookies-i-avis-legal/">política de privacitat</a></strong> de Som Energia',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Accepto les <strong><a target="_blank" href="http://www.somenergia.coop/ca/condicions-del-contracte-de-som-energia/">condicions generals del contracte</a></strong> i la <strong><a target="_blank" href="http://www.somenergia.coop/ca/politica-de-privacitat-cookies-i-avis-legal/">política de privacidad</a></strong>',
                METODE_PAGAMENT: 'Mètode de pagament',
                REBUT_BANCARI: 'Rebut bancari',
                TARGETA_CREDIT: 'Targeta de crèdit',
                COST: 'Cost per a la cooperativa',
                INFO_APORTACIO: 'L\'aportació per a esdevenir soci/a és de 100€<br/>Els 100€ es paguen una sola vegada, no hi ha quota anual i són retornables si et dones de baixa.',
                FINALITZA_PROCES: 'Finalitzar el procés',
                FORMULARI_NO_DISPONIBLE: 'Formulari no disponible, disculpeu les molèsties.',
                INVALID: 'Invàlid',
                EMAIL_NO_IGUALS: 'Emails diferents',
                DIGITS_LENGTH_5: 'Ha de ser un número amb 5 dígits',
                REGISTRE_EXISTENT: 'Aquest registre ja existeix',
                REGISTRE_OK: 'Felicitats!',
                REGISTRE_OK_MSG: 'Has completat el registre correctament',
                ACCEDINT_SERVEI_PAGAMENT: 'Accedint al servei de pagament',
                FORMULARI_CONTRACTACIO: 'Formulari de contractació',
                NUMERO_SOCI: 'Número de soci/a',
                HELP_POPOVER_DNI: 'Exemple núm. soci: 1250 Exemple DNI: 12345678P (amb lletra final)',
                HELP_POPOVER_IDIOMA: 'Aquest serà l\'idioma amb el que ens comunicarem amb tu a partir d\'ara',
                CARREGAR_DADES_SOCI_VINCULAT: 'Carregar les dades del soci/a vinculat',
                SOCI_VINCULAT: 'Soci vinculat',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'No trobem cap soci/a vinculat a aquestes dades!',
                NO_ETS_SOCI_FES_TE_AQUI: 'No ets soci/a? Fes-te soci/a <a href="http://www.somenergia.coop/ca/fes-te-soci-a/" target="_blank">aquí</a>!',
                INICIAR_CONTRACTACIO: 'Iniciar contractació',
                DADES_PUNT_SUBMINISTRAMENT: 'Dades del punt de subministrament',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Poseu-hi les dades tal i com estan en la factura actual. Si voleu fer canvis de tarifa o potència, cal que us espereu a tenir el contracte amb Som Energia per solicitar-nos-els. Si voleu fer un canvi de titular, el podreu fer en el pas núm. 2 d\'aquest formulari.',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CUPS: 'Ho trobareu a la vostra factura actual. És un codi de 20 o 22 xifres i lletres. Exemple: ES0031031321313W0F',
                HELP_POPOVER_CNAE: 'En cas d\'habitatges: 9820. En cas d\'empreses el de la vostra activitat econòmica',
                QUINA_POTENCIA_TENS_CONTRACTADA: 'Quina potència tens contractada?',
                HELP_POPOVER_POWER: 'Anota la potència ACTUAL del teu contracte',
                QUINA_TARIFA_TENS_CONTRACTADA: 'Quina tarifa tens contractada?',
                SELECCIONAR: 'Seleccionar',
                HELP_POPOVER_RATE: 'Ho trobareu a la vostra factura actual. Podeu trobar més informació a l\'apartat FAQ',
                INFORMACIO_OPCIONAL: 'Informació opcional',
                HELP_POPOVER_OPTIONAL_INFO: 'No és obligatòria, però sí molt recomanable',
                CONSUM_ANUAL_ESTIMAT: 'Consum anual estimat (kW/h)',
                REFERENCIA_CATASTRAL: 'Referència cadastral de l\'immoble',
                HELP_POPOVER_REFERENCIA_CATASTRAL: 'Més informació aquí:<br/><a target="_blank" href="https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=CONSULTA">Espanya</a><br/><a target="_blank" href="http://www.bizkaia.net/home2/Temas/DetalleTema.asp?Tem_Codigo=5181&Idioma=CA">Bizkaia</a><br/><a target="_blank" href="http://catastroalava.tracasa.es/navegar/?lang=es">Araba</a><br/><a target="_blank" href="http://www4.gipuzkoa.net/ogasuna/catastro/presenta.asp">Guipuzkoa</a><br/><a target="_blank" href="https://catastro.navarra.es/">Navarra</a>',
                ADJUNTAR_ULTIMA_FACTURA: 'Adjuntar última factura elèctrica (PDF o JPG) - 10Mb màxim',
                BAD_EXTENSION: 'Adjuntar només arxius PDF o JPG',
                OVERFLOW_FILE: 'L\'arxiu adjunt NO pot ocupar més de 10Mb',
                SEGUENT_PAS: 'Següent pas',
                PAS_ANTERIOR: 'Pas anterior',
                DADES_TITULAR_NOU_CONTRACTE: 'Dades del/la titular del nou contracte amb Som Energia',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: 'Poseu les dades de qui serà el titular del nou contracte amb Som Energia. Pot ser el mateix que apareix en el vostre contracte anterior o podeu aprofitar per canviar-ho.',
                VOLS_FER_CANVI_TITULAR: 'Vols fer un canvi de titular?',
                SI: 'Sí',
                NO: 'No',
                HELP_POPOVER_OWNER: 'Comparat amb el vostre contracte actual, al nou contracte voleu posar a una altra persona de titular?',
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
                ENVIANT_DADES: 'Si has adjuntat una factura aquest procès pot tardar una estona i aquesta estona dependrà del pes de l\'arxiu i de la teva connexió a internet. Ànims i bona energia, que ja gairebé ho has aconseguit! :)',
                REVISIO_CONFIRMACIO_DADES: 'Revisió i confirmació de les dades',
                EL_CONTRACTE_CANVIA_TITULAR: 'El contracte canvia de titular?',
                TARIFA: 'Tarifa',
                POTENCIA_CONTRACTADA: 'Potència contractada',
                NOM_O_RAO_SOCIAL: 'Nom o raó social',
                SI_LES_DADES_SON_CORRECTES: 'Si les dades són correctes premi Sí per finalitzar el procés de contractació',
                SI_TOT_CORRECTE: 'Sí, tot correcte'
            })
           .translations('gl', {
                SELECCIONA: 'Selecciona',
                PARTICULAR: 'Persoa física',
                EMPRESA: 'Persoa xurídica',
                OBLIGATORI: 'Obrigatorio',
                IDIOMA: 'Idioma',
                SELECCIONA_IDIOMA: 'Selecciona idioma',
                NOM: 'Nome',
                COGNOMS: 'Apelidos',
                RAO_SOCIAL: 'Razón social',
                PERSONA_REPRESENTANT: 'Persoa representante',
                REPETEIX_EMAIL: 'Repetir email',
                TELEFON: 'Teléfono',
                ADRECA: 'Enderezo',
                CODI_POSTAL: 'Código postal',
                PROVINCIA: 'Provincia',
                POBLACIO: 'Poboación',
                ACCEPTO_POLITICA_PRIVACITAT: 'Acepto a <strong><a target="_blank" href="http://www.somenergia.coop/gl/politica-de-privacidade-cookies-y-aviso-legal/">política de privacidade</a></strong> de Som Energia',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Acepto as <strong><a target="_blank" href="http://www.somenergia.coop/gl/condicions-xerais-do-contrato-de-subministro-de-enerxia-electrica/">condicións xerais do contrato</a></strong> e a <strong><a target="_blank" href="http://www.somenergia.coop/gl/politica-de-privacidade-cookies-y-aviso-legal/">política de privacidade</a></strong>',
                METODE_PAGAMENT: 'Forma de pagamento',
                REBUT_BANCARI: 'Recibo bancario',
                TARGETA_CREDIT: 'Tarxeta de crédito',
                COST: 'Custe para a cooperativa',
                INFO_APORTACIO: 'A achega para ser socio/a é de 100€<br/>Os 100€ páganse unha soa vez, non hai cota anual e devólvense se te das de baixa.',
                FINALITZA_PROCES: 'Finalizar o proceso',
                FORMULARI_NO_DISPONIBLE: 'Formulario non dispoñible, desculpen as molestias.',
                INVALID: 'Inválido',
                EMAIL_NO_IGUALS: 'Emails diferentes',
                REGISTRE_EXISTENT: 'Este rexistro xa existe',
                REGISTRE_OK: 'Parabéns!',
                REGISTRE_OK_MSG: 'Completaches o rexistro correctamente',
                ACCEDINT_SERVEI_PAGAMENT: 'A acceder ao servizo de pago',
                FORMULARI_CONTRACTACIO: 'Formulario de contratación',
                NUMERO_SOCI: 'Número de socio/a',
                HELP_POPOVER_DNI: 'Exemplo núm. socio: 1250 Exemplo DNI: 12345678P (con letra final)',
                HELP_POPOVER_IDIOMA: 'Este será o idioma co que nos comunicaremos a partir de agora',
                CARREGAR_DADES_SOCI_VINCULAT: 'Cargar datos do/a socio/a vinculado',
                SOCI_VINCULAT: 'Socio vinculado',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'Non se atopou ningún socio/a vinculado a estos datos!',
                NO_ETS_SOCI_FES_TE_AQUI: 'Non es socio/a? Faite socio/a <a href="http://www.somenergia.coop/gl/faite-socio-a/" target="_blank">aquí</a>!',
                INICIAR_CONTRACTACIO: 'Iniciar contratación',
                DADES_PUNT_SUBMINISTRAMENT: 'Datos do punto de subministro',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Poñer os datos tal e como están na túa factura actual. Se queres facer cambios de tarifa ou potencia, fai falla que agardes a ter primeiro o contrato con Som Energia para logo solicitalos. Se queres facer un cambio no titular do contrato, poderalo facer no paso  núm.2 deste formulario.',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CUPS: 'Atoparalo na túa factura actual. É un código de 20 ou 22 díxitos e letras.',
                HELP_POPOVER_CNAE: 'En caso de ser unha vivenda poñer: 9820. En caso de ser unha empresa pon o da túa actividade económica.',
                QUINA_POTENCIA_TENS_CONTRACTADA: 'Que potencia tes contratada?',
                HELP_POPOVER_POWER: 'Anota a potencia ACTUAL do teu contrato',
                QUINA_TARIFA_TENS_CONTRACTADA: 'Que tarifa tes contratada?',
                SELECCIONAR: 'Seleccionar',
                HELP_POPOVER_RATE: 'Atoparalo na túa factura actual. Para máis información consulta o apartado de Axuda da web.',
                INFORMACIO_OPCIONAL: 'Información opcional',
                HELP_POPOVER_OPTIONAL_INFO: 'Non é obrigatoria, mais si moi recomendable',
                CONSUM_ANUAL_ESTIMAT: 'Consumo anual estimado',
                REFERENCIA_CATASTRAL: 'Referencia catastral do inmoble',
                ADJUNTAR_ULTIMA_FACTURA: 'Anexar a última factura eléctrica (PDF ou JPG) - 10Mb máximo',
                BAD_EXTENSION: 'Anexar só PDF ou JPG',
                SEGUENT_PAS: 'Seguinte paso',
                PAS_ANTERIOR: 'Paso anterior',
                DADES_TITULAR_NOU_CONTRACTE: 'Datos da persoa titular do contrato',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: 'Poñer os datos de quen vai a ser a titular do novo contrato con Som Energia. Pode ser a mesma persoa que aparece no teu contrato anterior ou podes aproveitar agora para mudalo',
                VOLS_FER_CANVI_TITULAR: 'Queres facer un cambio de titular?',
                SI: 'Si',
                NO: 'Non',
                HELP_POPOVER_OWNER: 'Comparado co teu contrato actual, no novo contrato queres poñer a outra persoa de titular?',
                EL_TITULAR_ES: 'A persoa titular é',
                EL_TITULAR_ES_SOCI_VINCULAT_AL_CONTRACTE: 'A persoa titular é socia vinculada ao contrato?',
                DADES_PAGAMENT: 'Datos de pago',
                QUI_ES_TITULAR_COMPTE_BANCARI: 'Quen é a persoa titular da conta bancaria?',
                TITULAR_CONTRACTE_ELECTRICITAT: 'Titular do contrato de electricidade',
                SOCI_SOM_ENERGIA: 'Socio/a de Som Energia',
                ALTRE_TITULAR: 'Outra titular',
                NUM_COMPTE: 'Número de conta bancaria',
                BANC: 'Banco',
                OFICINA: 'Oficina',
                COMPTE: 'Número de conta',
                CONFIRMO_TITULAR_COMPTE_ACCEPTA_DOMICILIACIO: 'Confirmo que a persoa titular da conta bancaria autoriza a domiciliación das facturas de electricidade',
                SOM_UNA_COOPERATIVA_SENSE_ANIM_DE_LUCRE: 'Somos unha Cooperativa sen ánimo de lucro co obxectivo firme de mudar o modelo enerxético',
                VOLS_PARTICIPAR_AMB_LA_TEVA_ENERGIA: 'Queres participar coa túa enerxía a facelo posible?',
                DONATIU_VOLUNTARI: 'Donativo voluntario',
                ELS_SOCIS_I_SOCIES_QUE_HO_DESITGIN_PODEN_REALITZAR_UN_DONATIU_VOLUNTARI: 'Os socios e socias que o desexen poden realizar un donativo voluntario',
                CONFIRMAR_CONTRACTACIO: 'Confirmar contratación',
                LOADING: 'A enviar os datos...',
                ENVIANT_DADES: 'Se anexaches unha factura este proceso pode demorar un tempo e este tempo dependerá do peso do ficheiro e da túa conexión a internet. Ánimo e boa enerxía, que xa case o conseguiches! :)',
                REVISIO_CONFIRMACIO_DADES: 'Revisión e confirmación dos datos',
                EL_CONTRACTE_CANVIA_TITULAR: 'O contrato cambia de titular?',
                TARIFA: 'Tarifa',
                POTENCIA_CONTRACTADA: 'Potencia contratada',
                NOM_O_RAO_SOCIAL: 'Nome ou razón social',
                SI_LES_DADES_SON_CORRECTES: 'Se os datos son correctos preme Si para finalizar o proceso de contratación',
                SI_TOT_CORRECTE: 'Si, todo correcto'
            })
           .translations('eu', {
                SELECCIONA: 'Aukera ezazu',
                PARTICULAR: 'Pertsona fisikoa',
                EMPRESA: 'Pertsona juridikoa',
                OBLIGATORI: 'Derrigorrezkoa',
                IDIOMA: 'Hizkuntza',
                SELECCIONA_IDIOMA: 'Aukera ezazu hizkuntza',
                NOM: 'Izena',
                COGNOMS: 'Abizenak',
                RAO_SOCIAL: 'Izen-soziala',
                PERSONA_REPRESENTANT: 'Legezko ordezkaria',
                REPETEIX_EMAIL: 'Emaila errepikatu',
                TELEFON: 'Telefonoa',
                ADRECA: 'Helbidea',
                CODI_POSTAL: 'Posta-kodea',
                PROVINCIA: 'Probintzia',
                POBLACIO: 'Herria',
                ACCEPTO_POLITICA_PRIVACITAT: 'Som Energiaren <strong><a target="_blank" href="http://www.somenergia.coop/eu/pribatutasun-politika-cookie-ak-eta-lege-oharra/">pribatutasun-politika</a></strong>onartzen dut',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Kontratuaren baldintza orokorrak <strong><a target="_blank" href="http://www.somenergia.coop/eu/energia-elektriko-hornikuntzaren-kontratuko-baldintza-orokorrak/">onartzen ditut</a></strong> i la <strong><a target="_blank" href="http://www.somenergia.coop/eu/pribatutasun-politika-cookie-ak-eta-lege-oharra/">pribatutasun-politika</a></strong>',
                METODE_PAGAMENT: 'Ordainketa-era',
                REBUT_BANCARI: 'Banku-ordainagiria',
                TARGETA_CREDIT: 'Kreditu-txartela',
                COST: 'Kooperatibarako kostua',
                INFO_APORTACIO: 'Bazkide izateko ekarpena 100 €-koa da<br/>100€ behin ordaintzen dira, ez dago urteko kuotarik eta kooperatiban baja eman ezkero bueltan itzuliko dira.',
                FINALITZA_PROCES: 'Prozesua amaitu',
                FORMULARI_NO_DISPONIBLE: 'Formularioa ez dago eskuragarri, barkatu eragozpenak.',
                INVALID: '<Baliogabea',
                EMAIL_NO_IGUALS: 'Email desberdinak',
                REGISTRE_EXISTENT: 'Badago erregistroa',
                REGISTRE_OK: 'Zorionak!',
                REGISTRE_OK_MSG: 'Erregistroa zuzen amaitu duzu',
                ACCEDINT_SERVEI_PAGAMENT: 'Ordainketa-zerbitzura sartzen',
                FORMULARI_CONTRACTACIO: 'Kontratatzeko formularioa',
                NUMERO_SOCI: 'Bazkide zenbakia',
                HELP_POPOVER_DNI: 'Adibide bazkide zbk: 1250 Adibide NAN: 12345678P (azkenengo letra barne)',
                HELP_POPOVER_IDIOMA: 'Hemendik aurrera elkarrekin harremanetan jartzeko hizkuntza hau izango da',
                CARREGAR_DADES_SOCI_VINCULAT: 'Elkartutako bazkidearen datuak kargatu',
                SOCI_VINCULAT: 'Elkartutako bazkidea',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'Ez da datu hauetara inolako elkartutako bazkiderik aurkitu!',
                NO_ETS_SOCI_FES_TE_AQUI: 'Oraindik ez zara bazkide? Egin zaitez bazkide <a href="http://www.somenergia.coop/eu/izan-zaitez-bazkide/" target="_blank">hemen</a>!',
                INICIAR_CONTRACTACIO: 'Kontratazioa hasi',
                DADES_PUNT_SUBMINISTRAMENT: 'Hornidura-puntuaren datuak',
                DADES_PUNT_SUBMINISTRAMENT_HELPER: 'Jar itzazue datuak oraingo fakturan agertzen diren bezala. Tarifa edo Potentzia aldaketak egin nahi izatekotan, lehenengo eta behin Som Energiarekin kontratua izan, eta gero aldaketak eskatu behar dituzue. Kontratuaren titularrean aldekataren bat egin nahi izatekotan, formulario honetako 2. pausoan egin dezakezue.',
                NUMERO_DE_CUPS: 'CUPS-en zenbakia',
                HELP_POPOVER_CUPS: 'Zure oraingo fakturan aurkituko duzu. 20 edo 22 digituren eta letraren kodigoa da.',
                HELP_POPOVER_CNAE: 'Etxebizitza izatekotan, jar ezazu: 9820. Enpresa izatekotan, jar ezazu zuen jarduera ekonomikoa.',
                QUINA_POTENCIA_TENS_CONTRACTADA: 'Zer potentzia daukazu oraingo kontratuan?',
                HELP_POPOVER_POWER: 'Idatz ezazu zure kontratuaren ORAINGO potentzia',
                QUINA_TARIFA_TENS_CONTRACTADA: 'Zer tarifa daukazu oraingo kontratuan?',
                SELECCIONAR: 'Aukera ezazu',
                HELP_POPOVER_RATE: 'Zure oraingo fakturan aurkituko duzu. Informazio gehigarria nahi baduzu, kontsulta ezazu web orriaren Laguntza arloa.',
                INFORMACIO_OPCIONAL: 'Aukerako informazioa',
                HELP_POPOVER_OPTIONAL_INFO: 'Ez da beharrezkoa baina bai gomendagarria.',
                CONSUM_ANUAL_ESTIMAT: 'Urteko kontsumo balioztatua',
                REFERENCIA_CATASTRAL: 'Etxearen katrastoko erreferentzia',
                ADJUNTAR_ULTIMA_FACTURA: 'Gehi ezazu azkenengo faktura elektrikoa (PDF edo JPG) – Gehienezko 10Mb',
                BAD_EXTENSION: 'Gehi ezazu PDF edo JPG soilik',
                SEGUENT_PAS: 'Hurrengo pausoa',
                PAS_ANTERIOR: 'Aurreko pausoa',
                DADES_TITULAR_NOU_CONTRACTE: 'Kontratuaren titularraren datuak',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: 'Jar itzazue Som Energiarekiko kontratu berriaren titularraren datuak. Aurreko kontratuaren titular berdina izan liteke edo aprobetxa ezazue titularra aldatzeko.',
                VOLS_FER_CANVI_TITULAR: 'Titularraren aldaketa egin nahi duzu?',
                SI: 'Bai',
                NO: 'Ez',
                HELP_POPOVER_OWNER: 'Zure oraingo kontratuarekin konparatuta, kontratu berrian beste titular bat jarri nahi al duzu?',
                EL_TITULAR_ES: 'Titularra da',
                EL_TITULAR_ES_SOCI_VINCULAT_AL_CONTRACTE: 'Titularra kontratu berrira elkartutako bazkidea da?',
                DADES_PAGAMENT: 'Ordainketa egiteko datuak',
                QUI_ES_TITULAR_COMPTE_BANCARI: 'Nor da banku-kontuaren titularra?',
                TITULAR_CONTRACTE_ELECTRICITAT: 'Elektrizitate-kontratuaren titularra',
                SOCI_SOM_ENERGIA: 'Som Energiaren bazkidea',
                ALTRE_TITULAR: 'Beste titular batek',
                NUM_COMPTE: 'Banku-kontuaren zenbakia',
                BANC: 'Bankua',
                OFICINA: 'Bulegoa',
                COMPTE: 'Kontuaren zenbakia',
                CONFIRMO_TITULAR_COMPTE_ACCEPTA_DOMICILIACIO: 'Banku-kontuaren titularrak onartzen duela elektrizitate-fakturen helbideratzea ziurtatzen dut',
                SOM_UNA_COOPERATIVA_SENSE_ANIM_DE_LUCRE: 'Irabazi-asmorik gabeko kooperatiba gara eredu energetikoa aldatzeko asmoz',
                VOLS_PARTICIPAR_AMB_LA_TEVA_ENERGIA: 'Parte hartu nahi duzu zure energiarekin helburu hau lortzeko?',
                DONATIU_VOLUNTARI: 'Borondatezko ekarpena',
                ELS_SOCIS_I_SOCIES_QUE_HO_DESITGIN_PODEN_REALITZAR_UN_DONATIU_VOLUNTARI: 'Bazkideek borondatezko oparia egin lezakete',
                CONFIRMAR_CONTRACTACIO: 'Kontratazioa baieztatu',
                LOADING: 'Datuak bidaltzen...',
                ENVIANT_DADES: 'Faktura bat gehitzekotan prozesua amaitzeak denbora dexente iraun lezake, arxtibategiaren pisuaren edota zure Internet-konexioaren arabera. Anima zaitez eta energia on, ia amaitu duzu! :)',
		        REVISIO_CONFIRMACIO_DADES: 'Datuak errepasatu eta konfirmatu',
		        EL_CONTRACTE_CANVIA_TITULAR: 'Kontratua titularrez aldatzen al da?',
		        TARIFA: 'Tarifa',
		        POTENCIA_CONTRACTADA: 'Potentzia kontratatua',
		        NOM_O_RAO_SOCIAL: 'Enpresa izena edo izen soziala',
		        SI_LES_DADES_SON_CORRECTES: 'Datuak zuzenak badira klikatu bai kontratazio prozesua amaitzeko',
		        SI_TOT_CORRECTE: 'Bai, dena zuzena da'
            })
            .preferredLanguage('es')
        ;
    })
    .constant('cfg', {
        API_BASE_URL: 'https://api.somenergia.coop/',
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
        RATE_21A: '2.1A',
        RATE_21DHA: '2.1DHA',
        RATE_30A: '3.0A',
        DEFAULT_MILLISECONDS_DELAY: 1000,
        MAX_MB_FILE_SIZE: 10,
        THOUSANDS_CONVERSION_FACTOR: 1000
    })
;
