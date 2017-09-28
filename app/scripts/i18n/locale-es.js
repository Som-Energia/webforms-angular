'use strict';

angular.module('SomEnergiaWebForms')
    .config(function($translateProvider) {
        $translateProvider
            .translations('es', {
                SELECCIONA: 'Selecciona',
                PARTICULAR: 'Persona física',
                EMPRESA: 'Persona jurídica',
                OBLIGATORI: 'Obligatorio',
                IDIOMA: 'Idioma',
                SELECCIONA_IDIOMA: 'Selecciona el idioma',
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
                ACCEPTO_POLITICA_PRIVACITAT: 'Acepto la <strong><a target="_blank" href="//www.somenergia.coop/es/politica-de-privacidad-cookies-y-aviso-legal/">política de privacidad</a></strong> de Som Energia',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Acepto las <strong><a target="_blank" href="//www.somenergia.coop/es/condiciones-del-contracto-de-som-energia/">condiciones generales del contrato</a></strong> i la <strong><a target="_blank" href="//www.somenergia.coop/es/politica-de-privacidad-cookies-y-aviso-legal/">política de privacidad</a></strong>',
                METODE_PAGAMENT: 'Forma de pago',
                REBUT_BANCARI: 'Recibo bancario',
                TARGETA_CREDIT: 'Tarjeta de crédito',
                COST: 'coste para la cooperativa',
                INFO_APORTACIO: 'La aportación para ser socio/a es de 100€<br/>Los 100€ se pagan una sola vez, no hay cuota anual y son retornables si te das de baja.',
                FINALITZA_PROCES: 'Continuar el proceso',
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
                HELP_POPOVER_IDIOMA: 'Éste será el idioma con el que nos comunicaremos a partir de ahora',
                CARREGAR_DADES_SOCI_VINCULAT: 'Cargar datos del socio/a viculado',
                SOCI_VINCULAT: 'Socio vinculado',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'No se ha encontrado ningún socio/a vinculado a estos datos!',
                NO_ETS_SOCI_FES_TE_AQUI: '¿No eres socio? Hazte socio/a <a href="//www.somenergia.coop/es/hazte-socio-a/" target="_blank">aquí</a>!',
                INICIAR_CONTRACTACIO: 'Iniciar contratación',
                DADES_PUNT_SUBMINISTRAMENT: 'Datos del punto de suministro',
                NUMERO_DE_CUPS: 'Número de CUPS',
                HELP_POPOVER_CNAE: 'En caso de ser una vivienda poned: 9820. En caso de ser una empresa poned el de vuestra actividad económica.',
                QUINA_POTENCIA_TENS_CONTRACTADA: '¿Qué potencia tienes contratada?',
                HELP_POPOVER_POWER: 'Anota la potencia ACTUAL de tu contrato',
                QUINA_TARIFA_TENS_CONTRACTADA: '¿Qué tarifa tienes contratada?',
                SELECCIONAR: 'Seleccionar',
                INFORMACIO_OPCIONAL: 'Información opcional',
                ADJUNTAR_ULTIMA_FACTURA: 'Adjuntar la última factura eléctrica (PDF o JPG) - 10Mb máximo',
                BAD_EXTENSION: 'Adjuntar sólo archivos PDF o JPG',
                OVERFLOW_FILE: 'El archivo adjunto NO puede ocupar más de 10Mb',
                SEGUENT_PAS: 'Siguiente paso',
                PAS_ANTERIOR: 'Paso anterior',
                AVIS_CANVI_TITULAR: '<span class="glyphicon glyphicon-warning-sign"></span>&nbsp;Atención: En ciertos casos, la distribuidora puede solicitar la renovación del Boletín de la Instalación, si este está caducado (20 años). Más información <a target="_blank" href="http://es.support.somenergia.coop/article/505-que-es-el-boletin-electrico">aquí</a>',
                SI: 'Sí',
                NO: 'No',
                DADES_PAGAMENT: 'Datos de pago',
                TITULAR_CONTRACTE_ELECTRICITAT: 'Titular del contrato de electricidad',
                SOCI_SOM_ENERGIA: 'Socio/a de Som Energia',
                ALTRE_TITULAR: 'Otro titular',
                NUM_COMPTE: 'Número de cuenta bancaria',
                IBAN_EXEMPLE: 'ejemplo IBAN',
                BANC: 'Banco',
                OFICINA: 'Oficina',
                COMPTE: 'Número cuenta',
                CONFIRMO_TITULAR_COMPTE_ACCEPTA_DOMICILIACIO: 'Confirmo que la persona titular de la cuenta bancaria autoriza la domicilación de las facturas de electricidad',
                SOM_UNA_COOPERATIVA_SENSE_ANIM_DE_LUCRE: 'Somos una Cooperativa sin ánimo de lucro con el objetivo firme de cambiar el modelo energético',
                VOLS_PARTICIPAR_AMB_LA_TEVA_ENERGIA: '¿Quieres participar con tu energia a hacerlo posible?',
                DONATIU_VOLUNTARI: 'Donativo voluntario 0,01€/kWh',
                ELS_SOCIS_I_SOCIES_QUE_HO_DESITGIN_PODEN_REALITZAR_UN_DONATIU_VOLUNTARI: 'Los socios que lo deseen pueden realizar un donativo voluntario de 0,01€/kWh destinado a apoyar y facilitar la acción social y voluntaria de los más de 50 Grupos Locales repartidos por el territorio. Para un consumo medio de una familia (aproximadamente 300kWh/mes) esto representa un incremento de 3€ mensuales. Siempre que lo desees podrás activar o desactivar este donativo al instante desde la Oficinal Virtual.',
                CONFIRMAR_CONTRACTACIO: 'Confirmar contratación',
                SENDING: 'Enviando datos...',
                ENVIANT_DADES: 'Si has adjuntado una factura este proceso puede tardar un tiempo y este tiempo dependerá del peso del archivo y de tu conexión a internet. Ánimos y buenas energías, que ya casi lo has conseguido! :)',
                REVISIO_CONFIRMACIO_DADES: 'Revisión y confirmación de los datos',
                EL_CONTRACTE_CANVIA_TITULAR: '¿El contrato cambia de titular?',
                TARIFA: 'Tarifa',
                POTENCIA_CONTRACTADA: 'Potencia contratada',
                NOM_O_RAO_SOCIAL: 'Nombre o razón social',
                SI_TOT_CORRECTE: 'Sí, todo correcto',

                HELP_POPOVER_SOCIA: '¿No recuerdas tu nº de socio/a? Averígualo en el apartado "Datos Personales" de la <a target="_blank" href="https://oficinavirtual.somenergia.coop/">Oficina Virtual</a>.',
                HELP_POPOVER_NIF: 'Ejemplo NIF: 12345678P (con letra final)',
                SOCIA_TROBADA: 'Soci/a encontrado/a',
                VALIDANT_ID: 'Validando documento de identificación...',
                IDENTIFICANT_SOCIA: 'Identificando socio/a...',
                NIF_INVALID: 'Código NIF inválido.',
                SERVER_ERROR: 'Error accediendo al servidor:',
                INICIAR_INVERSIO: 'Iniciar Inversión',
                FORMULARI_D_INVERSIO: 'Formulario de <b>inversión</b>',
                BENVINGUDA: '¡Bienvenido/a, <b>{{name}}</b>!',
                QUANT_VOLS_INVERTIR: '¿Cuánto quieres <b>invertir</b>? <br/> <small>En aportación voluntaria al capital social</small>',
                RECORDA: 'Recuerda: ',
                AMOUNT_HELPER_MIN: 'Mínima aportación 100€',
                AMOUNT_HELPER_MAX: 'Máxima aportación 5.000€',
		AMOUNT_HELPER_MAX_2: 'A partir del 25/10/17: 100.000€',
                AMOUNT_HELPER_STEP: 'Cantidad múltiple de 100€',
                NUMERO_DE_COMPTE_FORMAT_IBAN: 'Número de cuenta en formato IBAN. Ejemplo: ES11 2222 3333 4444 5555 6666',
                CONFIRMO_CONDICIONS_INVERSIO: 'Confirmo que soy titular de la cuenta corriente, autorizo la domiciliación y acepto las <a target="_blank" href="https://somenergia.coop/es/condiciones-generales-inversion">condiciones generales de la inversión</a> y la <a target="_blank" href="https://www.somenergia.coop/es/politica-de-privacidad-cookies-y-aviso-legal/">política de privacidad</a>',
                CONFIRMAR_INVERSIO: 'Confirmar inversión',
                COMPROVANT: 'Comprobando...',
                CORRECTE: 'Correcto',
                INVEST_OK_REDIRECT_URL: 'https://www.somenergia.coop/es/aportacion-realizada-correctamente/',
                CONTRACT_OK_REDIRECT_URL: 'https://www.somenergia.coop/es/contratacion-realizada/',
                GENERATION_OK_REDIRECT_URL: 'http://www.generationkwh.org/es/inversion-realizada/',

                // Added or changed since 1.2.6
                CODI_IBAN_DEL_COMPTE: 'Código IBAN de la cuenta',
                EXEMPLE_IBAN: 'Ejemplo: ES11 2222 3333 4444 5555 6666',
                REQUERIT: 'Requerido.',
                DES_DE_QUIN_COMPTE: '¿Desde qué <b>cuenta bancaria</b>?',
                FORMULARI_D_INVERSIO_GKWH: 'Formulario de inversión para el Generation kWh',
                QUANTES_ACCIONS_ENERGETIQUES_VOLS: '¿Cuántas <b>acciones energéticas</b> quieres?',
                COST_PER_ACCIO_ENERGETICA: '{{ preuperaccio }}€ por acción energética.',
                KWH_PER_ACCIO_ENERGETICA: '<a href="{{url}}" target="_blank">Previsión actual:</a> {{ kwhperaccio }} kWh por acción energética',
                CARREGANT_INFORMACIO_DELS_TEUS_CONTRACTES: 'Cargando la información de tus contratos...',
                CONTRACTE: 'Contrato',
                PUNT_DE_SUBMINISTRAMENT: 'Punto de suministro',
                US_ANUAL: 'Uso anual',
                TOTAL_US_ANUAL_ESTIMAT: 'Uso anual estimado total',
                PERCENTATGE_ASSOLIT: 'Porcentaje de autoproducción sobre tu uso total',
                GENERATION_RECOMANACIO_PERCENT: 'Puedes autoproducir lo que quieras. Nuestra <a href="{{ url }}" target="_blank">recomendación</a> es no superar el {{ percent }}% en según qué casos.',
                GENERATION_RECOMANACIO_PERCENT_URL: 'http://bit.ly/maxGkWhES', // Points to 'http://es.support.somenergia.coop/article/591-existe-una-cantidad-minima-y-maxima-a-aportar'
                GENERATION_ACCEPTO_DOMICILIACIO: 'Confirmo que soy titular de la cuenta corriente y autorizo la domiciliación',
                GENERATION_ACCEPTO_CONDICIONS: 'Acepto las <a target="_blank" href="{{url}}">condiciones generales de la inversión</a>',
                GENERATION_CONDICIONS_URL: 'http://www.generationkwh.org/wp-content/uploads/Condiciones-Generales-Contrato-Autoproduccion-Colectiva-Generation-kWh_ES.pdf',
                NO_HA_ESTAT_TROBAT: 'No encontrado',
                FENT_SERVIR_RESIDENCIA_MITJANA: 'Se esta usando a modo de referencia el uso de electricidad de una residencia media',
                ADDICIONAL_FERSE_SOCIA: '<b>Atención:</b> A parte de la cantidad que decidas invertir, para ser socio/a tienes que hacer una aportació al capital social de <b>100€</b> que <b>se retornan</b> si te das de baja.',
                ERROR_POST_INVERSIO: 'Error realizando la inversión',
                ERROR_POST_NOVASOCIA: 'Error registrando el/la socio/a',
                ERROR_REQUIRED_FIELD: 'Falta parámetro requerido: {{field}}',
                ERROR_INVALID_FIELD: 'Valor inválido del parámetro: {{field}}, motivo: {{reason}}',
                CARREC_ADICIONAL_NOVA_SOCIA: 'Importe total: {{total}}€ ({{ aportaciosoci }}€ + {{ costaccions }}€)',
                JA_SOC_SOCIA: 'Ya soy socio/a',
                EM_VULL_FER_SOCIA: 'Quiero ser socio/a',
                GENERATION_REQUERIMENT_SER_SOCIA: 'Para participar en esta inversión hay que ser de Som Energia. ¿Cual es tu caso?',
                APORTACIO_REQUERIMENT_SER_SOCIA: 'Para participar en esta inversión hay que ser de Som Energia. ¿Cual es tu caso?',
                APORTACIO_CONDICIONS_URL: 'https://somenergia.coop/es/condiciones-generales-inversion',
                DADES_ALTA: 'Datos del alta en la cooperativa',
                HELP_JURIDICA: 'Personas jurídicas son las empresas, asociaciones y otras entidades. Las personas físicas somos las personas de carne y hueso.',
                COM_CONTACTEM: 'Datos de contacto',
                DOMICILI: 'Domicilio',
                TELEFON_ALTERNATIU: 'Teléfono alternativo',
                APORTACIO_CORRESPONENT: 'Aportación correspondiente',
                AUTOPRODUCCIO_ANUAL: 'Autoproducción anual',
                PREVISIO_GENERATION_URL: 'http://es.support.somenergia.coop/article/589-que-representa-una-accion-energetica',

                // Added or changed since 1.3.2

                CARREGANT_OPCIONS: 'Cargando opciones...',
                OPCIONAL: 'Opcional',
                HI_HA_LLUM_AL_PUNT_DE_SUBMINISTRAMENT: '¿Hay luz actualmente?',
                AVIS_CANVI_COMERCIALITZADORA: 'Sí hay luz. <br/>Con otra comercializadora y quiero cambiar a Som Energia.',
                AVIS_ALTA_DE_SERVEI: 'No hay luz.<br/>Quiero darla de alta directamente con Som Energia.',
                HELP_POPOVER_CUPS: 'Lo encontrareis en vuestra factura actual. Es un código del estilo ES0031031321313W0F.',
                HELP_POPOVER_CUPS_ALTA: 'Es un código que se indica en la factura, del estilo ES0031031321313W0F.<br/>Si no lo tienes, sigue <a target="_blank" href="{{url}}">este enlace</a>',
                HELP_POPOVER_CUPS_ALTA_URL: 'http://es.support.somenergia.coop/article/245-no-tengo-luz-actualmente-puedo-solicitar-un-nuevo-punto-de-consumo',
                REFERENCIA_CADASTRAL: 'Referencia catastral del immueble',
                HELP_POPOVER_REFERENCIA_CADASTRAL: 'Es opcional, nos es útil para resolver incongruencias en los datos.<br/>Puedes buscarla aquí:<br/><a target="_blank" href="https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=CONSULTA">España</a><br/><a target="_blank" href="http://www.bizkaia.net/home2/Temas/DetalleTema.asp?Tem_Codigo=5181&Idioma=CA">Bizkaia</a><br/><a target="_blank" href="http://catastroalava.tracasa.es/navegar/?lang=es">Araba</a><br/><a target="_blank" href="http://www4.gipuzkoa.net/ogasuna/catastro/presenta.asp">Guipuzkoa</a><br/><a target="_blank" href="https://catastro.navarra.es/">Navarra</a>',
                TARIFA_I_POTENCIA: 'Tarifa y potencia',
                TIPUS_INSTALLACIO: '¿Qué tipo de instalación tienes?',
                MONOFASICA_NORMAL: 'Monofásica (Normal)',
                TRIFASICA: 'Trifásica',
                HELP_INSTALL_TYPE: 'Cómo identificar si una instalación es <a target="_blank" href="{{url}}">trifásica o monofásica</a>',
                HELP_INSTALL_TYPE_URL: 'http://es.support.somenergia.coop/article/483-como-puedo-saber-si-tengo-una-instalacion-monofasica-o-trifasica',
                POTENCIA_A_CONTRACTAR: '¿Qué potencia quieres contratar?',
                MES_GRAN_DE_15KW: 'Superior a 15kW',
                HELP_POTENCIA: 'Cómo averiguar <a target="_blank" href="{{url}}">la potencia que necesito</a>',
                HELP_POTENCIA_URL: 'http://es.support.somenergia.coop/article/282-como-puedo-saber-la-potencia-que-necesito',
                DISCRIMINACIO_HORARIA: '¿Quieres discriminación horaria?',
                SENSE_DISCRIMINACIO_HORARIA: 'Sin discriminación horaria',
                AMB_DISCRIMINACIO_HORARIA: 'Con discriminación horaria',
                HELP_DISCRIMINACIO_HORARIA: 'Como puedo saber <a target="_blank" href="{{url}}">si me conviene discriminación horaria o no</a>',
                HELP_DISCRIMINACIO_HORARIA_URL: 'http://es.support.somenergia.coop/article/283-como-puedo-saber-si-me-sale-a-cuenta-tener-discriminacion-horaria',
                ESCULL_LA_POTENCIA_DE_CADA_PERIODE: 'Escoje la potencia de cada periodo',
                HELP_POWER_30: 'Más información sobre los <a target="_blank" href="{{url}}">periodos de la 3.0</a>',
                HELP_POWER_30_URL: 'http://es.support.somenergia.coop/article/176-que-horarios-tienen-los-periodos-de-la-tarifa-3-0a',
                HELP_TARIFA_CANVI_COMERCIALITZADORA: 'Para evitar problemas de tramitación, ponga <b>la misma tarifa y potencia que aparece en la factura actual</b>. Podrá solicitar el cambio de tarifa o potencia una vez esté el contrato activado con nosotros.',
                HELP_TARIFA_ALTA: 'Para completar los campos siguientes le recomendamos pulsar los botones de ayuda.',
                DADES_TITULAR_NOU_CONTRACTE: 'Titular del contrato',
                VOLS_MANTENIR_EL_TITULAR: '¿Se mantiene la persona titular del actual contrato?',
                NO_CANVI_DE_TITULAR: 'Sí.<br/>No quiero cambiar el titular',
                SI_CANVI_DE_TITULAR: 'No.<br/>Quiero cambiar la persona titular aprovechando el cambio a Som Energia',
                QUI_ES_LA_PERSONA_TITULAR: '¿Quién será la persona titular?',
                ALTRA_PERSONA: 'Otra persona',
                ACCEPTO_CONDICIONS_GENERALS: 'Acepto las <strong><a target="_blank" href="{{url}}">condiciones generales del contrato</a></strong>',
                ACCEPTO_CONDICIONS_GENERALS_URL: '//www.somenergia.coop/es/condiciones-del-contrato-de-som-energia/',
                QUI_ES_TITULAR_COMPTE_BANCARI: '¿A nombre de quién está la cuenta donde se domiciliarán los recibos?',
                ALGUN_DELS_TRES_PERIODES_MAJOR_QUE_15: 'Alguno de los tres periodos debe tener más de 15kW',
                CUPS_EXISTENT: 'Ya tenemos un contrato con ese código CUPS',
                CAP_ARXIU_SELECCIONAT: 'Ningún archivo seleccionado',
                HELPER_ADJUNTAR_ULTIMA_FACTURA: 'Un escaneado de la última factura con la actual distribuidora nos ayuda a comprobar cualquier inconsitencia en los datos que has introducido',
                ADJUNTAR_BUTLLETI: 'Adjuntar la documentación para el alta de suministro (PDF o JPG) - 10Mb máximo',
                HELP_ADJUNTAR_BUTLLETI: 'Podrá adjuntar diversos ficheros. En la mayoría de casos se pide el boletín eléctrico pero puede encontrar más información en <a target="_blank" href={{url}}>éste enlace</a>',
                HELP_ADJUNTAR_BUTLLETI_URL: 'http://es.support.somenergia.coop/article/245-no-tengo-luz-actualmente-puedo-solicitar-un-nuevo-punto-de-consumo',
                HELP_POPOVER_RATE: 'Lo encontrará en su factura actual. A veces como "Peaje de acceso".<br/>Puede encontrar más información en el <a target="_blank" href="{{url}}">centro de soporte</a>',
                HELP_POPOVER_RATE_URL: 'http://es.support.somenergia.coop/article/240-que-tarifas-ofrece-la-cooperativa-y-a-que-precio',
                TIPUS_DE_CONTRACTACIO: 'Tipo de contratación',
                ALTA: 'Alta de un punto sin suministro',
                CANVI_DE_COMERCIALITZADORA_I_TITULAR: 'Cambio de comercializadora modificando la persona titular',
                CANVI_DE_COMERCIALITZADORA: 'Cambio de comercializadora manteniendo la persona titular',
                ERROR_POST_CONTRACTE: 'Error enviando el contrato',

                INCOMPLETE_PREVIOUS_STEP: 'No has completado el paso anterior',
                UNSELECTED_NEW_SUPPLY_POINT: 'No has especificado si ya hay luz con otra comercializadora o es un nuevo punto de suministro sin luz',
                NO_SUPPLY_POINT_ADDRESS: 'No has especificado la dirección del punto de suministro',
                NO_SUPPLY_POINT_STATE: 'No has especificado la <b>provincia</b> del punto de suministro',
                NO_SUPPLY_POINT_CITY: 'No has especificado el <b>municipio</b> del punto de suministro',
                INVALID_SUPPLY_POINT_CUPS: 'No has especificado un <b>identificador CUPS</b> válido para el punto de suministro',
                INVALID_SUPPLY_POINT_CNAE: 'No has especificado un <b>código CNAE</b> válido para el punto de suministro',
                INVALID_SUPPLY_POINT_ATTACHMENT: 'El archivo adjunto supera el límite de 10Mbytes',
                NO_MONOPHASE_CHOICE: 'No has especificado si la instalación es de tipo monofásico o trifásico',
                NO_FARE_CHOSEN: 'No has especificado la tarifa',
                NO_POWER_CHOSEN: 'No has especificado la potencia',
                NO_POWER_CHOSEN_P2: 'No has especificado la potencia para el período P2',
                NO_POWER_CHOSEN_P3: 'No has especificado la potencia para el período P3',
                INVALID_POWER_20: 'La potencia para tarifas 2.0 tiene que ser inferior a 10kW',
                INVALID_POWER_21: 'La potencia para tarifas 2.1 tendría que estar entre 10kW y 15kW',
                INVALID_POWER_30: 'Al menos un período tiene que tener una potencia superior o igual a 15kW',
                NO_HOURLY_DISCRIMINATION_CHOSEN: 'No has especificado si quieres discriminación horaria',
                OWNER_CHANGED_NOT_CHOSEN: 'Hay que indicar si se mantiene la actual persona titular del contrato',
                UNACCEPTED_GENERAL_CONDITIONS: 'Hay que aceptar las condiciones generales del contrato',
                INVALID_PAYER_IBAN: 'No has especificado correctamente el <b>IBAN</b> de la cuenta donde domiciliar',
                NO_VOLUNTARY_DONATION_CHOICE_TAKEN: 'Hay que indicar si quieres o no hacer el donativo voluntario',
                UNCONFIRMED_ACCOUNT_OWNER: 'Hay que marcar la casilla para confirmar que la persona indicada es la persona titular de la cuenta',
                UNACCEPTED_GENERAL_CONDITIONS_NON_OWNER_PAYER: 'Si la persona pagadora es diferente de la titular, también tendrá que aceptar las condiciones generales del contrato marcando la casilla',
                NO_PERSON_TYPE: 'No has especificado si es una persona física o jurídica',
                NO_NAME: 'No has especificado el nombre',
                NO_SURNAME: 'No has especificado los apellidos',
                NO_NIF: 'No has especificado el NIF',
                NO_PROXY_NAME: 'No has especificado el nombre de la persona representante',
                NO_PROXY_NIF: 'No has especificado el NIF de la persona representante',
                NO_ADDRESS: 'No has especificado la dirección',
                NO_POSTALCODE: 'No has especificado un código postal correcto',
                NO_STATE: 'No has especificado la provincia',
                NO_CITY: 'No has especificado el municipio',
                NO_EMAIL: 'No has especificado un correo electrónico correcto',
                NO_REPEATED_EMAIL: 'No has repetido el correo electrónico correctamente',
                NO_PHONE: 'No has especificado un teléfono correcto',
                NO_LANGUAGE: 'No has especificado el idioma',
                UNACCEPTED_PRIVACY_POLICY: 'Hay que aceptar la política de privacidad',
                NEW_MEMBER_FORM: 'Nueva persona socia',
                MEMBER_CONTRIBUTION_PAYMENT: 'Pago de la aportación',
                DIRECT_DEBIT: 'Recibo domiciliado',
                NEWMEMBER_OK_REDIRECT_URL: 'https://www.somenergia.coop/es/pago-realizado/',
                NEWMEMBER_KO_REDIRECT_URL: 'https://www.somenergia.coop/es/pago-cancelado/',

                CONTRACT_MODIFICATION_FORM: 'Modificaciones de potencia y/o tarifa',
                MODIFY_POTTAR_INTRO_TITLE: 'Aviso importante',
                MODIFY_POTTAR_INTRO: '<p>El cambio de potencia y/o tarifa lo valida, aplica y cobra (a través de nuestra factura) la <a target="_blank" href={{url}}>distribuidora de tu zona</a>. El <b>coste regulado</b> es:</p><ul><li>10,94&nbsp;€ (IVA incluído) por solicitud. Es posible cambiar a la vez la tarifa y la potencia en una única solicitud.</li><li>En caso de <b>aumentar la potencia</b>, 44,86&nbsp;€ por kW de incremento.</li></ul><p>La distribuidora sólo está obligada a aceptar <b>una sola solicitud de cambio cada 12 meses</b>.</p>',
                HELP_CONTACT_INFO: 'Los datos de contacto los utilizará la <a target="_blank" href="{{url}}">distribuidora de la zona</a> para avisarte en caso de que el técnico encargado necesite acceder al contador.',
                MODIFY_POTTAR_SELECT_TITLE: 'Selecciona tarifa y potencia',
                MODIFY_POTTAR_CONTACT_TITLE: 'Datos de contacto, para acceder al contador',
                HELP_CONTACT_INFO_URL: 'http://es.support.somenergia.coop/article/656-las-distribuidoras-de-electricidad',
                MODIFY_POTTAR_SUCCESS_TITTLE: 'Enhorabuena. En breve recibirás un correo electrónico con los datos de tu solicitud.',
                MODIFY_POTTAR_SUCCESS_MESSAGE: 'Enviaremos tu solicitud a la distribuidora de tu zona que se encargará de validarla y hacerla efectiva. En el caso que sea necesario, haznos llegar la documentación relacionada con este trámite, adjuntándola respondiendo al correo de confirmación que recibirás en pocos minutos.',
                ERROR_POST_MODIFY: 'Se ha detectado un error',
                MODIFY_POTTAR_ONGOING_PROCESS: 'El contrato indicado tiene otro proceso pendiente de resolución.',
                MODIFY_POTTAR_ONGOING_PROCESS_DETAILS: 'No se pueden empezar nuevos procesos si existen casos pendientes. Vuelve a intentarlo una vez que recibas por correo la resolución del proceso pendiente.',
                MODIFY_POTTAR_NOT_ALLOWED: 'No estás autorizado/a para hacer esta operación.',
                MODIFY_POTTAR_NOT_ALLOWED_DETAILS: '¿Te vienes a trabajar con nosotros? ;-)',
                MODIFY_POTTAR_INACTIVE_CONTRACT: 'El contrato a modificar no está dado de alta.',
                MODIFY_POTTAR_INACTIVE_CONTRACT_DETAILS: 'Sólo se pueden modificar contratos que estan dados de alta.',
                MODIFY_POTTAR_BAD_TOKEN: 'La sesión ha expirado.',
                MODIFY_POTTAR_BAD_TOKEN_DETAILS:'Te recomendamos volver a acceder desde la lista de contratos e intentarlo otra vez.',
                MODIFY_POTTAR_UNEXPECTED: 'Se ha producido un error inesperado.',
                MODIFY_POTTAR_UNEXPECTED_DETAILS: 'Ponte en contacto con modifica@somenergia.coop para que te podamos echar una mano. Para identificarte necesitaremos tu NIF y el número del contrato que quieres modificar.',
                API_SERVER_ERROR: 'Error conectando al servidor.',
                API_SERVER_ERROR_DETAILS: 'Tu navegador tiene problemas para conectarse a la web de Som Energia. Comprueba que la conexión a internet funcione correctamente. Si no fuera ese el problema, contacta con Som Energia para verificar si se pudo procesar el trámite correctamente.',
                API_SERVER_OFFLINE: 'Nuestros servidores no responden.',
                API_SERVER_OFFLINE_DETAILS: 'Es posible que se estén haciendo tareas de mantenimiento. Vuelve a probar más tarde. Perdona las molestias.',
                MODIFY_POTTAR_INVALID_FIELD: 'Los datos no son correctos.',
                MODIFY_POTTAR_REQUIRED_FIELD: 'Faltan datos.',
                POTENCIA: 'Potencia',
                MODIFY_POTTAR: 'Petición de cambio de Tarifa y/o Potencia',
                CONTACT_PHONE: 'Teléfono de contacto para acceder al contador',
                ENVIAR: 'Enviar',
                ENVIANT: 'Enviando',
                REVIEW_DATA_AND_CONFIRM: 'Revisa los datos. Para confirmarlos, pulsa el botón del final.',
                LA_TEVA_TARIFA_ES: 'Tu tarifa será',
            })
        ;
    });

