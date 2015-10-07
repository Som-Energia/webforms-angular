'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('GenerationKwhCtrl', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.developing = cfg.DEVELOPMENT;
        // MUST APPLY TO EMBED WITH WORDPRESS
        if (window !== window.top) { // Inside a frame
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

        $scope.showAll = false;
        $scope.setStep = function(step) {
            $scope.currentStep = step;
        };
        $scope.isStep = function(step) {
            return $scope.currentStep === step;
        };
        $scope.setStep(0);

        // Configurable constants
        $scope.estimatedMeanHomeUse = 2800; // kWh
        $scope.kwhPerAccio = 170;
        $scope.preuPerAccio = 100;
        $scope.recommendedMax = 70; // percent

        $scope.form = {};
        $scope.form.energeticActions = 1;
        $scope.form.acceptaccountowner = false;
        $scope.form.acceptcontract = false;
        $scope.partnerContracts = [];
        $scope.totalYearlyKwh = $scope.estimatedMeanHomeUse;
        $scope.isPartner = true;
        $scope.newPartner = {};
        $scope.initForm = {};
        $scope.ibanEditor = {};

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
            if (newValue === undefined) {
                return;
            }
            var intValue = parseInt(newValue);
            if (isNaN(intValue)) {
                $scope.form.energeticActions = oldValue;
                return;
            }
            if (intValue<1) {
                $scope.form.energeticActions = 1;
                return;
            }
            if (intValue>9999) {
                $scope.form.energeticActions = 9999;
                return;
            }
            $scope.form.energeticActions = intValue;
        });

        $scope.isInvestmentFormReady = function() {
            if ($scope.ibanEditor.isValid === undefined) {return false;}
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

        $scope.newPartnerProceed = function() {
            $scope.setStep(2);
        };

        $scope.isNewPartnerReady = function() {
            if ($scope.newPartner === undefined) { return false; }
            if ($scope.newPartner.isReady === undefined) { return false; }
            return $scope.newPartner.isReady() && $scope.form.acceptprivacypolicy;
        };

        $scope.newPartnerSubmitted = function() {
            $scope.setStep(1);
            $scope.initForm.soci.nom = $scope.newPartner.name;
            $scope.initForm.soci.cognom = $scope.newPartner.surname;

//            $scope.updateAnnualUse();
        };

        // Backward with order.js  
        $scope.formListener = function() {
        };

        $scope.updateAnnualUse = function() {
            $scope.partnerContracts = undefined;
            $scope.totalYearlyKwh = undefined;
            var promise = $http.get(cfg.API_BASE_URL +
               'data/consumanualsoci/' + $scope.formsoci.socinumber+'/'+ $scope.formsoci.dni);
            promise.soci = $scope.formsoci.socinumber;
            promise.success(function(response) {
                $log.log(response.data.consums);
                $scope.partnerContracts = response.data.consums;
                $scope.totalYearlyKwh = $scope.partnerContracts.reduce(
                    function(sum, contract) {
                        return sum + (contract.annual_use_kwh || 0);
                    }, 0);
                if ( $scope.totalYearlyKwh === 0 ) {
                    $scope.partnerContracts = [];
                    $scope.totalYearlyKwh = $scope.estimatedMeanHomeUse;
                }
            });
            promise.error(function() {
                $scope.partnerContracts = [];
                $scope.totalYearlyKwh = $scope.estimatedMeanHomeUse;
            });
        };

        $scope.proceed = function() {
            if ($scope.isPartner === true) {
                $scope.sendInvestment();
                return;
            }
            // new partner submit partner creation first

            $scope.messages = null;
            $scope.submiting = true;

            // Prepare request data
            var postData = {
                tipuspersona: $scope.newPartner.usertype === 'person' ? cfg.USER_TYPE_PERSON : cfg.USER_TYPE_COMPANY,
                nom: $scope.newPartner.name,
                dni: $scope.newPartner.dni,
                tel: $scope.newPartner.phone1,
                tel2: $scope.newPartner.phone2 || '',
                email: $scope.newPartner.email1,
                cp: $scope.newPartner.postalcode,
                provincia: $scope.newPartner.province.id,
                adreca: $scope.newPartner.address,
                municipi: $scope.newPartner.city.id,
                idioma: $scope.newPartner.language.code,
                payment_method: 'remesa',
                payment_iban: $scope.ibanEditor.value,
            };
            if ($scope.newPartner.usertype === 'person') {
                postData.cognom = $scope.newPartner.surname;
            } else if ($scope.newPartner.usertype === 'company') {
                postData.representant_nom = $scope.newPartner.representantname;
                postData.representant_dni = $scope.newPartner.representantdni;
            }
            $log.log('request postData', postData);
            // Send request data POST
            var postPromise = AjaxHandler.postRequest($scope, cfg.API_BASE_URL + 'form/soci/alta', postData, '004');
            postPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_TRUE) { // well done
                        $log.log('Tens el número de soci '+response.data.soci_num);
                        $scope.formsoci.socinumber = response.data.soci_num;
                        $scope.formsoci.dni = $scope.newPartner.dni;
                        $scope.sendInvestment();
                        return;
                    }
                    if (response.state === cfg.STATE_FALSE) { // error
                        $scope.modalTitle = $translate.instant('ERROR_POST_NOVASOCIA');
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data);
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                    }
                },
                function (reason) {
                    $log.error('Post data failed', reason);
                    $scope.modalTitle = $translate.instant('ERROR_POST_NOVASOCIA');
                    $scope.rawReason = reason;
                    jQuery('#webformsGlobalMessagesModal').modal('show');
                }
            );

            return true;
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
                        $scope.modalTitle = $translate.instant('ERROR_POST_INVERSIO');
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data.data);
                        $scope.rawReason = JSON.stringify(response,null,'  ');
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                        return;
                    }

                    uiHandler.showWellDoneDialog();
                    $window.top.location.href = $translate.instant('GENERATION_OK_REDIRECT_URL');
                },
                function(reason) {
                    $log.error('Send POST failed', reason);
                    if (reason.status === 413) {
                        $scope.messages = 'ERROR 413';
                    } else {
                        $scope.messages = 'ERROR';
                    }
                    $scope.modalTitle = $translate.instant('ERROR_POST_INVERSIO');
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
                    result += '<li>'+$translate.instant('ERROR_REQUIRED_FIELD', {
                        field: arrayResponse.required_fields[i],
                    })+'</li>';
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    result += '<li>'+$translate.instant('ERROR_INVALID_FIELD', {
                        field: arrayResponse.invalid_fields[j].field,
                        reason: arrayResponse.invalid_fields[j].error
                    })+'</li>';
                }
            }
            if (result === '') {return '';} // TODO: Manage case
            return '<ul>'+result+'</ul>';
        };

    });


