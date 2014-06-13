'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.step0Ready = true;
        $scope.step1Ready = false;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.dniIsInvalid = false;
        $scope.cupsIsInvalid = false;
        $scope.cnaeIsInvalid = false;
        $scope.showUnknownSociWarning = false;
        $scope.showBeginOrderForm = false;
        $scope.showStep1Form = false;
        $scope.initSubmitReady = false;
        $scope.initFormSubmitted = false;
        $scope.isStep2ButtonReady = false;
        $scope.orderFormSubmitted = false;
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.form = {};
        $scope.form.init = {};
        $scope.rates = ['2.0A', '2.0DHA', '2.1A', '2.1DHA', '3.0A'];
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
        $scope.$watch('form.init.dni', function(newValue) {
            if (checkDniTimer) {
                $timeout.cancel(checkDniTimer);
            }
            checkDniTimer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                    dniPromise.then(
                        function (response) {
                            $scope.dniIsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener($scope.form.init);
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // CUPS VALIDATION
        var checkCupsTimer = false;
        $scope.$watch('form.cups', function(newValue) {
            if (checkCupsTimer) {
                $timeout.cancel(checkCupsTimer);
            }
            checkCupsTimer = $timeout(function() {
                if (newValue !== undefined) {
                    var cupsPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/cups/' + newValue, '006');
                    cupsPromise.then(
                        function (response) {
                            $scope.cupsIsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener($scope.form);
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // CNAE VALIDATION
        var cnaeCupsTimer = false;
        $scope.$watch('form.cnae', function(newValue) {
            if (cnaeCupsTimer) {
                $timeout.cancel(cnaeCupsTimer);
            }
            cnaeCupsTimer = $timeout(function() {
                if (newValue !== undefined) {
                    var cnaePromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/cnae/' + newValue, '007');
                    cnaePromise.then(
                        function (response) {
                            $scope.cnaeIsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener($scope.form);
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // ON CHANGE FORMS
        $scope.formListener = function () {
            $scope.initSubmitReady = $scope.form.init.dni !== undefined && $scope.form.init.socinumber !== undefined && $scope.dniIsInvalid === false;
            $scope.isStep2ButtonReady = $scope.initSubmitReady &&
                $scope.form.address !== undefined &&
                $scope.form.province !== undefined &&
                $scope.form.city !== undefined &&
                $scope.form.cups !== undefined &&
                $scope.form.cnae !== undefined &&
                $scope.form.power !== undefined &&
                $scope.form.rate !== undefined;
        };

        // ON INIT SUBMIT FORM
        $scope.initSubmit = function (form) {
            // Trigger validation flags
            $scope.initFormSubmitted = true;
            if (form.$invalid) {
                return null;
            }
            // GET SOCI VALUES
            $scope.executeGetSociValues();

            return true;
        };

        // MOVE TO STEP 1 FORM
        $scope.initOrderForm = function() {
            $scope.showStep1Form = true;
            $scope.step0Ready = false;
            $scope.step1Ready = true;
        };

        // MOVE TO STEP 2 FORM
        $scope.moveToStep2Form = function() {
            $scope.step1Ready = false;
            $scope.step2Ready = true;
        };

        // ON CHANGE SELECTED PROVINCE
        $scope.updateSelectedCity = function (form) {
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
                $scope.formListener(form);
            }
        };

        $scope.executeGetSociValues = function () {
            var sociPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/soci/' + $scope.form.init.socinumber + '/' + $scope.form.init.dni, '001');
            sociPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_TRUE) {
                        $scope.soci = response.data.soci;
                        $scope.showBeginOrderForm = true;
                        $scope.showUnknownSociWarning = false;
                        $scope.showStep1Form = false; // uncomment on debug
                    } else {
                        $scope.showUnknownSociWarning = true;
                        $scope.showStep1Form = false;
                    }
                },
                function (reason) { $log.error('Failed', reason); }
            );
        };

        // DEBUG
//        $scope.form.init.socinumber = 1706;
//        $scope.form.init.dni = '52608510N';
//        $scope.form.address = 'Avda. Sebastià Joan Arbó, 6';
//        $scope.form.cups = 'ES0031406222973003LE0F';
//        $scope.form.cnae = '0520';
//        $scope.form.power = '5.5';
//        $scope.form.rate = '2.0A';
//        $scope.executeGetSociValues();
//        $scope.showStep1Form = true;
//        $scope.step0Ready = false;
//        $scope.step1Ready = true;
//        $scope.step2Ready = false;
    }]);
