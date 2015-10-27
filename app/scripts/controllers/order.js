'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', function (cfg, debugCfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // DEBUG MODE
        var debugEnabled = false;

        // INIT
        $scope.developing = cfg.DEVELOPMENT; // TODO change xorigin domain on index.html && replace grunt sftp source environment

        // MUST APPLY TO EMBED WITH WORDPRESS (detects inside frame)
        if (window !== window.top) { // Inside a frame
            document.domain = cfg.BASE_DOMAIN;
        }

        // Just when developing, show untranslated strings instead of falling back to spanish
        if (!$scope.developing ) {
            $translate.fallbackLanguage('es');
        }

        $scope.altesDeshabilitades = false;
        $scope.showAll = true;
        // To false to debug one page completion state independently from the others
        $scope.waitPreviousPages = false;

        $scope.form = {};
        $scope.form.ownerIsMember='yes';
        $scope.form.phases = undefined;
        $scope.form.discriminacio = undefined;
        $scope.form.choosepayer = cfg.PAYER_TYPE_TITULAR;
        $scope.form.address = {};
        $scope.form.invoice = {};
        $scope.form.bulletin = {};
        $scope.initForm = {};
        $scope.ibanEditor = {};
        $scope.cupsEditor = {};
        $scope.cnaeEditor = {};
        $scope.cadastreEditor = {};
        $scope.owner = {};
        $scope.payer = {};
        $scope.maxfilesize = cfg.MAX_MB_FILE_SIZE;

        $scope.showAllSteps = function() {
            $scope.showAll = true;
        };
        $scope.rate20IsInvalid = false;
        $scope.rate21IsInvalid = false;
        $scope.rate3AIsInvalid = false;
        $scope.postalCodeIsInvalid = false;
        $scope.invalidAttachFileExtension = false;
        $scope.overflowAttachFile = false;
        $scope.accountIsInvalid = false;

        $scope.isHaveLightPageComplete = false;
        $scope.isOwnerPageComplete = false;
        $scope.isPayerPageComplete = false;

        $scope.orderFormSubmitted = false;
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.completeAccountNumber = '';
        $scope.availablePowers = function() {
            if ($scope.form.phases === 'mono') {
                return $scope.availablePowersMonophase;
            }
            return $scope.availablePowersTriphase;
        };
        $scope.rates = [
            cfg.RATE_20A,
            cfg.RATE_20DHA,
            cfg.RATE_20DHS,
            cfg.RATE_21A,
            cfg.RATE_21DHA,
            cfg.RATE_21DHS,
            cfg.RATE_30A,
        ];
        $scope.availablePowersMonophase = [
            0.345,
            0.69,
            0.805,
            1.15,
            1.725,
            2.3,
            3.45,
            4.6,
            5.75,
            6.9,
            8.05,
            9.2,
            10.35,
            11.5,
            14.49,
        ];
        $scope.availablePowersTriphase = [
            1.039,
            2.078,
            2.425,
            3.464,
            5.196,
            6.928,
            10.392,
            13.856,
/*
            17.321,
            20.785,
            24.249,
            27.713,
            31.177,
            34.641,
            43.648,
*/
        ];
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // GET LANGUAGES
        AjaxHandler.getLanguages($scope);

        // GET STATES
        AjaxHandler.getStates($scope); // TODO: Remove it when in components

        // POWER VALIDATION
        ValidateHandler.validatePower($scope, 'form.power');
        ValidateHandler.validatePower($scope, 'form.power2');
        ValidateHandler.validatePower($scope, 'form.power3');
        ValidateHandler.validateInteger($scope, 'form.estimation');

        $scope.esAlta = function() {
            if ($scope.altesDeshabilitades) { return false; }
            if ($scope.form.hasservice === undefined) { return undefined; }
            return ! $scope.form.hasservice;
        };

        $scope.$watch('form.phases', function(oldvalue, newvalue) {
            // Reseting newpower if we change phases
            if (oldvalue!==newvalue) {
                $scope.form.newpower = undefined;
            }
            $scope.formListener();
        });
        function recomputeFareFromAlta(/*oldvalue, newvalue*/) {
            var newFare = (
                $scope.form.newpower+0 < 10 ? '2.0' : (
                $scope.form.newpower+0 < 15 ? '2.1' : (
                $scope.form.newpower!==undefined ? '3.0' :
                undefined)));
            if (newFare !== undefined) {
                var discrimination = $scope.form.newpower<15 ? $scope.form.discriminacio : 'nodh';
                newFare += { nodh:'A', dh:'DHA', dhs:'DHS' }[discrimination];
            }
            $scope.form.rate = newFare;
            if (newFare!=='3.0A' && newFare !== undefined) {
                $scope.form.power=$scope.form.newpower;
            }
        }
        $scope.$watch('form.newpower', recomputeFareFromAlta);
        $scope.$watch('form.discriminacio', recomputeFareFromAlta);

        // CONTROL READY STEPS ON CHANGE FORM
        $scope.isPartnerPageComplete = function() {
            return (
                $scope.initForm !== undefined &&
                $scope.initForm.isReady !== undefined &&
                $scope.initForm.isReady()
            );
        };
        $scope.setOnwerAndPayerLanguage=function(soci) {
            // TODO: Take it from soci
            var language = $routeParams.locale + '_ES';
            $scope.payer.setLanguage(language);
            $scope.owner.setLanguage(language);
        };

        $scope.isSupplyPointPageComplete = function() {
            if ($scope.waitPreviousPages) {
                if (!$scope.isPartnerPageComplete()) { return false; }
            }
            if (!$scope.altesDeshabilitades) {
                if ($scope.esAlta() === undefined) { return false; }
            }
            if ($scope.form.address.value === undefined) { return false; }
            if ($scope.form.province === undefined) { return false; }
            if ($scope.form.city === undefined) { return false; }
            if (!$scope.cupsEditor.isValid()) { return false; }
            if (!$scope.cnaeEditor.isValid()) { return false; }
            if ($scope.overflowAttachFile) { return false; }
            return true;
        };

        $scope.isFarePageComplete = function() {
            if ($scope.waitPreviousPages) {
                if (!$scope.isSupplyPointPageComplete()) { return false; }
            }
            if ($scope.esAlta()!==false) {
                if ($scope.form.phases===undefined) { return false; }
                if ($scope.form.discriminacio===undefined) { return false; }
            }
            if ($scope.form.rate === undefined) { return false; }
            if ($scope.form.power === undefined) { return false;}
            switch ($scope.form.rate) {
                case cfg.RATE_20A:
                case cfg.RATE_20DHA:
                case cfg.RATE_20DHS:
                    if ($scope.rate20IsInvalid) { return false; }
                    break;
                case cfg.RATE_21A:
                case cfg.RATE_21DHA:
                case cfg.RATE_21DHS:
                    if ($scope.rate21IsInvalid) {return false;}
                    break;
                case cfg.RATE_30A:
                    if ($scope.form.power2 === undefined) {return false;}
                    if ($scope.form.power3 === undefined) {return false;}
                    if ($scope.rate3AIsInvalid) {return false;}
                    break;
            }
            return true;
        };
        $scope.formListener = function() {
            console.log('listener');
            $scope.isHaveLightPageComplete =
                (!$scope.waitPreviousPages || $scope.isPartnerPageComplete()) && (
                   $scope.esAlta() !== undefined ||
                   $scope.altesDeshabilitades
                );

            $scope.isOwnerPageComplete =
                (!$scope.waitPreviousPages || $scope.isSupplyPointPageComplete()) &&
                $scope.isFarePageComplete() &&
                ($scope.esAlta() || $scope.form.changeowner !== undefined) &&
                $scope.form.ownerAcceptsGeneralConditions === true &&
                (
                    $scope.form.ownerIsMember === 'yes' ||
                    (
                        $scope.owner.isReady !== undefined &&
                        $scope.owner.isReady()
                    )
                );
            $scope.isPayerPageComplete =
                (!$scope.waitPreviousPages || $scope.isOwnerPageComplete()) &&
                $scope.ibanEditor.isValid !== undefined &&
                $scope.ibanEditor.isValid() &&
                $scope.form.acceptaccountowner &&
                $scope.form.voluntary !== undefined &&
                (
                    $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ||
                    (
                        $scope.payer.isReady !== undefined &&
                        $scope.payer.isReady()
                    )
                ) &&
                (
                    $scope.form.choosepayer === cfg.PAYER_TYPE_TITULAR ||
                        $scope.form.payerAcceptsGeneralConditions === true
                )
                ;
        };

        $scope.goToSociPage = function() {
            $scope.setStepReady(0, 'dadesSociPage');
        };

        $scope.goToSupplyPointPage = function() {
            $scope.setStepReady(1, 'supplyPointPage');
        };

        $scope.goToFarePage = function() {
            $scope.setStepReady(7, 'farePage');
        };

        $scope.goToOwnerPage = function() {
            $scope.setStepReady(2, 'ownerPage');
        };

        $scope.goToPayerPage = function() {
            $scope.setStepReady(3, 'payerPage');
        };

        $scope.goToConfirmationPage = function() {
            $scope.setStepReady(4, 'confirmationPage');
        };
        $scope.wizardPage = {};

        // COMMON MOVE STEPS LOGIC
        $scope.setStepReady = function(enabledStep, pageName) {
            $scope.wizardPage.current = pageName;
            if (debugEnabled) {
                $log.log(pageName);
            }
        };

        $scope.goToSociPage();

        // KLUDGE: how to translate params of a translation
        $scope.HELP_INSTALL_TYPE_URL = $translate.instant('HELP_INSTALL_TYPE_URL');
        $scope.HELP_POTENCIA_URL = $translate.instant('HELP_POTENCIA_URL');
        $scope.HELP_DISCRIMINACIO_HORARIA_URL = $translate.instant('HELP_DISCRIMINACIO_HORARIA_URL');
        $scope.HELP_POWER_30_URL = $translate.instant('HELP_POWER_30_URL');
        // DOUBLE: how to translate params of a translation and passing it to the child scopes
        $scope.t={};
        $scope.t.HELP_POPOVER_CUPS_ALTA_URL = $translate.instant('HELP_POPOVER_CUPS_ALTA_URL');


        // ON SUBMIT FORM
        $scope.submitOrder = function() {
            $scope.messages = null;
            $scope.orderFormSubmitted = true;
            $scope.cupsIsDuplicated = false;
            $scope.invalidAttachFileExtension = false;
            $scope.overflowAttachFile = false;
            $scope.orderForm.cups.$setValidity('exist', true);
            $scope.orderForm.file.$setValidity('exist', true);
            uiHandler.showLoadingDialog();
            // Prepare request data
            var postData = {};
            var formData = new FormData();
            formData.append('id_soci', $scope.formsoci.socinumber);
            formData.append('dni', $scope.formsoci.dni);
            formData.append('canvi_titular', $scope.form.changeowner === 'yes' ? 1 : 0);
            if (!$scope.altesDeshabilitades) {
                formData.append('alta_subministre', $scope.esAlta() ? 1 : 0);
                formData.append('proces', $scope.esAlta() ? 'A3' : $scope.form.changeowner === 'yes' ? 'C2': 'C1');
            }
            var ownerIsMember = $scope.form.ownerIsMember==='yes';
            formData.append('soci_titular', ownerIsMember ? 1 : 0);
            // TODO: estem ignorant l'idioma dels no socis (owner i payer)
            // TODO: agafar tipus_persona, representant_nom, i representant_dni del soci quan toca
            formData.append('tipus_persona', $scope.owner.usertype === 'person' ? 0 : 1);
            formData.append('representant_nom', $scope.owner.usertype === 'company' ? $scope.owner.representantname : '');
            formData.append('representant_dni', $scope.owner.usertype === 'company' ? $scope.owner.representantdni : '');
            formData.append('titular_nom', ownerIsMember ? $scope.initForm.soci.nom : $scope.owner.name);
            formData.append('titular_cognom', ownerIsMember ? $scope.initForm.soci.cognom : $scope.owner.surname || '');
            formData.append('titular_dni', ownerIsMember ? $scope.initForm.soci.dni : $scope.owner.dni);
            formData.append('titular_email', ownerIsMember ? $scope.initForm.soci.email : $scope.owner.email1);
            formData.append('titular_tel', ownerIsMember ? $scope.initForm.soci.tel : $scope.owner.phone1);
            formData.append('titular_tel2', ownerIsMember ? $scope.initForm.soci.tel2 : $scope.owner.phone2 || '');
            formData.append('titular_adreca', ownerIsMember ? $scope.initForm.soci.adreca : $scope.owner.address);
            formData.append('titular_municipi', ownerIsMember ? $scope.initForm.soci.municipi : $scope.owner.city.id);
            formData.append('titular_cp', ownerIsMember ? $scope.initForm.soci.cp : $scope.owner.postalcode);
            formData.append('titular_provincia', ownerIsMember ? $scope.initForm.soci.provincia : $scope.owner.province.id);
            formData.append('tarifa', $scope.form.rate);
            formData.append('cups', $scope.cupsEditor.value);
            formData.append('consum', $scope.form.estimation || ''); // TODO: Remove this when it is clear is not used anymore
            formData.append('potencia', Math.round($scope.form.power * cfg.THOUSANDS_CONVERSION_FACTOR));
            formData.append('potencia_p2', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power2 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('potencia_p3', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power3 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('cnae', $scope.cnaeEditor.value || '');
            formData.append('cups_adreca', $scope.form.address.value);
            formData.append('cups_provincia', $scope.form.province.id);
            formData.append('cups_municipi', $scope.form.city.id);
            formData.append('referencia', $scope.cadastreEditor.value || '');
            formData.append('fitxer', $scope.form.invoice.file()); // Disable it in altas
//            formData.append('butlleti', $scope.form.bulletin.file()); // TODO: Activate it
            formData.append('payment_iban', $scope.getCompleteIban());
            formData.append('escull_pagador', $scope.form.choosepayer);
            formData.append('compte_tipus_persona', $scope.payer.usertype === 'person' ? 0 : 1);
            var noPayer = $scope.form.choosepayer !== 'altre';
            formData.append('compte_nom', noPayer ? '' : $scope.payer.name);
            formData.append('compte_cognom', noPayer || $scope.payer.usertype !== 'person' ? '' : $scope.payer.surname);
            formData.append('compte_dni', noPayer ? '' : $scope.payer.dni);
            formData.append('compte_adreca', noPayer ? '' : $scope.payer.address);
            formData.append('compte_provincia', noPayer ? '' : $scope.payer.province.id);
            formData.append('compte_municipi', noPayer ? '' : $scope.payer.city.id);
            formData.append('compte_email', noPayer ? '' : $scope.payer.email1);
            formData.append('compte_tel', noPayer ? '' : $scope.payer.phone1);
            formData.append('compte_tel2', noPayer ? '' : $scope.payer.phone2);
            formData.append('compte_cp', noPayer ? '' : $scope.payer.postalcode);
            formData.append('compte_representant_nom', noPayer || $scope.payer.usertype !== 'company' ? '' : $scope.payer.representantname);
            formData.append('compte_representant_dni', noPayer || $scope.payer.usertype !== 'company' ? '' : $scope.payer.representantdni);
            formData.append('condicions', 1);
            formData.append('condicions_privacitat', 1);
            formData.append('condicions_titular', 1);
            formData.append('donatiu', $scope.form.voluntary === 'yes' ? 1 : 0);
            // Send request data POST
            $http({
                method: 'POST',
                url: cfg.API_BASE_URL + 'form/contractacio',
                headers: {'Content-Type': undefined},
                data: formData,
                transformRequest: angular.identity
            }).then(
                function(response) {
                    uiHandler.hideLoadingDialog();
                    $log.log('response received', response);
                    if (response.data.status === cfg.STATUS_ONLINE) {
                        if (response.data.state === cfg.STATE_TRUE) {
                            // well done
                            uiHandler.showWellDoneDialog();
                            $window.top.location.href = $translate.instant('CONTRACT_OK_REDIRECT_URL');
                        } else {
                            // error
                            $scope.messages = $scope.getHumanizedAPIResponse(response.data.data);
                            $scope.submitReady = false;
                            $scope.rawReason = response;
                            jQuery('#webformsGlobalMessagesModal').modal('show');
                        }
                    } else if (response.data.status === cfg.STATUS_OFFLINE) {
                        uiHandler.showErrorDialog('API server status offline (ref.022-022)');
                    } else {
                        uiHandler.showErrorDialog('API server unknown status (ref.021-021)');
                    }
                },
                function(reason) {
                    $log.error('Send POST failed', reason);
                    uiHandler.hideLoadingDialog();
                    if (reason.status === 413) {
                        $scope.messages = 'ERROR 413';
                    } else {
                        $scope.messages = 'ERROR';
                    }
                    $scope.overflowAttachFile = true;
                    $scope.showAllSteps();
                    $scope.rawReason = reason;
                    jQuery('#webformsGlobalMessagesModal').modal('show');
                }
            );

            return true;
        };

        // GET HUMANIZED API RESPONSE
        $scope.getHumanizedAPIResponse = function(arrayResponse) {
            var result = '';
            if (arrayResponse.required_fields !== undefined) {
                for (var i = 0; i < arrayResponse.required_fields.length; i++) {
                    result = result + 'ERROR REQUIRED FIELD:' + arrayResponse.required_fields[i] + ' ';
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    if (arrayResponse.invalid_fields[j].field === 'cups' && arrayResponse.invalid_fields[j].error === 'exist') {
                        $scope.cupsIsDuplicated = true;
                        $scope.orderForm.cups.$setValidity('exist', false);
                    } else if (arrayResponse.invalid_fields[j].field === 'fitxer' && arrayResponse.invalid_fields[j].error === 'bad_extension') {
                        $scope.invalidAttachFileExtension = true;
                        $scope.orderForm.file.$setValidity('exist', false);
                    } else {
                        result = result + 'ERROR INVALID FIELD: ' + arrayResponse.invalid_fields[j].field + '·' + arrayResponse.invalid_fields[j].error + ' ';
                    }
                }
            }
            $scope.showAllSteps();

            return result;
        };

        // GET COMPLETE ACCOUNT NUMBER
        $scope.getCompleteIban = function() {
            return $scope.ibanEditor.value;
        };

        // GET COMPLETE ACCOUNT NUMBER WITH FORMAT
        $scope.getCompleteIbanWithFormat = function() {
            if (!$scope.ibanEditor) {
                return 'INVALID';
            }
            if (!$scope.ibanEditor.isValid()) {
                return 'INVALID';
            }
            var joined = $scope.ibanEditor.value.toUpperCase();
            joined = joined.split(' ').join('');
            joined = joined.split('-').join('');
            joined = joined.split('.').join('');
            return [
                joined.slice(0,4),
                joined.slice(4,8),
                joined.slice(8,12),
                joined.slice(12,16),
                joined.slice(16,20),
                joined.slice(20,24),
            ].join(' ');
        };

        // DEBUG (only apply on development environment)
        if (debugEnabled) {
            $scope.formsoci.socinumber = debugCfg.SOCI;
            $scope.formsoci.dni = debugCfg.DNI;
//            $scope.form.province = {id: 0, name: 'province'};
//            $scope.form.city = {id: 0, name: 'city'};
            $scope.form.address.value = debugCfg.ADDRESS;
            $scope.cupsEditor.value = debugCfg.CUPS;
            $scope.cnaeEditor.value = debugCfg.CNAE;
            $scope.form.power = debugCfg.POWER;
            $scope.form.rate = debugCfg.RATE;
            $scope.executeGetSociValues();
            $scope.owner.representantdni = debugCfg.CIF;
            $scope.owner.representantname = debugCfg.COMPANY;
            $scope.owner.dni = debugCfg.DNI;
            $scope.owner.name = debugCfg.NAME;
            $scope.owner.surname = debugCfg.SURNAME;
            $scope.owner.address = debugCfg.ADDRESS;
            $scope.owner.phone1 = debugCfg.PHONE;
            $scope.owner.email1 = debugCfg.EMAIL;
            $scope.owner.email2 = debugCfg.EMAIL;
            $scope.form.ownerAcceptsGeneralConditions = true;
            $scope.ibanEditor.value = debugCfg.IBAN1;
            $scope.ibanEditor.value += debugCfg.IBAN2;
            $scope.ibanEditor.value += debugCfg.IBAN3;
            $scope.ibanEditor.value += debugCfg.IBAN4;
            $scope.ibanEditor.value += debugCfg.IBAN5;
            $scope.ibanEditor.value += debugCfg.IBAN6;
            cfg.API_BASE_URL = 'https://sompre.gisce.net:5001/';
        }
    });


