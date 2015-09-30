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
        $scope.initForm = {};
        $scope.ibanEditor = {};
        $scope.cupsEditor = {};
        $scope.cnaeEditor = {};

        $scope.showAllSteps = function() {
            $scope.showAll = true;
            $scope.step1Ready = true;
            $scope.step2Ready = true;
            $scope.step3Ready = true;
            $scope.step8Ready = true;
            $scope.currentStep = undefined;
        };
        $scope.setStep = function(step) {
            $scope.step0Ready = step === 0;
            $scope.step1Ready = step === 1;
            $scope.step2Ready = step === 2;
            $scope.step3Ready = step === 3;
            $scope.step4Ready = step === 4;
            $scope.step8Ready = step === 8;
            $scope.currentStep = step;
        };
        $scope.isStep = function(step) {
            if (step===0) { return $scope.step0Ready === true; }
            if (step===1) { return $scope.step1Ready === true; }
            if (step===2) { return $scope.step2Ready === true; }
            if (step===3) { return $scope.step3Ready === true; }
            if (step===4) { return $scope.step4Ready === true; }
            if (step===8) { return $scope.step8Ready === true; }
            return step===0;
        };
        $scope.rate20IsInvalid = false;
        $scope.rate21IsInvalid = false;
        $scope.rate3AIsInvalid = false;
        $scope.postalCodeIsInvalid = false;
        $scope.accountPostalCodeIsInvalid = false;
        $scope.invalidAttachFileExtension = false;
        $scope.overflowAttachFile = false;
        $scope.accountIsInvalid = false;
        $scope.isStep2ButtonReady = false;
        $scope.isStep3ButtonReady = false;
        $scope.isFinalStepButtonReady = false;
        $scope.orderFormSubmitted = false;
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.form = {};
        $scope.form.usertype = 'person';
        $scope.form.choosepayer = cfg.PAYER_TYPE_TITULAR;
        $scope.completeAccountNumber = '';
        $scope.rates = [cfg.RATE_20A, cfg.RATE_20DHA, cfg.RATE_20DHS, cfg.RATE_21A, cfg.RATE_21DHA, cfg.RATE_21DHS, cfg.RATE_30A];
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // GET LANGUAGES
        AjaxHandler.getLanguages($scope);

        // GET STATES
        AjaxHandler.getStates($scope);

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

        // IBAN VALIDATION
        ValidateHandler.validateIban($scope, 'form.accountbankiban1');
        ValidateHandler.validateIban($scope, 'form.accountbankiban2');
        ValidateHandler.validateIban($scope, 'form.accountbankiban3');
        ValidateHandler.validateIban($scope, 'form.accountbankiban4');
        ValidateHandler.validateIban($scope, 'form.accountbankiban5');
        ValidateHandler.validateIban($scope, 'form.accountbankiban6');

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity = function() {
            $scope.form.city=undefined;
            $scope.cities=[];
            if ($scope.form.province===undefined) { return; }
            AjaxHandler.getCities($scope, 1, $scope.form.province.id);
        };
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
            return  $scope.form.hasservice === true;
        };

        // CONTROL READY STEPS ON CHANGE FORM
        $scope.formListener = function() {
            $scope.isStepHaveLightReady =
                $scope.initForm !== undefined &&
                $scope.initForm.isReady !== undefined &&
                $scope.initForm.isReady() && (
                   $scope.esAlta() !== undefined ||
                   $scope.altesDeshabilitades
                );
            $scope.isStep2ButtonReady =
                $scope.isStepHaveLightReady &&
                $scope.form.address !== undefined &&
                $scope.form.province !== undefined &&
                $scope.form.city !== undefined &&
                $scope.cupsEditor.isValid() &&
                $scope.cnaeEditor.isValid() &&
                $scope.form.rate !== undefined &&
                (
                    (($scope.form.rate === cfg.RATE_20A || $scope.form.rate === cfg.RATE_20DHA || $scope.form.rate === cfg.RATE_20DHS) && $scope.form.power !== undefined && !$scope.rate20IsInvalid) ||
                    (($scope.form.rate === cfg.RATE_21A || $scope.form.rate === cfg.RATE_21DHA || $scope.form.rate === cfg.RATE_21DHS) && $scope.form.power !== undefined && !$scope.rate21IsInvalid) ||
                    ($scope.form.rate === cfg.RATE_30A && $scope.form.power !== undefined && $scope.form.power2 !== undefined && $scope.form.power3 !== undefined && !$scope.rate3AIsInvalid)
                ) &&
                !$scope.overflowAttachFile;

            $scope.isStep3ButtonReady = $scope.isStep2ButtonReady &&
                $scope.form.changeowner !== undefined &&
                $scope.form.accept === true &&
                (
                    ($scope.form.isownerlink === 'yes') ||
                    ($scope.form.isownerlink === 'no' &&
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
            $scope.isFinalStepButtonReady = $scope.isStep3ButtonReady &&
                $scope.ibanEditor.isValid !== undefined &&
                $scope.ibanEditor.isValid() &&
                $scope.form.acceptaccountowner &&
                $scope.form.voluntary !== undefined && ($scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ||
                ($scope.form.choosepayer === cfg.PAYER_TYPE_OTHER &&
                        $scope.form.payertype !== undefined &&
                        $scope.form.accountname !== undefined &&
                        ($scope.form.payertype === 'company' || $scope.form.payertype === 'person' && $scope.form.accountsurname !== undefined) &&
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
            $scope.setStep(enabledStep);
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
            var formData = new FormData();
            formData.append('id_soci', $scope.formsoci.socinumber);
            formData.append('dni', $scope.formsoci.dni);
            formData.append('tipus_persona', $scope.form.usertype === 'person' ? 0 : 1);
            formData.append('soci_titular', $scope.form.isownerlink === 'yes' ? 1 : 0);
            formData.append('canvi_titular', $scope.form.changeowner === 'yes' ? 1 : 0);
            if (!$scope.altesDeshabilitades) {
                formData.append('alta_subministre', $scope.esAlta() ? 1 : 0);
                formData.append('proces', $scope.esAlta() ? 'A3' : $scope.form.isownerlink === 'yes' ? 'C2': 'C1');
            }
            formData.append('representant_nom', $scope.form.usertype === 'company' ? $scope.form.representantname : '');
            formData.append('representant_dni', $scope.form.usertype === 'company' ? $scope.form.representantdni : '');
            formData.append('titular_nom', $scope.form.isownerlink === 'yes' ? $scope.soci.nom : $scope.form.name);
            formData.append('titular_cognom', $scope.form.isownerlink === 'yes' ? $scope.soci.cognom : $scope.form.surname || '');
            formData.append('titular_dni', $scope.form.isownerlink === 'yes' ? $scope.soci.dni : $scope.form.dni);
            formData.append('titular_email', $scope.form.isownerlink === 'yes' ? $scope.soci.email : $scope.form.email1);
            formData.append('titular_tel', $scope.form.isownerlink === 'yes' ? $scope.soci.tel : $scope.form.phone1);
            formData.append('titular_tel2', $scope.form.isownerlink === 'yes' ? $scope.soci.tel2 : $scope.form.phone2 || '');
            formData.append('titular_adreca', $scope.form.isownerlink === 'yes' ? $scope.soci.adreca : $scope.form.address2);
            formData.append('titular_municipi', $scope.form.isownerlink === 'yes' ? $scope.soci.municipi : $scope.form.city2.id);
            formData.append('titular_cp', $scope.form.isownerlink === 'yes' ? $scope.soci.cp : $scope.form.postalcode);
            formData.append('titular_provincia', $scope.form.isownerlink === 'yes' ? $scope.soci.provincia : $scope.form.province2.id);
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
            formData.append('referencia', $scope.form.catastre || '');
            formData.append('fitxer', jQuery('#fileuploaderinput')[0].files[0]);
            formData.append('payment_iban', $scope.getCompleteIban());
            formData.append('escull_pagador', $scope.form.choosepayer);
            formData.append('compte_tipus_persona', $scope.form.payertype === 'person' ? 0 : 1);
            formData.append('compte_nom', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountname);
            formData.append('compte_cognom', $scope.form.choosepayer === cfg.PAYER_TYPE_OTHER && $scope.form.payertype === 'person' ? $scope.form.accountsurname : '');
            formData.append('compte_dni', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountdni);
            formData.append('compte_adreca', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountaddress);
            formData.append('compte_provincia', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.province3.id);
            formData.append('compte_municipi', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.city3.id);
            formData.append('compte_email', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountemail1);
            formData.append('compte_tel', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountphone1);
            formData.append('compte_tel2', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountphone2);
            formData.append('compte_cp', $scope.form.choosepayer !== cfg.PAYER_TYPE_OTHER ? '' : $scope.form.accountpostalcode);
            formData.append('compte_representant_nom', $scope.form.choosepayer === cfg.PAYER_TYPE_OTHER && $scope.form.payertype === 'company' ? $scope.form.accountrepresentantname : '');
            formData.append('compte_representant_dni', $scope.form.choosepayer === cfg.PAYER_TYPE_OTHER && $scope.form.payertype === 'company' ? $scope.form.accountrepresentantdni : '');
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
            // TODO: Format it!
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
            $scope.step0Ready = false;
            $scope.step8Ready = true;
            $scope.step1Ready = true;
            $scope.step2Ready = true;
            $scope.step3Ready = true;
            $scope.step4Ready = true;
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
            $scope.ibanEditor.value = debugCfg.IBAN1
            $scope.ibanEditor.value += debugCfg.IBAN2;
            $scope.ibanEditor.value += debugCfg.IBAN3;
            $scope.ibanEditor.value += debugCfg.IBAN4;
            $scope.ibanEditor.value += debugCfg.IBAN5;
            $scope.ibanEditor.value += debugCfg.IBAN6;
            cfg.API_BASE_URL = 'https://sompre.gisce.net:5001/';
        }
    });


