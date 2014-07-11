'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('MainCtrl', ['cfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', 'prepaymentService', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$location', '$log', function (cfg, AjaxHandler, ValidateHandler, uiHandler, prepaymentService, $scope, $http, $routeParams, $translate, $timeout, $location, $log) {

        // INIT
        $scope.step1Ready = true;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.showAgreeCheckbox = false;
        $scope.submitReady = false;
        $scope.dniIsInvalid = false;
        $scope.dniRepresentantIsInvalid = false;
        $scope.dniDuplicated = false;
        $scope.emailIsInvalid = false;
        $scope.emailNoIguals = false;
        $scope.submitted = false;
        $scope.form = {};
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.province = {};
        $scope.city = {};
        $scope.messages = null;
        $scope.form.payment = 'bankaccount';
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // GET LANGUAGES
        AjaxHandler.getLanguages($scope);

        // GET STATES
        AjaxHandler.getStates($scope);

        // POSTAL CODE VALIDATION
        ValidateHandler.validatePostalCode($scope, 'form.postalcode');

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
            AjaxHandler.getCities($scope, 1);
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
                $scope.dniIsInvalid === false &&
                $scope.dniRepresentantIsInvalid === false &&
                $scope.emailIsInvalid === false &&
                $scope.emailNoIguals === false
            ;
            $scope.step3Ready = $scope.showAgreeCheckbox && $scope.form.accept !== undefined && $scope.form.accept !== false;
            $scope.submitReady = $scope.step1Ready && $scope.step2Ready && $scope.step3Ready;
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
                cognom: $scope.form.surname,
                dni: $scope.form.dni,
                representant_nom: $scope.form.usertype === 'company' ? $scope.form.representantname : '',
                representant_dni: $scope.form.usertype === 'company' ? $scope.form.representantdni : '',
                tel: $scope.form.phone1,
                tel2: $scope.form.phone2 === undefined ? '' : $scope.form.phone2,
                email: $scope.form.email1,
                cp: $scope.form.postalcode,
                provincia: $scope.form.province.id,
                adreca: $scope.form.address,
                municipi: $scope.form.city.id,
                idioma: $scope.form.language.code,
                payment_method: $scope.form.payment === 'bankaccount' ? cfg.PAYMENT_METHOD_BANK_ACCOUNT : cfg.PAYMENT_METHOD_CREDIT_CARD
            };
//            $log.log('request postData', postData);
            // Send request data POST
            var postPromise = AjaxHandler.postRequest($scope, cfg.API_BASE_URL + 'form/soci/alta', postData, '004');
            postPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_FALSE) {
                        // error
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data);
                        $scope.submitReady = false;
                    } else if (response.state === cfg.STATE_TRUE) {
                        // well done
//                        $log.log('response recived', response);
                        prepaymentService.setData(response.data);
                        $location.path('/prepagament');
                    }
                },
                function (reason) { $log.error('Post data failed', reason); }
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
                    if (arrayResponse.required_fields[i] === 'provincia') {
                        $scope.partnerForm.province.$setValidity('requiredp', false);
                    } else if (arrayResponse.required_fields[i] === 'municipi') {
                        $scope.partnerForm.city.$setValidity('requiredm', false);
                    }
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                result = result + ' ERROR:';
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    result = result + ' ' + arrayResponse.invalid_fields[j].field + '·' + arrayResponse.invalid_fields[j].error;
                    if (arrayResponse.invalid_fields[j].field === 'dni' && arrayResponse.invalid_fields[j].error === 'exist') {
                        $scope.dniDuplicated = true;
                        $scope.partnerForm.dni.$setValidity('exist', false);
                    }
                }
            }

            return result;
        };

    }]);
