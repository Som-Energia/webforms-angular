'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.step0Ready = true;
        $scope.step1Ready = false;
        $scope.step2Ready = false;
        $scope.step3Ready = true;
        $scope.dniIsInvalid = false;
        $scope.cupsIsInvalid = false;
        $scope.cnaeIsInvalid = false;
        $scope.accountIsInvalid = false;
        $scope.showUnknownSociWarning = false;
        $scope.showBeginOrderForm = false;
        $scope.showStep1Form = false;
        $scope.initSubmitReady = false;
        $scope.initFormSubmitted = false;
        $scope.isStep2ButtonReady = false;
        $scope.isStep3ButtonReady = false;
        $scope.isFinalStepButtonReady = false;
        $scope.orderFormSubmitted = false;
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.form = {};
        $scope.form.choosepayer = 'titular';
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
                    $scope.provinces2 = response.data.provincies;
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
                            $scope.formListener();
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });
        var checkDni2Timer = false;
        $scope.$watch('form.dni', function(newValue) {
            if (checkDni2Timer) {
                $timeout.cancel(checkDni2Timer);
            }
            checkDni2Timer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                    dniPromise.then(
                        function (response) {
                            $scope.dni2IsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener();
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });
        var checkDni3Timer = false;
        $scope.$watch('form.representantdni', function(newValue) {
            if (checkDni3Timer) {
                $timeout.cancel(checkDni3Timer);
            }
            checkDni3Timer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '006');
                    dniPromise.then(
                        function (response) {
                            $scope.dni3IsInvalid = response === cfg.STATE_FALSE;
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
                    $scope.emailNoIguals = $scope.form.email2 !== undefined && newValue !== $scope.form.email2;
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
                    $scope.emailNoIguals = ($scope.form.email1 !== undefined || $scope.form.email1 !== '') && newValue !== $scope.form.email1;
                    $scope.formListener();
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
                        function(reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // ON CHANGE FORMS
        $scope.formListener = function() {
            $scope.initSubmitReady = $scope.form.init.dni !== undefined && $scope.form.init.socinumber !== undefined && $scope.dniIsInvalid === false;
            $scope.isStep2ButtonReady = $scope.initSubmitReady &&
                $scope.form.address !== undefined &&
                $scope.form.province !== undefined &&
                $scope.form.city !== undefined &&
                $scope.form.cups !== undefined &&
                $scope.form.cnae !== undefined &&
                $scope.cupsIsInvalid === false &&
                $scope.cnaeIsInvalid === false &&
                $scope.form.power !== undefined &&
                $scope.form.rate !== undefined;
            $scope.isStep3ButtonReady = $scope.isStep2ButtonReady &&
                ($scope.form.isownerlink === 'yes' ||
                    ($scope.form.isownerlink === 'no' &&
                        $scope.form.language !== undefined &&
                        $scope.form.name !== undefined &&
                        ($scope.form.surname !== undefined && $scope.form.usertype === 'person' || $scope.form.usertype === 'company') &&
                        $scope.form.dni !== undefined &&
                        $scope.form.email1 !== undefined &&
                        $scope.form.email2 !== undefined &&
                        $scope.form.email1 === $scope.form.email2 &&
                        $scope.form.phone1 !== undefined &&
                        $scope.form.address2 !== undefined &&
                        $scope.form.postalcode !== undefined &&
                        $scope.form.province2 !== undefined &&
                        $scope.form.city2 !== undefined &&
                        $scope.form.accept !== undefined &&
                        $scope.form.accept !== false &&
                        $scope.dni2IsInvalid === false &&
                        $scope.emailIsInvalid === false &&
                        $scope.emailNoIguals === false
                        )
                    );
//            $log.log($scope.form.changeowner, $scope.form.usertype, $scope.form.isownerlink);
        };
        $scope.formAccountListener = function () {
            if ($scope.form.accountbank !== undefined && $scope.form.accountoffice !== undefined && $scope.form.accountchecksum !== undefined && $scope.form.accountnumber !== undefined) {
                var accountPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/bank/' + $scope.form.accountbank + $scope.form.accountoffice + $scope.form.accountchecksum + $scope.form.accountnumber, '017');
                accountPromise.then(
                    function (response) {
                        $scope.accountIsInvalid = response === cfg.STATE_FALSE;
                        $scope.formListener($scope.form);
                    },
                    function(reason) { $log.error('Failed', reason); }
                );
            }
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
        $scope.updateSelectedCity = function() {
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
        $scope.updateSelectedCity2 = function() {
            if ($scope.form.province2 !== undefined) {
                // GET CITIES
                var citiesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  $scope.form.province2.id, '004');
                citiesPromise.then(
                    function (response) {
                        if (response.state === cfg.STATE_TRUE) {
                            $scope.cities2 = response.data.municipis;
                        } else {
                            uiHandler.showErrorDialog('GET response state false recived (ref.003-004)');
                        }
                    },
                    function(reason) { $log.error('Failed', reason); }
                );
                $scope.formListener();
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
//                        $scope.showStep1Form = false; // uncomment on production
                    } else {
                        $scope.showUnknownSociWarning = true;
                        $scope.showStep1Form = false;
                    }
                },
                function (reason) { $log.error('Failed', reason); }
            );
        };

        // DEBUG (comment on production)
        $scope.form.init.socinumber = 1706;
        $scope.form.init.dni = '52608510N';
        $scope.form.address = 'Avda. Sebastià Joan Arbó, 6';
        $scope.form.cups = 'ES0031406222973003LE0F';
        $scope.form.cnae = '0520';
        $scope.form.power = '5.5';
        $scope.form.rate = '2.0A';
        $scope.executeGetSociValues();
        $scope.showStep1Form = true;
        $scope.step0Ready = false;
        $scope.step1Ready = true;
        $scope.step2Ready = false;
    }]);
