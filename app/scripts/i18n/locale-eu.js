'use strict';

angular.module('newSomEnergiaWebformsApp')
    .config(function($translateProvider) {
        $translateProvider
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
                ACCEPTO_POLITICA_PRIVACITAT: 'Som Energiaren <strong><a target="_blank" href="//www.somenergia.coop/eu/pribatutasun-politika-cookie-ak-eta-lege-oharra/">pribatutasun-politika</a></strong>onartzen dut',
                ACCEPTO_CONDICIONS_I_POLITICA_PRIVACITAT: 'Kontratuaren baldintza orokorrak <strong><a target="_blank" href="//www.somenergia.coop/eu/energia-elektriko-hornikuntzaren-kontratuko-baldintza-orokorrak/">onartzen ditut</a></strong> i la <strong><a target="_blank" href="//www.somenergia.coop/eu/pribatutasun-politika-cookie-ak-eta-lege-oharra/">pribatutasun-politika</a></strong>',
                METODE_PAGAMENT: 'Ordainketa-era',
                REBUT_BANCARI: 'Banku-ordainagiria',
                TARGETA_CREDIT: 'Kreditu-txartela',
                COST: 'kooperatibarako kostua',
                INFO_APORTACIO: 'Bazkide izateko ekarpena 100 €-koa da<br/>100€ behin ordaintzen dira, ez dago urteko kuotarik eta kooperatiban baja eman ezkero bueltan itzuliko dira.',
                FINALITZA_PROCES: 'Prozesuarekin jarraitzeko',
                FORMULARI_NO_DISPONIBLE: 'Formularioa ez dago eskuragarri, barkatu eragozpenak.',
                INVALID: 'Baliogabea',
                EMAIL_NO_IGUALS: 'Email desberdinak',
                DIGITS_LENGTH_5: '5 digituko zenbakia izan behar du',
                REGISTRE_EXISTENT: 'Badago erregistroa',
                REGISTRE_OK: 'Zorionak!',
                REGISTRE_OK_MSG: 'Erregistroa zuzen amaitu duzu',
                ACCEDINT_SERVEI_PAGAMENT: 'Ordainketa-zerbitzura sartzen',
                FORMULARI_CONTRACTACIO: 'Kontratatzeko formularioa',
                NUMERO_SOCI: 'Bazkide zenbakia',
                HELP_POPOVER_IDIOMA: 'Hemendik aurrera elkarrekin harremanetan jartzeko hizkuntza hau izango da',
                CARREGAR_DADES_SOCI_VINCULAT: 'Elkartutako bazkidearen datuak kargatu',
                SOCI_VINCULAT: 'Elkartutako bazkidea',
                NO_TROBEM_CAP_SOCI_VINCULAT: 'Ez da datu hauetara inolako elkartutako bazkiderik aurkitu!',
                NO_ETS_SOCI_FES_TE_AQUI: 'Oraindik ez zara bazkide? Egin zaitez bazkide <a href="//www.somenergia.coop/eu/izan-zaitez-bazkide/" target="_blank">hemen</a>!',
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
                HELP_POPOVER_OPTIONAL_INFO: 'Los datos de consumo anual podrían ser útiles para emitir nuestras primeras facturas.',
                CONSUM_ANUAL_ESTIMAT: 'Urteko kontsumo balioztatua (kWh)',
                REFERENCIA_CATASTRAL: 'Etxearen katrastoko erreferentzia',
                HELP_POPOVER_REFERENCIA_CATASTRAL: 'Informazio gehigarria hemen:<br/><a target="_blank" href="https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=CONSULTA">España</a><br/><a target="_blank" href="http://www.bizkaia.net/home2/Temas/DetalleTema.asp?Tem_Codigo=5181&Idioma=CA">Bizkaia</a><br/><a target="_blank" href="http://catastroalava.tracasa.es/navegar/?lang=es">Araba</a><br/><a target="_blank" href="http://www4.gipuzkoa.net/ogasuna/catastro/presenta.asp">Guipuzkoa</a><br/><a target="_blank" href="https://catastro.navarra.es/">Navarra</a>',
                ADJUNTAR_ULTIMA_FACTURA: 'Gehi ezazu azkenengo faktura elektrikoa (PDF edo JPG) – Gehienezko 10Mb',
                BAD_EXTENSION: 'Gehi ezazu PDF edo JPG soilik',
                OVERFLOW_FILE: 'Atxikitako artxiboak EZIN ditu 10 Mb baino handiagoa izan',
                SEGUENT_PAS: 'Hurrengo pausoa',
                PAS_ANTERIOR: 'Aurreko pausoa',
                DADES_TITULAR_NOU_CONTRACTE: 'Kontratuaren titularraren datuak',
                DADES_TITULAR_NOU_CONTRACTE_HELPER: 'Jar itzazue Som Energiarekiko kontratu berriaren titularraren datuak. Aurreko kontratuaren titular berdina izan liteke edo aprobetxa ezazue titularra aldatzeko.',
                VOLS_FER_CANVI_TITULAR: 'Titularraren aldaketa egin nahi duzu?',
                AVIS_CANVI_TITULAR: '<span class="glyphicon glyphicon-warning-sign"></span>&nbsp;Adi: Hainbat kasutan, instalazio-buletina iraungita badago (20 urte), enpresa banatzaileak berritzea eskatuko du. Informazio gehiago <a target="_blank" href="http://eu.support.somenergia.coop/article/555-boletin-electrico">hemen</a>',
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
                IBAN_EXEMPLE: 'esate IBAN',
                BANC: 'Bankua',
                OFICINA: 'Bulegoa',
                COMPTE: 'Kontuaren zenbakia',
                CONFIRMO_TITULAR_COMPTE_ACCEPTA_DOMICILIACIO: 'Banku-kontuaren titularrak onartzen duela elektrizitate-fakturen helbideratzea ziurtatzen dut',
                SOM_UNA_COOPERATIVA_SENSE_ANIM_DE_LUCRE: 'Irabazi-asmorik gabeko kooperatiba gara eredu energetikoa aldatzeko asmoz',
                VOLS_PARTICIPAR_AMB_LA_TEVA_ENERGIA: 'Parte hartu nahi duzu zure energiarekin helburu hau lortzeko?',
                DONATIU_VOLUNTARI: 'Borondatezko ekarpena',
                ELS_SOCIS_I_SOCIES_QUE_HO_DESITGIN_PODEN_REALITZAR_UN_DONATIU_VOLUNTARI: 'Nahi duten bazkideek 0,01 €/kWhko ekarpen boluntarioa egin dezakete lurraldean zehar zabaldurik dauden 50 talde lokal baino gehiagoren sutengu eta laguntza gisa. Batazbesteko kontsumo bateko familia baten kasuan ( 300 kWh/hilabeteko), hilean 3 euroko igoera suposatzen du. Nahi duzunean aktibatu edo desaktibatu ahal da laguntza hau momentuan bertan bulego birtualean.',
                CONFIRMAR_CONTRACTACIO: 'Kontratazioa baieztatu',
                SENDING: 'Datuak bidaltzen...',
                ENVIANT_DADES: 'Faktura bat gehitzekotan prozesua amaitzeak denbora dexente iraun lezake, arxtibategiaren pisuaren edota zure Internet-konexioaren arabera. Anima zaitez eta energia on, ia amaitu duzu! :)',
                REVISIO_CONFIRMACIO_DADES: 'Datuak errepasatu eta konfirmatu',
                EL_CONTRACTE_CANVIA_TITULAR: 'Kontratua titularrez aldatzen al da?',
                TARIFA: 'Tarifa',
                POTENCIA_CONTRACTADA: 'Potentzia kontratatua',
                NOM_O_RAO_SOCIAL: 'Enpresa izena edo izen soziala',
                SI_LES_DADES_SON_CORRECTES: 'Datuak zuzenak badira klikatu bai kontratazio prozesua amaitzeko',
                SI_TOT_CORRECTE: 'Bai, dena zuzena da',

                HELP_POPOVER_SOCIA: 'Zure bazkidearen zenbakia ez duzu gogoratzen? Asma ezazu web orriaren "Datu pertsonalak" atalean <a target="_blank" href="https://oficinavirtual.somenergia.coop/">Bulego Birtuala</a>.',
                HELP_POPOVER_DNI: 'Adibide NAN: 12345678P (amaierako letrarekin)',
                SOCIA_TROBADA: 'Bazkide aurkituta',
                VALIDANT_ID: 'Nortasun-agiria balioztatzen...',
                IDENTIFICANT_SOCIA: 'Bazkidea identifikatzen...',
                DNI_INVALID: 'Nortasun-agiriaren kode okerra.',
                SERVER_ERROR: 'Hutsegitea serbidorean sartzen:',
                INICIAR_INVERSIO: 'Hasi inbertsioa',
                FORMULARI_D_INVERSIO: 'Inbertsio <b>formulario</b>',
                BENVINGUDA: 'Ongi etorri, <b>{{name}}</b>!',
                QUANT_VOLS_INVERTIR: 'Zenbat inbertitu <b>nahi duzu</b>? <br/> <small>kapital sozialerako borondatezko ekarpenetan?</small>',
                RECORDA: 'Gogora ezazu: ',
                AMOUNT_HELPER_MIN: 'Gutxienengo ekarpena 100€',
                AMOUNT_HELPER_MAX: 'Gehienezko ekarpena 25.000€',
                AMOUNT_HELPER_STEP: 'Ekarpena 100€-ko multiplo',
                NUMERO_DE_COMPTE_FORMAT_IBAN: 'Kontu-korrontearen zenbakia IBAN formatuan. Adibide: ES11 2222 3333 4444 5555 6666',
                CONFIRMO_CONDICIONS_INVERSIO: 'Kontu-korrontearen titularra naizela ziurtatzen dut, helbideratzea baimentzen dut eta onartzen ditut <a target="_blank" href="https://somenergia.coop/es/condiciones-generales-inversion">inbertsioaren baldintza-orokorrak</a> baita <a target="_blank" href="https://www.somenergia.coop/es/politica-de-privacidad-cookies-y-aviso-legal/">pribatutasun-politika ere</a>',
                CONFIRMAR_INVERSIO: 'Egiaztatu inbertsioa',
                COMPROVANT: 'Egiaztatzen...',
                CORRECTE: 'Zuzena',
                INVEST_OK_REDIRECT_URL: 'https://www.somenergia.coop/eu/aportacion-realizada-correctamente/', // TODO: Translate url
                CONTRACT_OK_REDIRECT_URL: 'https://www.somenergia.coop/es/contratacion-realizada/',
                GENERATION_OK_REDIRECT_URL: 'http://www.generationkwh.org/eu/inbertsioa-egin/',

              // Added or changed since 1.2.6
                CODI_IBAN_DEL_COMPTE: 'Kontu-korronteko IBAN kodea',
                EXEMPLE_IBAN: 'Esate: ES11 2222 3333 4444 5555 6666',
                REQUERIT: 'Beharrezkoa.',
                DES_DE_QUIN_COMPTE: 'Zein <b>kontu-korrontetik?</b>', // Actualizar
                FORMULARI_D_INVERSIO_GKWH: 'Generation kwh-rako inbertsio formularioa',
                QUANTES_ACCIONS_ENERGETIQUES_VOLS: '¿Zenbat <b>akzio energetiko</b> nahi dituzu?',
                COST_PER_ACCIO_ENERGETICA: '{{ preuperaccio }}€ akzio energetiko bakoitzeko.',
                KWH_PER_ACCIO_ENERGETICA: '<a href="{{url}}" target="_blank">Gaur eguneko aurreikuspena:</a> {{ kwhperaccio }} kWh akzio energetiko bakoitzeko',
                CARREGANT_INFORMACIO_DELS_TEUS_CONTRACTES: 'Zure kontratuen informazioa kargatzen...',
                CONTRACTE: 'Kontratu zenbakia',
                PUNT_DE_SUBMINISTRAMENT: 'Hornitze puntua',
                US_ANUAL: 'Erabilera urtean zehar',
                TOTAL_US_ANUAL_ESTIMAT: 'Urteko erabilera balioztatua guztira',
                PERCENTATGE_ASSOLIT: 'Zure erabilera osoaren gainean autoekoizketaren bidez lortutako portzentaia',
                GENERATION_RECOMANACIO_PERCENT: 'Nahi duzuna ekoiztu dezakezu, baina gogoan izan kasuaren arabera %{{ percent }}-a ez gainditzeko <a href="{{ url }}" target="_blank">gure gomendioa</a>.',
                GENERATION_RECOMANACIO_PERCENT_URL: 'http://bit.ly/maxGkWhES', // Points to 'http://es.support.somenergia.coop/article/591-existe-una-cantidad-minima-y-maxima-a-aportar'
                GENERATION_ACCEPTO_DOMICILIACIO: 'Kontu korrontearen jabea banaizela konfirmatu eta helbideratzea baimentzen dut',
                GENERATION_ACCEPTO_CONDICIONS: '<a target="_blank" href="{{url}}">Inbertsioaren baldintza orokorrak</a> onartzen ditut',
                GENERATION_CONDICIONS_URL: 'http://www.generationkwh.org/wp-content/uploads/Condiciones-Generales-Contrato-Autoproduccion-Colectiva-Generation-kWh_ES.pdf',
                NO_HA_ESTAT_TROBAT: 'Ez da aurkitu',
                FENT_SERVIR_RESIDENCIA_MITJANA: 'Erreferentzia moduan, etxebizitza arrunt baten elektrizitate erabilera hartzen ari da',
                ADDICIONAL_FERSE_SOCIA: '<b>Adi:</b> Bazkide izateko, inbertitu nahi duzun kopuruaz gain, <b>100€</b>-ko ekarpena egin behar duzu kapital sozialera, zeina baja eman ezkero <b>itzuli egingo zaizu</b>.',
                ERROR_POST_INVERSIO: 'Akatsa gertatu da inbertsioa egiterakoan',
                ERROR_POST_NOVASOCIA: 'Akatsa gertatu da bazkidea erregistratzean',
                ERROR_REQUIRED_FIELD: 'Beharrezko parametroa falta da: {{field}}',
                ERROR_INVALID_FIELD: 'Parametroaren balio okerra: {{field}}, arrazoia: {{reason}}',
                CARREC_ADICIONAL_NOVA_SOCIA: 'Zenbatekoa guztira: {{total}}€ ({{ aportaciosoci }}€ + {{ costaccions }}€)',
                JA_SOC_SOCIA: 'Dagoeneko bazkidea naiz',
                EM_VULL_FER_SOCIA: 'Bazkide izan nahi dut',
                GENERATION_REQUERIMENT_SER_SOCIA: 'Inbertsio honetan parte hartu ahal izateko SomEnergia-koa izan behar da. ¿Zein da zure egoera?',
                APORTACIO_REQUERIMENT_SER_SOCIA: 'Inbertsio honetan parte hartu ahal izateko SomEnergia-koa izan behar da. ¿Zein da zure egoera?',
                APORTACIO_CONDICIONS_URL: 'https://somenergia.coop/es/condiciones-generales-inversion',
                DADES_ALTA: 'Kooperatiban altan emandako datuak',
                HELP_JURIDICA: 'Pertsona juridikoak entrepresa, elkarte eta bestelako erakundeak dira. Pertsona fisikoak hezur eta haragizkoak gara.',
                COM_CONTACTEM: 'Kontakturako datuak',
                DOMICILI: 'Helbidea',
                TELEFON_ALTERNATIU: 'Ordezko telefonoa',
                APORTACIO_CORRESPONENT: 'Dagokion ekarpena',
                AUTOPRODUCCIO_ANUAL: 'Autoekoizpena urteko',
                PREVISIO_GENERATION_URL: 'http://es.support.somenergia.coop/article/589-que-representa-una-accion-energetica',

                // Under development
            })
        ;
    });

