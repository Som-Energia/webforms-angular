'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('AportacioVoluntariaCtrl', ['cfg', 'debugCfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, debugCfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // DEBUG MODE
        var debugEnabled = false;

        // DEVELOP ENVIRONMENT
        var develEnvironment = true; // TODO change xorigin domain on index.html && replace grunt sftp source environment

        // MUST APPLY TO EMBED WITH WORDPRESS
        if (!develEnvironment) {
            document.domain = cfg.BASE_DOMAIN;
        }

        // INIT
        $scope.developing = develEnvironment;
        $scope.step0Ready = true;
        $scope.step1Ready = false;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.step4Ready = false;
        $scope.initFormStates = {
            IDLE: 1,
            VALIDATINGID: 2,
            VALIDATINGMEMBER: 3,
            INVALIDID: 4,
            INVALIDMEMBER: 5,
            READY: 6,
            APIERROR: 7,
        };
        $scope.initFormState = $scope.initFormStates.IDLE;

        $scope.initFormIsIdle = function () {
            return $scope.initFormState === $scope.initFormStates.IDLE;
        };
        $scope.initFormIsValidatingId = function () {
            return $scope.initFormState === $scope.initFormStates.VALIDATINGID;
        };
        $scope.initFormIsValidatingMember = function () {
            return $scope.initFormState === $scope.initFormStates.VALIDATINGMEMBER;
        };
        $scope.initFormIsInvalidId = function () {
            return $scope.initFormState === $scope.initFormStates.INVALIDID;
        };
        $scope.initFormIsInvalidMember = function () {
            return $scope.initFormState === $scope.initFormStates.INVALIDMEMBER;
        };
        $scope.initFormIsReady = function () {
            return $scope.initFormState === $scope.initFormStates.READY;
        };
        $scope.initFormIsApiError = function () {
            return $scope.initFormState === $scope.initFormStates.APIERROR;
        };
        $scope.currentInitState = function() {
            return Object.keys($scope.initFormStates)
                .filter(function(key) {
                    return $scope.initFormStates[key] === $scope.initFormState;
                })[0];
        };

        $scope.dniIsInvalid = false;
        $scope.accountIsInvalid = false;
        $scope.showBeginOrderForm = false;
        $scope.showStep1Form = false;
        $scope.isStep2ButtonReady = false;
        $scope.isStep3ButtonReady = false;
        $scope.isFinalStepButtonReady = false;
        $scope.orderFormSubmitted = false;
        $scope.languages = [];
        $scope.language = {};
        $scope.form = {};
        $scope.completeAccountNumber = '';
        $scope.form.init = {};
        $scope.form.accountbankiban = 'ES';
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        $scope.amountAboveMax = false;
        $scope.amountUnderMin = false;
        $scope.amountNotHundred = false;
        $scope.form.amount = 100;
        $scope.aportacioMinima = 100;
        $scope.aportacioMaxima = 25000;
        $scope.aportacioSalts = 100;

        $scope.$watch('form.amount', function(newValue, oldValue) {
            if (newValue === undefined) {
                $scope.amountAboveMax = false;
                $scope.amountNotHundred = false;
                $scope.amountUnderMin = false;
                return;
            }
            if (! /^\d+$/.test(newValue)) {
                $scope.form.amount = oldValue;
                return;
            }
            $scope.amountAboveMax = (newValue > $scope.aportacioMaxima)? true : false;
            $scope.amountNotHundred = (newValue % $scope.aportacioSalts) !== 0;
            $scope.amountUnderMin = newValue < $scope.aportacioMinima;
        });

        // GET LANGUAGES
        AjaxHandler.getLanguages($scope);

        // GET PARTNER DATA
        $scope.executeGetSociValues = function() {
            var sociPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/soci/' + $scope.form.init.socinumber + '/' + $scope.form.init.dni, '001');
            sociPromise.soci = $scope.form.init.socinumber;
            sociPromise.dni = $scope.form.init.dni;
            sociPromise.then(
                function(response) {
                    if ($scope.form.init.socinumber !== sociPromise.soci) {return;}
                    if ($scope.form.init.dni !== sociPromise.dni) {return;}

                    if (response.state === cfg.STATE_TRUE) {
                        $log.log('Get partner info response recived', response);
                        $scope.soci = response.data.soci;
                        $scope.showBeginOrderForm = true;
                        $scope.initFormState = $scope.initFormStates.READY;
                        if (debugEnabled) {
                            $scope.showStep1Form = false;
                        }
                    } else {
                        $scope.initFormState = $scope.initFormStates.INVALIDMEMBER;
                        $scope.showStep1Form = false;
                    }
                },
                function(reason) {
                    $scope.initFormState = $scope.initFormStates.APIERROR;
                    $scope.apiError = reason;
                    $log.error('Get partner info failed', reason);
                }
            );
        };

        // PARTNER NUMBER VALIDATION
        ValidateHandler.validateInteger($scope, 'form.init.socinumber');

        // IBAN VALIDATION
        ValidateHandler.validateIban($scope, 'form.accountbankiban');

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
                    function(reason) {
                        $scope.initFormState = $scope.initFormStates.APIERROR;
                        $scope.apiError = reason;
                        $log.error('Check account number failed', reason);
                    }
                );
            }
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
            if ($scope.initFormIsIdle()) {return;}
            if ($scope.initFormIsValidatingId()) {return;}
            if ($scope.initFormIsInvalidId()) {return;}

            if (newValue === undefined) {
                $scope.initFormState = $scope.initFormStates.INVALIDMEMBER;
                return;
            }

            $scope.initFormState = $scope.initFormStates.VALIDATINGMEMBER;

            if (checkEnableInitSubmit1) {
                $timeout.cancel(checkEnableInitSubmit1);
            }
            checkEnableInitSubmit1 = $timeout(function() {
                // TODO: Remove redundant conditions
                if (newValue !== undefined && !$scope.dniIsInvalid && $scope.form.init.dni !== undefined) {
                    $scope.executeGetSociValues();
                }
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });
        var checkEnableInitSubmit2 = false;
        $scope.$watch('form.init.dni', function(newValue) {
            if (newValue === undefined) {
                $scope.initFormState = $scope.initFormStates.IDLE;
                return;
            }
            $scope.initFormState = $scope.initFormStates.VALIDATINGID;
            if (checkEnableInitSubmit2) {
                $timeout.cancel(checkEnableInitSubmit2);
            }
            checkEnableInitSubmit2 = $timeout(function() {
                var dniPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                dniPromise.dni = newValue;
                dniPromise.then(
                    function (response) {
                        if (dniPromise.dni !== $scope.form.init.dni) {
                            //console.log('Ignorant validació del DNI '+dniPromise.dni+' perque ja val '+$scope.form.init.dni);
                            return;
                        }
                        $scope.dniIsInvalid  = response === cfg.STATE_FALSE;
                        if ($scope.dniIsInvalid) {
                            $scope.initFormState = $scope.initFormStates.INVALIDID;
                            return;
                        }
                        if ($scope.form.init.socinumber === undefined) {
                            // TODO: Review this transition
                            $scope.initFormState = $scope.initFormStates.INVALIDMEMBER;
                            return;
                        }
                        $scope.initFormState = $scope.initFormStates.VALIDATINGMEMBER;
                        $scope.executeGetSociValues();
                    },
                    // TODO: Server error state and display reason
                    function (reason) {
                        $log.error('Check DNI failed', reason);
                        $scope.initFormState = $scope.initFormStates.APIERROR;
                    }
                );
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });

        // ON SUBMIT FORM
        $scope.submitOrder = function() {
            $scope.messages = null;
            $scope.orderFormSubmitted = true;
            uiHandler.showLoadingDialog();
            // Prepare request data
            var formData = new FormData();
            formData.append('id_soci', $scope.form.init.socinumber);
            formData.append('dni', $scope.form.init.dni);
            formData.append('payment_iban', $scope.form.accountbankiban);
            formData.append('condicions', 1);
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
                    $scope.step1Ready = true;
                    $scope.step2Ready = true;
                    $scope.step3Ready = true;
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
                        $scope.orderForm.cups.$setValidity('exist', false);
                    } else if (arrayResponse.invalid_fields[j].field === 'fitxer' && arrayResponse.invalid_fields[j].error === 'bad_extension') {
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
        $scope.getCompleteIbanWithFormat = function() {
            return $scope.form.accountbankiban1 + ' ' + $scope.form.accountbankiban2 + ' ' + $scope.form.accountbankiban3 + ' ' + $scope.form.accountbankiban4 + ' ' + $scope.form.accountbankiban5 + ' ' + $scope.form.accountbankiban6;
        };

        // DEBUG (only apply on development environment)
        if (debugEnabled) {
            cfg.API_BASE_URL = 'http://sompre.gisce.net:5001/';
        }
    }]);
