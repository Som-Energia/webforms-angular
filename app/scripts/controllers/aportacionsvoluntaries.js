'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('AportacioVoluntariaCtrl', ['cfg', 'debugCfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, debugCfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // DEBUG MODE
        var debugEnabled = true;

        // DEVELOP ENVIRONMENT
        var develEnvironment = true; // TODO change xorigin domain on index.html && replace grunt sftp source environment

        // MUST APPLY TO EMBED WITH WORDPRESS
        if (!develEnvironment) {
            document.domain = cfg.BASE_DOMAIN;
        }

        // INIT
        $scope.developing = develEnvironment;
        $scope.mostraNomSociTrobat = false;

        $scope.setStep = function(step) {
            $scope.currentStep = step;
        };
        $scope.isStep = function(step) {
            return $scope.currentStep === step;
        };
        $scope.setStep(0);

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

        $scope.dniIsInvalid = true;
        $scope.accountIsInvalid = true;
        $scope.isInvestmentFormReady = false;
        $scope.languages = [];
        $scope.language = {};
        $scope.form = {};
        $scope.form.init = {};
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        $translate('INICIAR_INVERSIO').then(function(translation) {
            $scope.initFormActionText = translation;
        });

        $scope.form.accountbankiban = '';
        $scope.aportacioMinima = 100;
        $scope.aportacioMaxima = 25000;
        $scope.aportacioSalts = 100;
        $scope.amountAboveMax = false;
        $scope.amountUnderMin = false;
        $scope.amountNotHundred = false;
        $scope.form.amount = 100;
        $scope.form.acceptaccountowner = false;

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
                        $scope.initFormState = $scope.initFormStates.READY;
                    } else {
                        $scope.initFormState = $scope.initFormStates.INVALIDMEMBER;
                    }
                },
                function(reason) {
                    $scope.initFormState = $scope.initFormStates.APIERROR;
                    $scope.apiError = reason;
                    $log.error('Get partner info failed', reason);
                }
            );
        };

        $scope.isInvestmentFormReady = function() {
            if ($scope.form.accountbankiban === undefined) {return false;}
            if ($scope.accountIsInvalid !== false) {return false;}
            if ($scope.amountUnderMin) {return false;}
            if ($scope.amountAboveMax) {return false;}
            if ($scope.amountNotHundred) {return false;}
            if ($scope.form.acceptaccountowner === false) {return false;}
            return true;
        };

        // PARTNER NUMBER VALIDATION
        ValidateHandler.validateInteger($scope, 'form.init.socinumber');

        // IBAN VALIDATION
        ValidateHandler.validateIban($scope, 'form.accountbankiban');

        $scope.formAccountIbanListener = function () {
            if ($scope.form.accountbankiban === undefined) {
                $scope.accountIsInvalid = true;
                return;
            }
            $scope.accountIsInvalid = undefined; // checking
            var accountPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/iban/' + $scope.form.accountbankiban, '017');
            accountPromise.account = $scope.form.accountbankiban;
            accountPromise.then(
                function (response) {
                    if (accountPromise.account !== $scope.form.accountbankiban) {
                        // Changed while waiting a response, ignore
                        return;
                    }
                    $scope.accountIsInvalid = response === cfg.STATE_FALSE;
                },
                function(reason) { $log.error('Check IBAN failed', reason); }
            );
        };

        $scope.initFormSubmited = function() {
            $scope.showStep1Form = true;
            $scope.setStep(1);
        };

        var timeoutCheckSoci = false;
        $scope.$watch('form.init.socinumber', function(newValue) {
            if ($scope.initFormIsIdle()) {return;}
            if ($scope.initFormIsValidatingId()) {return;}
            if ($scope.initFormIsInvalidId()) {return;}

            if (newValue === undefined) {
                $scope.initFormState = $scope.initFormStates.INVALIDMEMBER;
                return;
            }

            $scope.initFormState = $scope.initFormStates.VALIDATINGMEMBER;

            if (timeoutCheckSoci) {
                $timeout.cancel(timeoutCheckSoci);
            }
            timeoutCheckSoci = $timeout(function() {
                // TODO: Remove redundant conditions
                if (newValue !== undefined && !$scope.dniIsInvalid && $scope.form.init.dni !== undefined) {
                    $scope.executeGetSociValues();
                }
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });
        var timeoutCheckDni = false;
        $scope.$watch('form.init.dni', function(newValue) {
            if (newValue === undefined) {
                $scope.initFormState = $scope.initFormStates.IDLE;
                return;
            }
            $scope.initFormState = $scope.initFormStates.VALIDATINGID;
            if (timeoutCheckDni) {
                $timeout.cancel(timeoutCheckDni);
            }
            timeoutCheckDni = $timeout(function() {
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

        // Backward with order.js  
        $scope.formListener = function() {
        };

        // ON SUBMIT FORM
        $scope.sendInvestment = function() {
            $scope.messages = null;
            uiHandler.showLoadingDialog();
            // Send request data POST
            var formData = new FormData();
            angular.forEach({
                socinumber: $scope.form.init.socinumber,
                dni: $scope.form.init.dni,
                accountbankiban: $scope.form.accountbankiban,
                amount: $scope.form.amount,
                acceptaccountowner: 1,
            }, function(value, key) {
                console.log(key, value);
                formData.append(key,value);
            });
            $http({
                method: 'POST',
                url: cfg.API_BASE_URL + 'form/inversio',
                headers: {'Content-Type': undefined},
                data: formData,
                transformRequest: angular.identity,
            }).then(
                function(response) {
                    uiHandler.hideLoadingDialog();
                    $log.log('response received', response);
                    if (response.data.status === cfg.STATUS_OFFLINE) {
                        uiHandler.showErrorDialog('API server status offline (ref.022-022)');
                        return;
                    }
                    if (response.data.status !== cfg.STATUS_ONLINE) {
                        uiHandler.showErrorDialog('API server unknown status (ref.021-021)');
                        return;
                    }
                    if (response.data.state !== cfg.STATE_TRUE) {
                        // error
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data.data);
                        $scope.submitReady = false;
                        $scope.rawReason = JSON.stringify(response,null,'  ');
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                        return;
                    }

                    uiHandler.showWellDoneDialog();
                    // TODO: Cambiar a una pagina de exito propia
                    $window.top.location.href = cfg.CONTRACT_OK_REDIRECT_URL;
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
                    $scope.rawReason = JSON.stringify(reason,null,'  ');
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
