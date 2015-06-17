'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('GenerationKwhCtrl', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.developing = cfg.DEVELOPMENT;
        // MUST APPLY TO EMBED WITH WORDPRESS
        if (document.domain !== top.document.domain) {
            document.domain = cfg.BASE_DOMAIN;
        }

        // Just when developing, show untranslated strings instead of falling back to spanish
        if (!$scope.developing ) {
            $translate.fallbackLanguage('es');
        }
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        $scope.submitButtonText = $translate.instant('CONFIRMAR_INVERSIO');

        $scope.setStep = function(step) {
            $scope.currentStep = step;
        };
        $scope.isStep = function(step) {
            return $scope.currentStep === step;
        };
        $scope.setStep(0);

        $scope.form = {};
        $scope.form.acceptaccountowner = false;

        $scope.partnerContracts = [];
        $scope.estimatedMeanHomeUse = 2800; // kWh
        $scope.totalYearlyKwh = $scope.estimatedMeanHomeUse;
        $scope.form.energeticActions = 1;
        $scope.kwhPerAccio = 170;
        $scope.preuPerAccio = 100;
        $scope.recommendedMax = 70;
        $scope.energeticActionsCost = function() {
            return ($scope.form.energeticActions||0) * $scope.preuPerAccio;
        };
        $scope.energeticActionsThrowput = function() {
            return ($scope.form.energeticActions||0) * $scope.kwhPerAccio;
        };
        $scope.percentatgeCobert = function() {
            if (!$scope.totalYearlyKwh) { return '?'; }
            return (100 * $scope.energeticActionsThrowput() / $scope.totalYearlyKwh).toFixed(1);
        };
        $scope.orangeBarLength = function() {
            return Math.min(100-$scope.recommendedMax,Math.max(0,$scope.percentatgeCobert()-$scope.recommendedMax));
        };
        $scope.greenBarLength = function() {
            return Math.min($scope.recommendedMax,$scope.percentatgeCobert());
        };
        $scope.incrementShares = function(amount) {
            if (amount + $scope.form.energeticActions>0) {
                $scope.form.energeticActions+=amount;
                return;
            }
            $scope.form.energeticActions = 1;
        };
        $scope.$watch('form.energeticActions', function(newValue, oldValue) {
            if (isNaN(parseInt(newValue))) {
                $scope.form.energeticActions = oldValue;
                return;
            }
            var intValue = parseInt(newValue);
            if (intValue<1) {
                $scope.form.energeticActions = oldValue;
                return;
            }
        });

        $scope.isInvestmentFormReady = function() {
            if ($scope.ibanEditor === undefined) {return false;}
            if (!$scope.ibanEditor.isValid()) {return false;}
            if (!$scope.energeticActionsCost()) {return false;}
            if ($scope.form.acceptaccountowner === false) {return false;}
            if ($scope.form.acceptcontract === false) {return false;}
            return true;
        };

        $scope.submiting = false;

        $scope.initFormSubmited = function() {
            $scope.setStep(1);
            $scope.updateAnnualUse();
        };

        // Backward with order.js  
        $scope.formListener = function() {
        };

        $scope.updateAnnualUse = function() {
            $scope.partnerContracts = undefined;
            $scope.totalYearlyKwh = undefined;
            var promise = $http.get(cfg.API_BASE_URL +
               'data/consumanualsoci/' + $scope.formsoci.socinumber+'/'+ $scope.formsoci.dni);
            promise.success(function(response) {
                console.log(response.data.consums);
                $scope.partnerContracts = response.data.consums;
                $scope.totalYearlyKwh = $scope.partnerContracts.reduce(
                    function(sum, contract) {
                        return sum + contract.annual_use_kwh;
                    }, 0);
            });
            /*
            var promise = $timeout(function() {
                $scope.partnerContracts = [
                    { contract_id:'1313', supply_address:'Rue del Percebe, 13, Villabotijo, Zamora', annual_use_kwh:2342 },
                    { contract_id:'1314', supply_address:'Rue del Percebe, 14, Villabotijo, Zamora', annual_use_kwh:2343 },
                    { contract_id:'1315', supply_address:'Rue del Percebe, 15, Villabotijo, Zamora', annual_use_kwh:2344 },
                    { contract_id:'1316', supply_address:'Rue del Percebe, 16, Villabotijo, Zamora', annual_use_kwh:2345 },
                ];
                $scope.totalYearlyKwh = $scope.partnerContracts.reduce(function(sum, contract) {
                    return sum + contract.annual_use_kwh;
                }, 0);
            }, 8000);
            */
            promise.soci = $scope.formsoci.socinumber;
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
                accountbankiban: $scope.ibanEditor.value,
                amount: $scope.energeticActionsCost(),
                acceptaccountowner: 1
            }, function(value, key) {
                console.log(key, value);
                formData.append(key,value);
            });

            $scope.submitButtonText = $translate.instant('SENDING');
            $http({
                method: 'POST',
                url: cfg.API_BASE_URL + 'form/generationkwh',
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
                    $window.top.location.href = $translate.instant('GENERATION_OK_REDIRECT_URL');
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

