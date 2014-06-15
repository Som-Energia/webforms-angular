'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('MainCtrl', ['cfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', 'prepaymentService', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, AjaxHandler, ValidateHandler, uiHandler, prepaymentService, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.currentStep = 1;
        $scope.step1Ready = true;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.submitReady = false;
        $scope.dniIsInvalid = false;
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
        $scope.form.usertype = 'person';
        $scope.form.payment = 'bankaccount';
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // GET LANGUAGES
        var languagesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/idiomes', '002');
        languagesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    $scope.languages = response.data.idiomes;
                } else {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-002)');
                }
            },
            function (reason) { $log.error('Failed', reason); }
        );

        // GET STATES
        var statesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/provincies', '001');
        statesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    $scope.provinces = response.data.provincies;
                } else {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-001)');
                }
            },
            function (reason) { $log.error('Failed', reason); }
        );

        // DNI VALIDATION
        var checkDniTimer = false;
        $scope.$watch('form.dni', function(newValue) {
            if (checkDniTimer) {
                $timeout.cancel(checkDniTimer);
            }
            checkDniTimer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                    dniPromise.then(
                        function (response) {
                            $scope.dniIsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener();
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // EMAIL VALIDATIONS
        var checkEmail1Timer = false;
        $scope.$watch('form.email1', function(newValue) {
            if (checkEmail1Timer) {
                $timeout.cancel(checkEmail1Timer);
            }
            checkEmail1Timer = $timeout(function() {
                if (newValue !== undefined) {
                    $scope.emailNoIguals = newValue !== $scope.form.email2;
                    $scope.emailIsInvalid = !ValidateHandler.isEmailValid(newValue);
                    $scope.formListener();
                }
            }, 400);
        });
        var checkEmail2Timer = false;
        $scope.$watch('form.email2', function(newValue) {
            if (checkEmail2Timer) {
                $timeout.cancel(checkEmail2Timer);
            }
            checkEmail2Timer = $timeout(function() {
                if (newValue !== undefined) {
                    $scope.emailNoIguals = newValue !== $scope.form.email1;
                    $scope.formListener();
                }
            }, 400);
        });

        // ON CHANGE SELECTED PROVINCE
        $scope.updateSelectedCity = function () {
            if ($scope.form.province !== undefined) {
                // GET CITIES
                var citiesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  $scope.form.province.id, '003');
                citiesPromise.then(
                    function (response) {
                        if (response.state === cfg.STATE_TRUE) {
                            $scope.cities = response.data.municipis;
                        } else {
                            uiHandler.showErrorDialog('GET response state false recived (ref.003-003)');
                        }
                    },
                    function (reason) { $log.error('Failed', reason); }
                );
                $scope.formListener();
            }
        };

        // ON SUBMIT FORM
        $scope.submit = function (form) {
            // Trigger validation flags
            $scope.submitted = true;
            $scope.messages = null;
            if (form.$invalid) {
                return null;
            }
            // Prepare request data
            var postData = {
                tipuspersona: $scope.form.usertype === 'person' ? cfg.USER_TYPE_PERSON : cfg.USER_TYPE_COMPANY,
                nom: $scope.form.name,
                cognom: $scope.form.surname,
                dni: $scope.form.dni,
                tel: $scope.form.phone1,
                tel2: $scope.form.phone2 === undefined ? '' : $scope.form.phone2,
                email: $scope.form.email1,
                cp: $scope.form.postalcode,
                provincia: $scope.form.province.id,
                adreca: $scope.form.address,
                municipi: $scope.form.city.id,
                idioma: $scope.form.language.code,
                payment_method: $scope.form.payment === 'bankaccount' ? cfg.PAYMENT_METHOD_BANK_ACCOUNT : cfg.PAYMENT_METHOD_CREDIT_CARD
            };      // $log.log(postData);
            // Send POST request data
            var postPromise = AjaxHandler.postRequest($scope, cfg.API_BASE_URL + 'form/soci/alta', postData, '004');
            postPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_FALSE) {
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data);
                        $scope.submitReady = false;
                    } else if (response.state === cfg.STATE_TRUE) {
                        prepaymentService.setData(response.data);
                        $window.open('#/prepagament');
                    }
                },
                function (reason) { $log.error('Failed', reason); }
            );

            return true;
        };

        // CONTROL READY STEPS ON CHANGE FORM
        $scope.formListener = function () {
            $scope.step2Ready = $scope.form.language !== undefined;
            $scope.step3Ready = $scope.step2Ready &&
                $scope.form.name !== undefined &&
                ($scope.form.surname !== undefined && $scope.form.usertype === 'person' || $scope.form.usertype === 'company') &&
                $scope.form.dni !== undefined &&
                $scope.form.email1 !== undefined &&
                $scope.form.email2 !== undefined &&
                $scope.form.email1 === $scope.form.email2 &&
                $scope.form.phone1 !== undefined &&
                $scope.form.address !== undefined &&
                $scope.form.postalcode !== undefined &&
                $scope.form.province !== undefined &&
                $scope.form.city !== undefined &&
                $scope.form.accept !== undefined &&
                $scope.form.accept !== false &&
                $scope.dniIsInvalid === false &&
                $scope.emailIsInvalid === false &&
                $scope.emailNoIguals === false
            ;
            $scope.submitReady = $scope.step1Ready && $scope.step2Ready && $scope.step3Ready;
        };

        // GET HUMANIZED API RESPONSE
        $scope.getHumanizedAPIResponse = function (arrayResponse) {
            var result = '';
            if (arrayResponse.required_fields !== undefined) {
                result = result + 'ERROR:'; // TODO $translate it
                for (var i = 0; i < arrayResponse.required_fields.length; i++) {
                    result = result + ' ' + arrayResponse.required_fields[i];
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                result = result + ' ERROR:'; // TODO $translate it
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    result = result + ' ' + arrayResponse.invalid_fields[j].field + '·' + arrayResponse.invalid_fields[j].error;
                    if (arrayResponse.invalid_fields[j].field === 'dni' && arrayResponse.invalid_fields[j].error === 'exist') {
                        $scope.dniDuplicated = true;
                    }
                }
            }

            return result;
        };

    }]);
