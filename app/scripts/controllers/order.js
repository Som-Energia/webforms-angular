'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', 'debugCfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, debugCfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // DEBUG MODE
        var debugEnabled = false;

        // DEVELOP ENVIRONMENT
        var develEnvironment = false;

        // MUST APPLY TO EMBED WITH WORDPRESS
        if (!develEnvironment) {
            document.domain = cfg.BASE_DOMAIN;
        }

        // INIT
        $scope.step0Ready = true;
        $scope.step1Ready = false;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.step4Ready = false;
        $scope.dniIsInvalid = false;
        $scope.cupsIsInvalid = false;
        $scope.cnaeIsInvalid = false;
        $scope.postalCodeIsInvalid = false;
        $scope.accountPostalCodeIsInvalid = false;
        $scope.invalidAttachFileExtension = false;
        $scope.overflowAttachFile = false;
        $scope.accountIsInvalid = false;
        $scope.showUnknownSociWarning = false;
        $scope.showBeginOrderForm = false;
        $scope.showStep1Form = false;
        $scope.initSubmitReady = false;
        $scope.initFormSubmitted = false;
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
        $scope.form.init = {};
        $scope.rates = [cfg.RATE_20A, cfg.RATE_20DHA, cfg.RATE_21A, cfg.RATE_21DHA, cfg.RATE_30A];
//        $scope.form.accountbankiban1 = 'ES';
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // GET LANGUAGES
        AjaxHandler.getLanguages($scope);

        // GET STATES
        AjaxHandler.getStates($scope);

        // GET PARTNER DATA
        $scope.executeGetSociValues = function() {
            var sociPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/soci/' + $scope.form.init.socinumber + '/' + $scope.form.init.dni, '001');
            sociPromise.then(
                function(response) {
                    if (response.state === cfg.STATE_TRUE) {
                        $log.log('Get partner info response recived', response);
                        $scope.soci = response.data.soci;
                        $scope.showBeginOrderForm = true;
                        $scope.showUnknownSociWarning = false;
                        if (debugEnabled) {
                            $scope.showStep1Form = false;
                        }
                    } else {
                        $scope.showUnknownSociWarning = true;
                        $scope.showStep1Form = false;
                    }
                },
                function(reason) { $log.error('Get partner info failed', reason); }
            );
        };

        // PARTNER NUMBER VALIDATION
        ValidateHandler.validateInteger($scope, 'form.init.socinumber');

        // POWER VALIDATION
        ValidateHandler.validatePower($scope, 'form.power');
        ValidateHandler.validatePower($scope, 'form.power2');
        ValidateHandler.validatePower($scope, 'form.power3');
        ValidateHandler.validateInteger($scope, 'form.estimation');

        // DNI VALIDATION
        var checkDniTimer = false;
        ValidateHandler.validateDni($scope, 'form.init.dni', checkDniTimer);
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

        // CUPS VALIDATION
        var checkCupsTimer = false;
        ValidateHandler.validateCups($scope, 'form.cups', checkCupsTimer);

        // CNAE VALIDATION
        var cnaeCupsTimer = false;
        ValidateHandler.validateCnae($scope, 'form.cnae', cnaeCupsTimer);

        // POSTAL CODE VALIDATION
        ValidateHandler.validatePostalCode($scope, 'form.postalcode');
        ValidateHandler.validatePostalCode($scope, 'form.accountpostalcode');

        // TELEPHONE VALIDATION
        ValidateHandler.validateTelephoneNumber($scope, 'form.phone1');
        ValidateHandler.validateTelephoneNumber($scope, 'form.phone2');
        ValidateHandler.validateTelephoneNumber($scope, 'form.accountphone1');
        ValidateHandler.validateTelephoneNumber($scope, 'form.accountphone2');

        // BANK ACCOUNT VALIDATION
        ValidateHandler.validateBankAccountInteger($scope, 'form.accountbank');
        ValidateHandler.validateBankAccountInteger($scope, 'form.accountoffice');
        ValidateHandler.validateBankAccountInteger($scope, 'form.accountchecksum');
        ValidateHandler.validateBankAccountInteger($scope, 'form.accountnumber');

        // IBAN VALIDATION
//        ValidateHandler.validateIban($scope, 'form.accountbankiban1');
//        ValidateHandler.validateIban($scope, 'form.accountbankiban2');
//        ValidateHandler.validateIban($scope, 'form.accountbankiban3');
//        ValidateHandler.validateIban($scope, 'form.accountbankiban4');
//        ValidateHandler.validateIban($scope, 'form.accountbankiban5');
//        ValidateHandler.validateIban($scope, 'form.accountbankiban6');

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity = function() {
            AjaxHandler.getCities($scope, 1, $scope.form.province.id);
        };
        $scope.updateSelectedCity2 = function() {
            AjaxHandler.getCities($scope, 2, $scope.form.province2.id);
        };
        $scope.updateSelectedCity3 = function() {
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

        // CONTROL READY STEPS ON CHANGE FORM
        $scope.formListener = function() {
            $scope.initSubmitReady = $scope.form.init.dni !== undefined && $scope.form.init.socinumber !== undefined && $scope.dniIsInvalid === false;
            $scope.isStep2ButtonReady = $scope.initSubmitReady &&
                $scope.form.address !== undefined &&
                $scope.form.province !== undefined &&
                $scope.form.city !== undefined &&
                $scope.form.cups !== undefined &&
                $scope.form.cnae !== undefined &&
                $scope.cupsIsInvalid === false &&
                $scope.cupsIsDuplicated === false &&
                $scope.cnaeIsInvalid === false &&
                $scope.form.power !== undefined &&
                $scope.form.rate !== undefined &&
                !$scope.overflowAttachFile;
            $scope.isStep3ButtonReady = $scope.isStep2ButtonReady &&
                $scope.form.changeowner !== undefined &&
                $scope.form.accept !== undefined &&
                $scope.form.accept !== false &&
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
                !$scope.accountIsInvalid &&
                $scope.completeAccountNumber.length > 0 &&
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
        $scope.formAccountListener = function () {
            if ($scope.form.accountbank !== undefined && $scope.form.accountoffice !== undefined && $scope.form.accountchecksum !== undefined && $scope.form.accountnumber !== undefined) {
                $scope.completeAccountNumber = $scope.getCompleteAccountNumber();
                var accountPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/bank/' + $scope.completeAccountNumber, '017');
                accountPromise.then(
                    function (response) {
                        $scope.accountIsInvalid = response === cfg.STATE_FALSE;
                        $scope.orderForm.accountbank.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountoffice.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountchecksum.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.orderForm.accountnumber.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.formListener($scope.form);
                    },
                    function(reason) { $log.error('Check account number failed', reason); }
                );
            }
        };
//        $scope.formAccountIbanListener = function () {
//            if ($scope.form.accountbankiban1 !== undefined && $scope.form.accountbankiban2 !== undefined && $scope.form.accountbankiban3 !== undefined && $scope.form.accountbankiban4 !== undefined && $scope.form.accountbankiban5 !== undefined && $scope.form.accountbankiban6 !== undefined) {
//                $scope.completeAccountNumber = $scope.getCompleteIban();
//                var accountPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/iban/' + $scope.completeAccountNumber, '017');
//                accountPromise.then(
//                    function (response) {
//                        $scope.accountIsInvalid = response === cfg.STATE_FALSE;
//                        $scope.orderForm.accountbankiban1.$setValidity('invalid', !$scope.accountIsInvalid);
//                        $scope.orderForm.accountbankiban2.$setValidity('invalid', !$scope.accountIsInvalid);
//                        $scope.orderForm.accountbankiban3.$setValidity('invalid', !$scope.accountIsInvalid);
//                        $scope.orderForm.accountbankiban4.$setValidity('invalid', !$scope.accountIsInvalid);
//                        $scope.orderForm.accountbankiban5.$setValidity('invalid', !$scope.accountIsInvalid);
//                        $scope.orderForm.accountbankiban6.$setValidity('invalid', !$scope.accountIsInvalid);
//                        $scope.formListener($scope.form);
//                    },
//                    function(reason) { $log.error('Check IBAN failed', reason); }
//                );
//            }
//        };

        // MOVE TO STEP 1 FORM
        $scope.initOrderForm = function() {
            $scope.showStep1Form = true;
            $scope.setStepReady(1, 'initOrderForm');
        };

        // BACK TO STEP 1 FORM
        $scope.backToStep1Form = function() {
            $scope.setStepReady(0, 'backToStep1Form');
        };

        // MOVE TO STEP 2 FORM
        $scope.moveToStep2Form = function() {
            $scope.setStepReady(2, 'moveToStep2Form');
        };

        // BACK TO STEP 2 FORM
        $scope.backToStep2Form = function() {
            $scope.setStepReady(1, 'backToStep2Form');
        };

        // MOVE TO STEP 3 FORM
        $scope.moveToStep3Form = function() {
            $scope.setStepReady(3, 'moveToStep3Form');
        };

        // BACK TO STEP 3 FORM
        $scope.backToStep3Form = function() {
            $scope.setStepReady(2, 'backToStep3Form');
        };

        // MOVE TO STEP 4 FORM
        $scope.moveToStep4Form = function() {
            $scope.setStepReady(4, 'moveToStep4Form');
        };

        // BACK TO STEP 4 FORM
        $scope.backToStep4Form = function() {
            $scope.setStepReady(3, 'backToStep4Form');
        };

        // COMMON MOVE STEPS LOGIC
        $scope.setStepReady = function(enabledStep, eventArgument) {
            $scope.step0Ready = enabledStep === 0;
            $scope.step1Ready = enabledStep === 1;
            $scope.step2Ready = enabledStep === 2;
            $scope.step3Ready = enabledStep === 3;
            $scope.step4Ready = enabledStep === 4;
            if (debugEnabled) {
                $log.log(eventArgument);
            }
            if (develEnvironment) {
                jQuery(document).trigger('moveStep', [eventArgument]);
            } else {
                parent.jQuery('body').trigger('moveStep', [eventArgument]);
            }
        };

        // ON INIT SUBMIT FORM
        var checkEnableInitSubmit1 = false;
        $scope.$watch('form.init.socinumber', function(newValue) {
            if (checkEnableInitSubmit1) {
                $timeout.cancel(checkEnableInitSubmit1);
            }
            checkEnableInitSubmit1 = $timeout(function() {
                if (newValue !== undefined && !$scope.dniIsInvalid && $scope.form.init.dni !== undefined) {
                    $scope.executeGetSociValues();
                }
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });
        var checkEnableInitSubmit2 = false;
        $scope.$watch('form.init.dni', function(newValue) {
            if (checkEnableInitSubmit2) {
                $timeout.cancel(checkEnableInitSubmit2);
            }
            checkEnableInitSubmit2 = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                    dniPromise.then(
                        function (response) {
                            $scope.dniIsInvalid  = response === cfg.STATE_FALSE;
                            if (!$scope.dniIsInvalid && $scope.form.init.socinumber !== undefined) {
                                $scope.executeGetSociValues();
                            }
                        },
                        function (reason) { $log.error('Check DNI failed', reason); }
                    );
                }
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });

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
            formData.append('id_soci', $scope.form.init.socinumber);
            formData.append('dni', $scope.form.init.dni);
            formData.append('tipus_persona', $scope.form.usertype === 'person' ? 0 : 1);
            formData.append('soci_titular', $scope.form.isownerlink === 'yes' ? 1 : 0);
            formData.append('canvi_titular', $scope.form.changeowner === 'yes' ? 1 : 0);
            formData.append('representant_nom', $scope.form.usertype === 'company' ? $scope.form.representantname : '');
            formData.append('representant_dni', $scope.form.usertype === 'company' ? $scope.form.representantdni : '');
            formData.append('titular_nom', $scope.form.isownerlink === 'yes' ? $scope.soci.nom : $scope.form.name);
            formData.append('titular_cognom', $scope.form.isownerlink === 'yes' ? $scope.soci.cognom : $scope.form.surname === undefined ? '' : $scope.form.surname);
            formData.append('titular_dni', $scope.form.isownerlink === 'yes' ? $scope.soci.dni : $scope.form.dni);
            formData.append('titular_email', $scope.form.isownerlink === 'yes' ? $scope.soci.email : $scope.form.email1);
            formData.append('titular_tel', $scope.form.isownerlink === 'yes' ? $scope.soci.tel : $scope.form.phone1);
            formData.append('titular_tel2', $scope.form.isownerlink === 'yes' ? $scope.soci.tel2 : $scope.form.phone2 === undefined ? '' : $scope.form.phone2);
            formData.append('titular_adreca', $scope.form.isownerlink === 'yes' ? $scope.soci.adreca : $scope.form.address2);
            formData.append('titular_municipi', $scope.form.isownerlink === 'yes' ? $scope.soci.municipi : $scope.form.city2.id);
            formData.append('titular_cp', $scope.form.isownerlink === 'yes' ? $scope.soci.cp : $scope.form.postalcode);
            formData.append('titular_provincia', $scope.form.isownerlink === 'yes' ? $scope.soci.provincia : $scope.form.province2.id);
            formData.append('tarifa', $scope.form.rate);
            formData.append('cups', $scope.form.cups);
            formData.append('consum', $scope.form.estimation === undefined ? '' : $scope.form.estimation);
            formData.append('potencia', Math.round($scope.form.power * cfg.THOUSANDS_CONVERSION_FACTOR));
            formData.append('potencia_p2', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power2 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('potencia_p3', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power3 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('cnae', $scope.form.cnae);
            formData.append('cups_adreca', $scope.form.address);
            formData.append('cups_provincia', $scope.form.province.id);
            formData.append('cups_municipi', $scope.form.city.id);
            formData.append('referencia', $scope.form.catastre === undefined ? '' : $scope.form.catastre);
            formData.append('fitxer', jQuery('#fileuploaderinput')[0].files[0]);
            formData.append('entitat', $scope.form.accountbank);
            formData.append('sucursal', $scope.form.accountoffice);
            formData.append('control', $scope.form.accountchecksum);
            formData.append('ncompte', $scope.form.accountnumber);
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
                    $log.log('response recived', response);
                    if (response.data.status === cfg.STATUS_ONLINE) {
                        if (response.data.state === cfg.STATE_TRUE) {
                            // well done
                            uiHandler.showWellDoneDialog();
                            $window.top.location.href = cfg.CONTRACT_OK_REDIRECT_URL;
                        } else {
                            // error
                            $scope.messages = $scope.getHumanizedAPIResponse(response.data.data);
                            $scope.submitReady = false;
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
                    $scope.step1Ready = true;
                    $scope.step2Ready = true;
                    $scope.step3Ready = true;
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
            $scope.step1Ready = true;
            $scope.step2Ready = true;
            $scope.step3Ready = true;

            return result;
        };

        // GET COMPLETE ACCOUNT NUMBER
        $scope.getCompleteAccountNumber = function() {
            return $scope.form.accountbank + $scope.form.accountoffice + $scope.form.accountchecksum + $scope.form.accountnumber;
        };
        $scope.getCompleteIban = function() {
            return $scope.form.accountbankiban1 + $scope.form.accountbankiban2 + $scope.form.accountbankiban3 + $scope.form.accountbankiban4 + $scope.form.accountbankiban5 + $scope.form.accountbankiban6;
        };

        // GET COMPLETE ACCOUNT NUMBER WITH FORMAT
        $scope.getCompleteAccountNumberWithFormat = function() {
            return $scope.form.accountbank + '-' + $scope.form.accountoffice + '-' + $scope.form.accountchecksum + '-' + $scope.form.accountnumber;
        };

        // DEBUG (only apply on development environment)
        if (debugEnabled) {
            $scope.form.init.socinumber = debugCfg.SOCI;
            $scope.form.init.dni = debugCfg.DNI;
//            $scope.form.province = {id: 0, name: 'province'};
//            $scope.form.city = {id: 0, name: 'city'};
            $scope.form.address = debugCfg.ADDRESS;
            $scope.form.cups = debugCfg.CUPS;
            $scope.form.cnae = debugCfg.CNAE;
            $scope.form.power = debugCfg.POWER;
            $scope.form.rate = debugCfg.RATE;
            $scope.executeGetSociValues();
            $scope.showStep1Form = true;
            $scope.step0Ready = false;
            $scope.step1Ready = true;
            $scope.step2Ready = true;
            $scope.step3Ready = true;
            $scope.step4Ready = true;
            $scope.form.accountbank = debugCfg.ACCOUNT_BANK;
            $scope.form.accountoffice = debugCfg.ACCOUNT_OFFICE;
            $scope.form.accountchecksum = debugCfg.ACCOUNT_CHECKSUM;
            $scope.form.accountnumber = debugCfg.ACCOUNT_NUMBER;
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
            $scope.form.accountbankiban1 = debugCfg.IBAN1;
            $scope.form.accountbankiban2 = debugCfg.IBAN2;
            $scope.form.accountbankiban3 = debugCfg.IBAN3;
            $scope.form.accountbankiban4 = debugCfg.IBAN4;
            $scope.form.accountbankiban5 = debugCfg.IBAN5;
            $scope.form.accountbankiban6 = debugCfg.IBAN6;
            cfg.API_BASE_URL = 'http://sompre.gisce.net:5001/';
        }
    }]);
