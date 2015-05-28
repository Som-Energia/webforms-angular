'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('AportacioVoluntariaCtrl', function (cfg, debugCfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // DEBUG MODE
        var debugEnabled = false;

        // DEVELOP ENVIRONMENT
        var develEnvironment = false; // TODO change xorigin domain on index.html && replace grunt sftp source environment

        // MUST APPLY TO EMBED WITH WORDPRESS
        if (!develEnvironment) {
            document.domain = cfg.BASE_DOMAIN;
        }
        // Just when developing, show untranslated strings instead of falling back to spanish
        if (!develEnvironment ) {
            $translate.fallbackLanguage('es');
        }
        // DEBUG (only apply on development environment)
        if (debugEnabled) {
            cfg.API_BASE_URL = 'https://sompre.gisce.net:5001/';
        }

        // INIT
        $scope.developing = develEnvironment;

        $scope.setStep = function(step) {
            $scope.currentStep = step;
        };
        $scope.isStep = function(step) {
            return $scope.currentStep === step;
        };
        $scope.setStep(0);

        $scope.dniIsInvalid = true;
        $scope.accountIsInvalid = true;
        $scope.isInvestmentFormReady = false;
        $scope.languages = [];
        $scope.language = {};
        $scope.form = {};
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }
        $scope.submitButtonText = $translate.instant('CONFIRMAR_INVERSIO');

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

        $scope.isInvestmentFormReady = function() {
            if ($scope.form.accountbankiban === undefined) {return false;}
            if ($scope.accountIsInvalid !== false) {return false;}
            if ($scope.amountUnderMin) {return false;}
            if ($scope.amountAboveMax) {return false;}
            if ($scope.amountNotHundred) {return false;}
            if ($scope.form.acceptaccountowner === false) {return false;}
            return true;
        };

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

        $scope.submiting = false;

        $scope.initFormSubmited = function() {
            $scope.setStep(1);
        };

        // Backward with order.js  
        $scope.formListener = function() {
        };

        // ON SUBMIT FORM
        $scope.sendInvestment = function() {
            $scope.messages = null;
            $scope.submiting = true;
            // Send request data POST
            var formData = new FormData();
            angular.forEach({
                socinumber: $scope.form.init.socinumber,
                dni: $scope.form.init.dni,
                accountbankiban: $scope.form.accountbankiban,
                amount: $scope.form.amount,
                acceptaccountowner: 1
            }, function(value, key) {
                console.log(key, value);
                formData.append(key,value);
            });

            $scope.submitButtonText = $translate.instant('SENDING');
            $http({
                method: 'POST',
                url: cfg.API_BASE_URL + 'form/inversio',
                headers: {'Content-Type': undefined},
                data: formData,
                transformRequest: angular.identity,
            }).then(
                function(response) {
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
                        $scope.rawReason = JSON.stringify(response,null,'  ');
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                        return;
                    }

                    uiHandler.showWellDoneDialog();
                    // TODO: Cambiar a una pagina de exito propia
                    $window.top.location.href = $translate.instant('INVEST_OK_REDIRECT_URL');
                },
                function(reason) {
                    $log.error('Send POST failed', reason);
                    if (reason.status === 413) {
                        $scope.messages = 'ERROR 413';
                    } else {
                        $scope.messages = 'ERROR';
                    }
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
                    result += 'ERROR INVALID FIELD: ' + arrayResponse.invalid_fields[j].field + '·' + arrayResponse.invalid_fields[j].error + ' ';
                }
            }

            return result;
        };

    })




.directive('memberValidator', function () {
    return {
        restrict: 'E',
        scope: {
            soci: '=',
            formvalues: '=',
            model: '=',
            onproceed: '&',
        },
        templateUrl: 'views/common/validacio-socia.html',
        controller: 'memberValidatorCtrl',
        link: function(scope, element, attrs, memberValidatorCtrl) {
            memberValidatorCtrl.init(element, attrs);
        },
    };
})
.controller('memberValidatorCtrl', function (
        cfg,
        $scope,
        $timeout,
        $log,
        AjaxHandler,
        ValidateHandler
        ) {
    var self = this;
    self.init = function(element, attrs) {
        $scope.soci = {};
        $scope.model = {};
        $scope.formvalues = {};
        $scope.model.formvalues = $scope.formvalues;
        $scope.model.soci = $scope.soci;
        $scope.mostraNomSociTrobat = attrs.showMemberName !== undefined;
        $scope.initFormActionText = attrs.buttonText;
        $scope.developing = false;

        $scope.initFormStates = {
            IDLE: 1,
            VALIDATINGID: 2,
            VALIDATINGMEMBER: 3,
            INVALIDID: 4,
            INVALIDMEMBER: 5,
            READY: 6,
            APIERROR: 7
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

        $scope.model={};
        $scope.model.isReady = $scope.initFormIsReady;

        var timeoutCheckSoci = false;
        $scope.$watch('formvalues.socinumber', function(newValue) {
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
                if (newValue !== undefined && !$scope.dniIsInvalid && $scope.formvalues.dni !== undefined) {
                    $scope.executeGetSociValues();
                }
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });

        var timeoutCheckDni = false;
        $scope.$watch('formvalues.dni', function(newValue) {
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
                        if (dniPromise.dni !== $scope.formvalues.dni) {
                            //console.log('Ignorant validació del DNI '+dniPromise.dni+' perque ja val '+$scope.formvalues.dni);
                            return;
                        }
                        $scope.dniIsInvalid  = response === cfg.STATE_FALSE;
                        if ($scope.dniIsInvalid) {
                            $scope.initFormState = $scope.initFormStates.INVALIDID;
                            return;
                        }
                        if ($scope.formvalues.socinumber === undefined) {
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

        // PARTNER NUMBER VALIDATION
        ValidateHandler.validateInteger($scope, 'formvalues.socinumber');

        // GET PARTNER DATA
        $scope.executeGetSociValues = function() {
            var sociPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/soci/' + $scope.formvalues.socinumber + '/' + $scope.formvalues.dni, '001');
            sociPromise.soci = $scope.formvalues.socinumber;
            sociPromise.dni = $scope.formvalues.dni;
            sociPromise.then(
                function(response) {
                    if ($scope.formvalues.socinumber !== sociPromise.soci) {return;}
                    if ($scope.formvalues.dni !== sociPromise.dni) {return;}

                    if (response.state === cfg.STATE_TRUE) {
                        $log.log('Get partner info response received', response);
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
        $scope.initFormSubmited = function() {
            $scope.onproceed();
        };
    };
});



