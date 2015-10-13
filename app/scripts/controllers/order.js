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

        $scope.initForm = {};
        $scope.ibanEditor = {};
        $scope.cupsEditor = {};
        $scope.cnaeEditor = {};
        $scope.cadastreEditor = {};
        $scope.payer = {};

        $scope.showAllSteps = function() {
            $scope.showAll = true;
        };
        $scope.rate20IsInvalid = false;
        $scope.rate21IsInvalid = false;
        $scope.rate3AIsInvalid = false;
        $scope.postalCodeIsInvalid = false;
        $scope.accountPostalCodeIsInvalid = false;
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
        $scope.language = {};
        $scope.form = {};
        $scope.form.phases = 'mono';
        $scope.form.discriminacio = 'nodh';
        $scope.form.usertype = 'person';
        $scope.form.choosepayer = cfg.PAYER_TYPE_TITULAR;
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

        // DNI VALIDATION
//        var checkDniTimer = false;
//        ValidateHandler.validateDni($scope, 'formsoci.dni', checkDniTimer);
        var checkDni2Timer = false;
        ValidateHandler.validateDni($scope, 'form.dni', checkDni2Timer);
        var checkDni3Timer = false;
        ValidateHandler.validateDni($scope, 'form.representantdni', checkDni3Timer);
        var checkDni4Timer = false;
        ValidateHandler.validateDni($scope, 'form.accountdni', checkDni4Timer);
        var checkDni5Timer = false;
        ValidateHandler.validateDni($scope, 'form.accountrepresentantdni', checkDni5Timer);

        // EMAIL VALIDATION
        var checkEmail1Timer = false;
        ValidateHandler.validateEmail1($scope, 'form.email1', checkEmail1Timer);
        var checkEmail2Timer = false;
        ValidateHandler.validateEmail2($scope, 'form.email2', checkEmail2Timer);
        var checkAccountEmail1Timer = false;
        ValidateHandler.validateEmail1($scope, 'form.accountemail1', checkAccountEmail1Timer);
        var checkAccountEmail2Timer = false;
        ValidateHandler.validateEmail2($scope, 'form.accountemail2', checkAccountEmail2Timer);

        // POSTAL CODE VALIDATION
        ValidateHandler.validatePostalCode($scope, 'form.postalcode');
        ValidateHandler.validatePostalCode($scope, 'form.accountpostalcode');

        // TELEPHONE VALIDATION
        ValidateHandler.validateTelephoneNumber($scope, 'form.phone1');
        ValidateHandler.validateTelephoneNumber($scope, 'form.phone2');
        ValidateHandler.validateTelephoneNumber($scope, 'form.accountphone1');
        ValidateHandler.validateTelephoneNumber($scope, 'form.accountphone2');

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity2 = function() {
            $scope.form.city2=undefined;
            $scope.cities2=[];
            if ($scope.form.province2===undefined) { return; }
            AjaxHandler.getCities($scope, 2, $scope.form.province2.id);
        };
        $scope.updateSelectedCity3 = function() {
            $scope.form.city3=undefined;
            $scope.cities3=[];
            if ($scope.form.province3===undefined) { return; }
            AjaxHandler.getCities($scope, 3, $scope.form.province3.id);
        };

        // ON CHANGE SELECTED FILE TO UPLOAD VALIDATION
        $scope.validateSelectedFileSize = function() {
            var file = jQuery('#fileuploaderinput')[0].files[0];
            $scope.$apply(function() {
                $scope.overflowAttachFile = (file.size / 1024 / 1024) > cfg.MAX_MB_FILE_SIZE;
                $scope.formListener();
            });
        };

        // ON CHANGE SELECTED POWER RATE
        $scope.updatePowerRatePopoverListener = function() {
            $timeout(function() { jQuery('#spc-rate-conditional').popover({trigger : 'hover'}); }, 100);
            $scope.formListener();
        };

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

        $scope.isSupplyPointPageComplete = function() {
            if ($scope.waitPreviousPages) {
                if (!$scope.isHaveLightPageComplete) { return false; }
            }
            if ($scope.form.address === undefined) { return false; }
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
            if ($scope.form.rate === undefined) { return false; }
            switch ($scope.form.rate) {
                case cfg.RATE_20A:
                case cfg.RATE_20DHA:
                case cfg.RATE_20DHS:
                    if ($scope.form.power === undefined) { return false;}
                    if ($scope.rate20IsInvalid) { return false; }
                    break;
                case cfg.RATE_21A:
                case cfg.RATE_21DHA:
                case cfg.RATE_21DHS:
                    if ($scope.form.power === undefined) {return false;}
                    if ($scope.rate21IsInvalid) {return false;}
                    break;
                case cfg.RATE_30A:
                    if ($scope.form.power === undefined) {return false;}
                    if ($scope.form.power2 === undefined) {return false;}
                    if ($scope.form.power3 === undefined) {return false;}
                    if ($scope.rate3AIsInvalid) {return false;}
                    break;
            }
            return true;
        };
        $scope.formListener = function() {
            $scope.isHaveLightPageComplete =
                (!$scope.waitPreviousPages || $scope.isPartnerPageComplete()) && (
                   $scope.esAlta() !== undefined ||
                   $scope.altesDeshabilitades
                );

            console.log('isHaveLightPageComplete', $scope.isHaveLightPageComplete);
            $scope.isOwnerPageComplete =
                (!$scope.waitPreviousPages || $scope.isSupplyPointPageComplete()) &&
                $scope.isFarePageComplete() &&
                ($scope.esAlta() || $scope.form.changeowner !== undefined) &&
                $scope.form.accept === true &&
                (
                    ($scope.form.ownerIsMember === 'yes') ||
                    ($scope.form.ownerIsMember === 'no' &&
                        $scope.form.language !== undefined &&
                        $scope.form.name !== undefined &&
                        ($scope.form.representantname !== undefined && $scope.form.usertype === 'company' || $scope.form.usertype === 'person') &&
                        $scope.form.changeowner !== undefined &&
                        ($scope.form.surname !== undefined && $scope.form.usertype === 'person' || $scope.form.usertype === 'company') &&
                        $scope.form.dni !== undefined &&
                        $scope.form.email1 !== undefined &&
                        $scope.form.email2 !== undefined &&
                        $scope.form.email1 === $scope.form.email2 &&
                        $scope.form.phone1 !== undefined &&
                        $scope.form.address2 !== undefined &&
                        $scope.form.postalcode !== undefined &&
                        $scope.form.province2 !== undefined &&
                        $scope.form.city2 !== undefined &&
                        $scope.postalCodeIsInvalid === false &&
                        $scope.dni2IsInvalid === false &&
                        ($scope.dni3IsInvalid === false && $scope.form.usertype === 'company' || $scope.form.usertype === 'person') &&
                        $scope.emailIsInvalid === false &&
                        $scope.emailNoIguals === false)
                );
            console.log('isOwnerPageComplete', $scope.isOwnerPageComplete);
            $scope.isPayerPageComplete =
                (!$scope.waitPreviousPages || $scope.isOwnerPageComplete()) &&
                $scope.ibanEditor.isValid !== undefined &&
                $scope.ibanEditor.isValid() &&
                $scope.form.acceptaccountowner &&
                $scope.form.voluntary !== undefined && ($scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ||
                ($scope.form.choosepayer === cfg.PAYER_TYPE_OTHER &&
                        $scope.payer.usertype !== undefined &&
                        $scope.form.accountname !== undefined &&
                        ($scope.payer.usertype === 'company' || $scope.payer.usertype === 'person' && $scope.payer.surname !== undefined) &&
                        $scope.form.accountdni !== undefined &&
                        $scope.form.accountemail1 !== undefined &&
                        $scope.form.accountemail2 !== undefined &&
                        $scope.form.accountemail1 === $scope.form.accountemail2 &&
                        $scope.form.accountphone1 !== undefined &&
                        $scope.form.accountaddress !== undefined &&
                        $scope.form.accountpostalcode !== undefined &&
                        $scope.form.province3 !== undefined &&
                        $scope.form.city3 !== undefined &&
                        $scope.form.accept2 !== undefined &&
                        $scope.form.accept2 !== false &&
                        $scope.dni4IsInvalid === false &&
                        $scope.accountPostalCodeIsInvalid === false &&
                        $scope.accountEmailIsInvalid === false &&
                        $scope.accountEmailNoIguals === false))
                ;
            console.log('isPayerPageComplete', $scope.isPayerPageComplete);
        };
        $scope.formAccountIbanListener = function () {
            if ($scope.form.accountbankiban1 !== undefined && $scope.form.accountbankiban2 !== undefined && $scope.form.accountbankiban3 !== undefined && $scope.form.accountbankiban4 !== undefined && $scope.form.accountbankiban5 !== undefined && $scope.form.accountbankiban6 !== undefined) {
                $scope.completeAccountNumber = $scope.getCompleteIban();
                var accountPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/iban/' + $scope.completeAccountNumber, '017');
                accountPromise.then(
                    function (response) {
                        $scope.accountIsInvalid = response === cfg.STATE_FALSE;
                        $scope.orderForm.accountbankiban1.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountbankiban2.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountbankiban3.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountbankiban4.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountbankiban5.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountbankiban6.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.formListener($scope.form);
                    },
                    function(reason) { $log.error('Check IBAN failed', reason); }
                );
            }
        };

        $scope.goToSociPage = function() {
            $scope.setStepReady(0, 'dadesSociPage');
        };

        $scope.goToHaveLightPage = function() {
            $scope.setStepReady(8, 'hasLightPage');
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
            formData.append('soci_titular', $scope.form.ownerIsMember === 'yes' ? 1 : 0);
            formData.append('tipus_persona', $scope.form.usertype === 'person' ? 0 : 1);
            formData.append('representant_nom', $scope.form.usertype === 'company' ? $scope.form.representantname : '');
            formData.append('representant_dni', $scope.form.usertype === 'company' ? $scope.form.representantdni : '');
            formData.append('titular_nom', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.nom : $scope.form.name);
            formData.append('titular_cognom', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.cognom : $scope.form.surname || '');
            formData.append('titular_dni', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.dni : $scope.form.dni);
            formData.append('titular_email', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.email : $scope.form.email1);
            formData.append('titular_tel', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.tel : $scope.form.phone1);
            formData.append('titular_tel2', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.tel2 : $scope.form.phone2 || '');
            formData.append('titular_adreca', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.adreca : $scope.form.address2);
            formData.append('titular_municipi', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.municipi : $scope.form.city2.id);
            formData.append('titular_cp', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.cp : $scope.form.postalcode);
            formData.append('titular_provincia', $scope.form.ownerIsMember === 'yes' ? $scope.initForm.soci.provincia : $scope.form.province2.id);
            formData.append('tarifa', $scope.form.rate);
            formData.append('cups', $scope.cupsEditor.value);
            formData.append('consum', $scope.form.estimation || '');
            formData.append('potencia', Math.round($scope.form.power * cfg.THOUSANDS_CONVERSION_FACTOR));
            formData.append('potencia_p2', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power2 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('potencia_p3', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power3 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('cnae', $scope.cnaeEditor.value || '');
            formData.append('cups_adreca', $scope.form.address);
            formData.append('cups_provincia', $scope.form.province.id);
            formData.append('cups_municipi', $scope.form.city.id);
            formData.append('referencia', $scope.cadastreEditor.value || '');
            formData.append('fitxer', jQuery('#fileuploaderinput')[0].files[0]);
            formData.append('payment_iban', $scope.getCompleteIban());
            formData.append('escull_pagador', $scope.form.choosepayer);
            formData.append('compte_tipus_persona', $scope.payer.usertype === 'person' ? 0 : 1);
            formData.append('compte_nom', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountname);
            formData.append('compte_cognom', $scope.form.choosepayer === cfg.PAYER_TYPE_OTHER && $scope.payer.usertype === 'person' ? $scope.payer.surname : '');
            formData.append('compte_dni', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountdni);
            formData.append('compte_adreca', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountaddress);
            formData.append('compte_provincia', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.province3.id);
            formData.append('compte_municipi', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.city3.id);
            formData.append('compte_email', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountemail1);
            formData.append('compte_tel', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountphone1);
            formData.append('compte_tel2', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountphone2);
            formData.append('compte_cp', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountpostalcode);
            formData.append('compte_representant_nom', $scope.form.choosepayer === cfg.PAYER_TYPE_OTHER && $scope.payer.usertype === 'company' ? $scope.form.accountrepresentantname : '');
            formData.append('compte_representant_dni', $scope.form.choosepayer === cfg.PAYER_TYPE_OTHER && $scope.payer.usertype === 'company' ? $scope.form.accountrepresentantdni : '');
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
            $scope.form.address = debugCfg.ADDRESS;
            $scope.cupsEditor.value = debugCfg.CUPS;
            $scope.cnaeEditor.value = debugCfg.CNAE;
            $scope.form.power = debugCfg.POWER;
            $scope.form.rate = debugCfg.RATE;
            $scope.executeGetSociValues();
            $scope.form.representantdni = debugCfg.CIF;
            $scope.form.representantname = debugCfg.COMPANY;
            $scope.form.dni = debugCfg.DNI;
            $scope.form.name = debugCfg.NAME;
            $scope.form.surname = debugCfg.SURNAME;
            $scope.form.address2 = debugCfg.ADDRESS;
            $scope.form.phone1 = debugCfg.PHONE;
            $scope.form.email1 = debugCfg.EMAIL;
            $scope.form.email2 = debugCfg.EMAIL;
            $scope.form.accept = true;
            $scope.ibanEditor.value = debugCfg.IBAN1;
            $scope.ibanEditor.value += debugCfg.IBAN2;
            $scope.ibanEditor.value += debugCfg.IBAN3;
            $scope.ibanEditor.value += debugCfg.IBAN4;
            $scope.ibanEditor.value += debugCfg.IBAN5;
            $scope.ibanEditor.value += debugCfg.IBAN6;
            cfg.API_BASE_URL = 'https://sompre.gisce.net:5001/';
        }
    });


