'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // DEBUG MODE
        var debugEnabled = true;

        // INIT
        $scope.step0Ready = true;
        $scope.step1Ready = false;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.dniIsInvalid = false;
        $scope.cupsIsInvalid = false;
        $scope.cnaeIsInvalid = false;
        $scope.invalidAttachFileExtension = false;
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
        $scope.form.choosepayer = 'titular';
        $scope.completeAccountNumber = '';
        $scope.form.init = {};
        $scope.rates = ['2.0A', '2.0DHA', '2.1A', '2.1DHA', '3.0A'];
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // GET LANGUAGES
        AjaxHandler.getLanguages($scope);

        // GET STATES
        AjaxHandler.getStates($scope);

        // PARTNER NUMBER VALIDATION
        ValidateHandler.validateInteger($scope, 'form.init.socinumber');

        // GET PARTNER DATA
        $scope.executeGetSociValues = function() {
            var sociPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/soci/' + $scope.form.init.socinumber + '/' + $scope.form.init.dni, '001');
            sociPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_TRUE) {
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
                function (reason) { $log.error('Get partner info failed', reason); }
            );
        };

        // POWER VALIDATION
        ValidateHandler.validatePower($scope, 'form.power');

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

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity = function() {
            AjaxHandler.getCities($scope, 1);
        };
        $scope.updateSelectedCity2 = function() {
            AjaxHandler.getCities($scope, 2);
        };
        $scope.updateSelectedCity3 = function() {
            AjaxHandler.getCities($scope, 3);
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
                $scope.cnaeIsInvalid === false &&
                $scope.form.power !== undefined &&
                $scope.form.rate !== undefined;
            $scope.isStep3ButtonReady = $scope.isStep2ButtonReady &&
                ($scope.form.isownerlink === 'yes' &&
                    (($scope.form.usertype === 'company' && $scope.form.representantdni !== undefined && $scope.form.representantname !== undefined) || $scope.form.usertype === 'person') ||
                    ($scope.form.isownerlink === 'no' &&
                        $scope.form.language !== undefined &&
                        $scope.form.name !== undefined &&
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
                        $scope.form.accept !== undefined &&
                        $scope.form.accept !== false &&
                        $scope.dni2IsInvalid === false &&
                        $scope.emailIsInvalid === false &&
                        $scope.emailNoIguals === false
                        )
                    );
            $scope.isFinalStepButtonReady = $scope.isStep3ButtonReady &&
                !$scope.accountIsInvalid &&
                $scope.completeAccountNumber.length > 0 &&
                $scope.form.acceptaccountowner &&
                $scope.form.voluntary !== undefined && ($scope.form.choosepayer !== 'altre' ||
                ($scope.form.choosepayer === 'altre' &&
                        $scope.form.payertype !== undefined &&
                        $scope.form.accountname !== undefined &&
                        $scope.form.accountsurname !== undefined &&
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
                        $scope.accountEmailIsInvalid === false &&
                        $scope.accountEmailNoIguals === false))
            ;
        };
        $scope.formAccountListener = function () {
            if ($scope.form.accountbank !== undefined && $scope.form.accountoffice !== undefined && $scope.form.accountchecksum !== undefined && $scope.form.accountnumber !== undefined) {
                $scope.completeAccountNumber = $scope.form.accountbank + $scope.form.accountoffice + $scope.form.accountchecksum + $scope.form.accountnumber;
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

        // MOVE TO STEP 1 FORM
        $scope.initOrderForm = function() {
            $scope.showStep1Form = true;
            $scope.step0Ready = false;
            $scope.step1Ready = true;
        };

        // BACK TO STEP 1 FORM
        $scope.backToStep1Form = function() {
            $scope.step0Ready = true;
            $scope.step1Ready = false;
            $scope.step2Ready = false;
        };

        // MOVE TO STEP 2 FORM
        $scope.moveToStep2Form = function() {
            $scope.step1Ready = false;
            $scope.step2Ready = true;
        };

        // BACK TO STEP 2 FORM
        $scope.backToStep2Form = function() {
            $scope.step2Ready = false;
            $scope.initOrderForm();
        };

        // MOVE TO STEP 3 FORM
        $scope.moveToStep3Form = function() {
            $scope.step2Ready = false;
            $scope.step3Ready = true;
        };

        // BACK TO STEP 3 FORM
        $scope.backToStep3Form = function() {
            $scope.step3Ready = false;
            $scope.moveToStep2Form();
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
            }, 1000);
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
            }, 1000);
        });
//        $scope.initSubmit = function(form) {
//            $scope.initFormSubmitted = true;
//            if (form.$invalid) {
//                return null;
//            }
//            // GET SOCI VALUES
//            $scope.executeGetSociValues();
//
//            return true;
//        };

        // ON SUBMIT FORM
        $scope.submitOrder = function() {
            $scope.orderFormSubmitted = true;
            $scope.cupsIsDuplicated = false;
            $scope.messages = null;
            $scope.orderForm.cups.$setValidity('exist', true);
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
            formData.append('potencia', $scope.form.power * 1000);
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
            formData.append('compte_nom', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountname);
            formData.append('compte_dni', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountdni);
            formData.append('compte_adreca', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountaddress);
            formData.append('compte_provincia', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.province3.id);
            formData.append('compte_municipi', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.city3.id);
            formData.append('compte_email', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountemail1);
            formData.append('compte_tel', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountphone1);
            formData.append('compte_tel2', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountphone2);
            formData.append('compte_cp', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountpostalcode);
            formData.append('compte_representant_nom', $scope.form.choosepayer === 'altre' && $scope.form.payertype === 'company' ? $scope.form.accountrepresentantname : '');
            formData.append('compte_representant_dni', $scope.form.choosepayer === 'altre' && $scope.form.payertype === 'company' ? $scope.form.accountrepresentantdni : '');
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
                function(reason) { $log.error('Send POST failed', reason); }
            );

            return true;
        };

        // GET HUMANIZED API RESPONSE
        $scope.getHumanizedAPIResponse = function(arrayResponse) {
            var result = '';
            if (arrayResponse.required_fields !== undefined) {
                result = result + 'ERROR:';
                for (var i = 0; i < arrayResponse.required_fields.length; i++) {
                    result = result + ' ' + arrayResponse.required_fields[i];
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                result = result + ' ERROR:';
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    result = result + ' ' + arrayResponse.invalid_fields[j].field + '·' + arrayResponse.invalid_fields[j].error;
                    if (arrayResponse.invalid_fields[j].field === 'cups' && arrayResponse.invalid_fields[j].error === 'exist') {
                        $scope.cupsIsDuplicated = true;
                        $scope.orderForm.cups.$setValidity('exist', false);
                    }
                }
            }
            $scope.step1Ready = true;
            $scope.step2Ready = true;
            $scope.step3Ready = true;

            return result;
        };

        // DEBUG (comment on production)
        if (debugEnabled) {
            $scope.form.init.socinumber = 1706;
            $scope.form.init.dni = '52608510N';
            $scope.form.address = 'Avda. Sebastià Joan Arbó, 6';
            $scope.form.cups = 'ES0031406222973003LE0F';
            $scope.form.cnae = '0520';
            $scope.form.power = '5.5';
            $scope.form.rate = '2.0A';
            $scope.executeGetSociValues();
            $scope.showStep1Form = true;
            $scope.step0Ready = false;
            $scope.step1Ready = true;
            $scope.step2Ready = false;
            $scope.form.accountoffice = '0001';
            $scope.form.accountchecksum = '20';
            $scope.form.accountnumber = '20363698';
        }
    }]);
