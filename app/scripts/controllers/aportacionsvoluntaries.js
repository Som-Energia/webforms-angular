'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('AportacioVoluntariaCtrl', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

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
        $scope.aportacioMinima = 100;
        $scope.aportacioMaxima = 25000;
        $scope.aportacioSalts = 100;
        $scope.amountAboveMax = false;
        $scope.amountUnderMin = false;
        $scope.amountNotHundred = false;

        $scope.form = {};
        $scope.form.amount = $scope.aportacioMinima;
        $scope.form.acceptaccountowner = false;
        $scope.form.acceptcontract = false;
        $scope.isPartner = true;
        $scope.newPartner = {};

        $scope.investedAmount = function() {
            return parseInt($scope.form.amount||0);
        }

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

        $scope.isInvestmentFormReady = function() {
            if ($scope.ibanEditor === undefined) {return false;}
            if (!$scope.ibanEditor.isValid()) {return false;}
            if ($scope.amountUnderMin) {return false;}
            if ($scope.amountAboveMax) {return false;}
            if ($scope.amountNotHundred) {return false;}
            if ($scope.form.acceptaccountowner === false) {return false;}
            if ($scope.form.acceptcontract === false) {return false;}
            return true;
        };

        $scope.submiting = false;

        $scope.initFormSubmited = function() {
            $scope.setStep(1);
        };

        $scope.isNewPartnerReady = function() {
            if ($scope.newPartner === undefined) { return false; }
            if ($scope.newPartner.isReady === undefined) { return false; }
            return $scope.newPartner.isReady() && $scope.form.acceptprivacypolicy;
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
                        $scope.modalTitle = $translate.instant('ERROR_POST_INVERSIO');
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data.data);
                        $scope.rawReason = JSON.stringify(response,null,'  ');
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                        return;
                    }

                    uiHandler.showWellDoneDialog();
                    $window.top.location.href = $translate.instant('INVEST_OK_REDIRECT_URL');
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

angular.module('newSomEnergiaWebformsApp')
.directive('ibanEditor', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            help: '@',
            inputid: '@',
            placeholder: '@?',
            required: '@?',
        },
        templateUrl: 'views/ibaneditor.html',
        controller: 'ibanEditorCtrl',
        link: function(scope, element, attrs, ibanEditorCtrl) {
            ibanEditorCtrl.init(element, attrs);
        },
    };
})
.controller('ibanEditorCtrl', function (
        cfg,
        $scope,
        $timeout,
        $log,
        AjaxHandler
        ) {
    var self = this;
    self.init = function(/*element, attrs*/) {

        $scope._isValid = $scope.required === undefined;
        $scope._lastPromise = undefined;
        $scope.model = {};
        $scope.model.value = undefined;
        $scope.model.serverError = undefined;

        $scope.model.inServerError = function() {
            return $scope.model.serverError !== undefined;
        };
        $scope.model.isRequiredMissing = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.required === undefined) { return false; }
            return $scope.model.value === undefined || $scope.model.value === '';
        };
        $scope.model.isValidating = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.model.isRequiredMissing()) { return false; }
            return $scope._isValid === undefined;
        };
        $scope.model.isValid = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.model.isRequiredMissing()) { return false; }
            return $scope._isValid === true;
        };
        $scope.model.isInvalid = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.model.isRequiredMissing()) { return false; }
            return $scope._isValid === false;
        };

        // Backward with order.js  
        $scope.formListener = function() {
        };
        $scope.onChange = function () {
            $scope.model.serverError = undefined;
            // Unify value for some browsers when not required
            if ($scope.model.value === '') {
                $scope.model.value = undefined;
            }
            if ($scope.model.value === undefined) {
                $scope._isValid = ($scope.required === undefined);
                return;
            }
            $scope._isValid = undefined; // checking
            if ($scope._lastPromise !== undefined) {
                $scope._lastPromise.abort();
            }
            var promise = AjaxHandler.getStateRequest(
                $scope, cfg.API_BASE_URL +
                'check/iban/' + $scope.model.value,
                '017');
            $scope._lastPromise = promise;
            promise.value = $scope.model.value;
            promise.then(
                function (response) {
                    if (promise.value !== $scope.model.value) {
                        // Changed while waiting a response, ignore
                        return;
                    }
                    $scope._isValid = response !== cfg.STATE_FALSE;
                },
                function(reason) {
                    // TODO: Translate 'Unknown'
                    $log.log('Server error:', reason);
                    $scope.model.serverError = reason || 'Unknown';
                }
            );
        };
    };
});

