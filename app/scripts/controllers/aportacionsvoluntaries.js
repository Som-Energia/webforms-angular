'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('AportacioVoluntariaCtrl', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.developing = cfg.DEVELOPMENT;

        // Just when developing, show untranslated strings instead of falling back to spanish
        if (!$scope.developing ) {
            $translate.fallbackLanguage('es');
        }

        // MUST APPLY TO EMBED WITH WORDPRESS
        if (cfg.BASE_DOMAIN) {
            document.domain = cfg.BASE_DOMAIN;
        }
        $scope.setStep = function(step) {
            $scope.currentStep = step;
        };
        $scope.isStep = function(step) {
            return $scope.currentStep === step;
        };
        $scope.setStep(0);

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
                socinumber: $scope.formsoci.socinumber,
                dni: $scope.formsoci.dni,
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

    });



