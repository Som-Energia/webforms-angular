'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('MainCtrl', function (cfg, debugCfg, AjaxHandler, ValidateHandler, uiHandler, prepaymentService, $scope, $http, $routeParams, $translate, $timeout, $location, $log) {

        // DEBUG MODE
        var debugEnabled = false;

        // INIT
        $scope.step1Ready = true;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.showAgreeCheckbox = false;
        $scope.submitReady = false;
        $scope.dniRepresentantIsInvalid = false;
        $scope.dniDuplicated = false;
        $scope.emailIsInvalid = false;
        $scope.emailNoIguals = false;
        $scope.postalCodeIsInvalid = false;
        $scope.submitted = false;
        $scope.form = {};
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.province = {};
        $scope.city = {};
        $scope.messages = null;
        $scope.accountIsInvalid = false;
        $scope.ibanValidated = false;
        $scope.form.payment = 'creditcard';
        $scope.form.accountbankiban1 = 'ES';
        $scope.completeAccountNumber = '';
        $translate.fallbackLanguage('es');
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }
        var absUrl = $location.absUrl();
        if (absUrl.indexOf('/ca/') !== -1) {
            $translate.use('ca');
        } else if (absUrl.indexOf('/eu/') !== -1) {
            $translate.use('eu');
        } else if (absUrl.indexOf('/gl/') !== -1) {
            $translate.use('gl');
        }

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

        // IBAN VALIDATION
        ValidateHandler.validateIban($scope, 'form.accountbankiban1');
        ValidateHandler.validateIban($scope, 'form.accountbankiban2');
        ValidateHandler.validateIban($scope, 'form.accountbankiban3');
        ValidateHandler.validateIban($scope, 'form.accountbankiban4');
        ValidateHandler.validateIban($scope, 'form.accountbankiban5');
        ValidateHandler.validateIban($scope, 'form.accountbankiban6');

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity = function() {
            AjaxHandler.getCities($scope, 1, $scope.form.province.id);
        };

        // CONTROL READY STEPS ON CHANGE FORM
        $scope.formListener = function () {
            $scope.step2Ready = $scope.form.language !== undefined;
            $scope.showAgreeCheckbox = $scope.step2Ready &&
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
                !$scope.postalCodeIsInvalid
            ;
            $scope.step3Ready = $scope.showAgreeCheckbox && $scope.form.accept !== undefined && $scope.form.accept !== false;
            $scope.submitReady = $scope.step1Ready && $scope.step2Ready && $scope.step3Ready && ($scope.form.payment === 'creditcard' || $scope.form.payment === 'bankaccount' && $scope.ibanValidated && !$scope.accountIsInvalid);
        };

        // CONTROL IBAN FIELDS
        $scope.formAccountIbanListener = function () {
            if (
                $scope.form.accountbankiban1 !== undefined &&
                $scope.form.accountbankiban2 !== undefined &&
                $scope.form.accountbankiban3 !== undefined &&
                $scope.form.accountbankiban4 !== undefined &&
                $scope.form.accountbankiban5 !== undefined &&
                $scope.form.accountbankiban6 !== undefined) {
                $scope.completeAccountNumber = $scope.form.accountbankiban1 + $scope.form.accountbankiban2 + $scope.form.accountbankiban3 + $scope.form.accountbankiban4 + $scope.form.accountbankiban5 + $scope.form.accountbankiban6;
                $scope.ibanValidated = false;
                var accountPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/iban/' + $scope.completeAccountNumber, '017');
                accountPromise.then(
                    function (response) {
                        $scope.accountIsInvalid = response.state === cfg.STATE_FALSE;
                        $scope.ibanValidated = true;
                        $scope.partnerForm.accountbankiban1.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.partnerForm.accountbankiban2.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.partnerForm.accountbankiban3.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.partnerForm.accountbankiban4.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.partnerForm.accountbankiban5.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.partnerForm.accountbankiban6.$setValidity('invalid', !$scope.accountIsInvalid);
                        $scope.formListener($scope.form);
                    },
                    function(reason) { $log.error('Check IBAN failed', reason); }
                );
            }
        };

        // ON SUBMIT FORM
        $scope.submit = function() {
            $scope.submitted = true;
            $scope.messages = null;
            $scope.partnerForm.province.$setValidity('requiredp', true);
            $scope.partnerForm.city.$setValidity('requiredm', true);
            $scope.partnerForm.dni.$setValidity('exist', true);
            // Prepare request data
            var postData = {
                tipuspersona: $scope.form.usertype === 'person' ? cfg.USER_TYPE_PERSON : cfg.USER_TYPE_COMPANY,
                nom: $scope.form.name,
                dni: $scope.form.dni,
                tel: $scope.form.phone1,
                tel2: $scope.form.phone2 || '',
                email: $scope.form.email1,
                cp: $scope.form.postalcode,
                provincia: $scope.form.province.id,
                adreca: $scope.form.address,
                municipi: $scope.form.city.id,
                idioma: $scope.form.language.code,
                payment_method: $scope.form.payment === 'bankaccount' ? cfg.PAYMENT_METHOD_BANK_ACCOUNT : cfg.PAYMENT_METHOD_CREDIT_CARD,
                payment_iban: $scope.completeAccountNumber
            };
            if ($scope.form.usertype === 'person') {
                postData.cognom = $scope.form.surname;
            } else if ($scope.form.usertype === 'company') {
                postData.representant_nom = $scope.form.representantname;
                postData.representant_dni = $scope.form.representantdni;
            }
            $log.log('request postData', postData);
            // Send request data POST
            var postPromise = AjaxHandler.postRequest($scope, cfg.API_BASE_URL + 'form/soci/alta', postData, '004');
            postPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_FALSE) {
                        // error
                        $scope.modalTitle = $translate.instant('ERROR_POST_NOVASOCIA');
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data);
                        $scope.submitReady = false;
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                    } else if (response.state === cfg.STATE_TRUE) {
                        // well done
                        $log.log('response received', response);
                        prepaymentService.setData(response.data);
                        $location.path('/prepagament');
                    }
                },
                function (reason) {
                    $log.error('Post data failed', reason);
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
                    if (arrayResponse.required_fields[i] === 'provincia') {
                        $scope.partnerForm.province.$setValidity('requiredp', false);
                    } else if (arrayResponse.required_fields[i] === 'municipi') {
                        $scope.partnerForm.city.$setValidity('requiredm', false);
                    }
                    result += '<li>'+$translate.instant('ERROR_REQUIRED_FIELD', {
                        field: arrayResponse.required_fields[i],
                    })+'</li>';
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    if (arrayResponse.invalid_fields[j].field === 'dni' && arrayResponse.invalid_fields[j].error === 'exist') {
                        $scope.dniDuplicated = true;
                        $scope.partnerForm.dni.$setValidity('exist', false);
                    }
                    result += '<li>'+$translate.instant('ERROR_INVALID_FIELD', {
                        field: arrayResponse.invalid_fields[j].field,
                        reason: arrayResponse.invalid_fields[j].error
                    })+'</li>';
                }
            }
            if (result === '') {return '';} // TODO: Manage case
            return '<ul>'+result+'</ul>';
        };

        // DEBUG (only apply on development environment)
        if (debugEnabled) {
            $scope.step2Ready = true;
            $scope.step3Ready = true;
            $scope.form.usertype = 'person';
            $scope.form.language = 1;
            $scope.form.name = debugCfg.NAME;
            $scope.form.surname = debugCfg.SURNAME;
            $scope.form.dni = debugCfg.DNI;
            $scope.form.email1 = debugCfg.EMAIL;
            $scope.form.email2 = debugCfg.EMAIL;
            $scope.form.phone1 = debugCfg.PHONE;
            $scope.form.address = debugCfg.ADDRESS;
            $scope.form.postalcode = debugCfg.POSTALCODE;
            $scope.form.accept = true;
            $scope.form.accountbankiban1 = debugCfg.IBAN1;
            $scope.form.accountbankiban2 = debugCfg.IBAN2;
            $scope.form.accountbankiban3 = debugCfg.IBAN3;
            $scope.form.accountbankiban4 = debugCfg.IBAN4;
            $scope.form.accountbankiban5 = debugCfg.IBAN5;
            $scope.form.accountbankiban6 = debugCfg.IBAN6;
        }

    });
