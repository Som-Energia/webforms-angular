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
            if (newValue === undefined) { return; }
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

        $scope.newPartnerSubmitted = function() {
            $scope.setStep(1);
            $scope.soci.nom = $scope.newPartner.name;
            $scope.soci.cognom = $scope.newPartner.surname;

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
                console.log(response.data.consums);
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
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data);
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                    }
                },
                function (reason) {
                    $log.error('Post data failed', reason);
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

    })
.directive('personalData', function () {
    return {
        restrict: 'E',
        scope: {
            form: '=model',
        },
        templateUrl: 'views/personaldata.html',
        controller: 'personalDataCtrl',
        link: function(scope, element, attrs, personalDataCtrl) {
            personalDataCtrl.init(element, attrs);
        },
    };
})
.controller('personalDataCtrl', function(
        cfg,
        AjaxHandler,
        ValidateHandler,
        $scope,
        $log
        ) {
    var self = this;
    self.init = function(/*element, attrs*/) {
        $scope.form = {};

        $scope.form.isReady = function() {
            return (
                $scope.form.language &&
                $scope.form.name !== undefined &&
                ($scope.form.surname !== undefined && $scope.form.usertype === 'person' || $scope.form.usertype === 'company') &&
                ($scope.form.usertype === 'person' || $scope.form.usertype === 'company' && $scope.form.representantdni !== undefined && $scope.form.representantname !== undefined) &&
                $scope.form.dni !== undefined &&
                $scope.form.email1 !== undefined &&
                $scope.form.email2 !== undefined &&
                $scope.form.email1 === $scope.form.email2 &&
                $scope.form.phone1 !== undefined &&
                $scope.form.address !== undefined &&
                $scope.form.postalcode !== undefined &&
                $scope.form.province !== undefined &&
                $scope.form.city !== undefined &&
                $scope.dniRepresentantIsInvalid === false &&
                $scope.emailIsInvalid === false &&
                $scope.emailNoIguals === false &&
                !$scope.postalCodeIsInvalid &&
                true
                );
        };

        $scope.languages = [];
        $scope.language = {};
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.messages = null;
        $scope.province = {};
        $scope.city = {};

        $scope.dniRepresentantIsInvalid = false;
        $scope.dniDuplicated = false;
        $scope.emailIsInvalid = false;
        $scope.emailNoIguals = false;
        $scope.postalCodeIsInvalid = false;

        // GET LANGUAGES
        AjaxHandler.getLanguages($scope);

        // GET STATES
        AjaxHandler.getStates($scope);

        // POSTAL CODE VALIDATION
        var checkPostalCodeTimer = false;
        ValidateHandler.validatePostalCode($scope, 'form.postalcode', checkPostalCodeTimer);

        // TELEPHONE VALIDATION
        ValidateHandler.validateTelephoneNumber($scope, 'form.phone1');
        ValidateHandler.validateTelephoneNumber($scope, 'form.phone2');

        // DNI VALIDATION
        var checkDniTimer = false;
        ValidateHandler.validateDni($scope, 'form.dni', checkDniTimer);
        var checkDniRepresentantTimer = false;
        ValidateHandler.validateDni($scope, 'form.representantdni', checkDniRepresentantTimer);
        // EMAIL VALIDATION
        var checkEmail1Timer = false;
        ValidateHandler.validateEmail1($scope, 'form.email1', checkEmail1Timer);
        var checkEmail2Timer = false;
        ValidateHandler.validateEmail2($scope, 'form.email2', checkEmail2Timer);

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity = function() {
            AjaxHandler.getCities($scope, 1, $scope.form.province.id);
        };

    };
    $scope.formListener = function() {
        $log.debug($scope.form);
    };

})
;


