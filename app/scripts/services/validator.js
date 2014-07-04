'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('ValidateHandler', ['$timeout', '$log', 'AjaxHandler', 'cfg', function($timeout, $log, AjaxHandler, cfg) {

        var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var integerRE = /^\d+$/;
        var DELAY = 1000; // in milliseconds

        // INTEGER VALIDATOR
        this.validateInteger = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    if (!integerRE.test(newValue)) {
                        $scope.form.init.socinumber = oldValue;
                    }
                }
            });
        };

        // POWER VALIDATOR
        this.validatePower = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    var re = /^\d*([.,'])?\d*/g;
                    var match = re.exec(newValue);
                    var result = match[0].replace(',', '.');
                    result = result.replace('\'', '.');
                    if (result > 250) {
                        $scope.form.power = oldValue;
                    } else {
                        $scope.form.power = result;
                    }
                }
            });
        };
        
        // DNI VALIDATOR
        this.validateDni = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        var dniPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                        dniPromise.then(
                            function (response) {
                                if (element === 'form.dni' || element === 'form.init.dni') {
                                    $scope.dniIsInvalid  = response === cfg.STATE_FALSE;
                                    $scope.dni2IsInvalid = response === cfg.STATE_FALSE;
                                    $scope.dniDuplicated = false;
                                } else if (element === 'form.representantdni') {
                                    $scope.dniRepresentantIsInvalid = response === cfg.STATE_FALSE;
                                    $scope.dni3IsInvalid = response === cfg.STATE_FALSE;
                                } else if (element === 'form.accountdni') {
                                    $scope.dni4IsInvalid = response === cfg.STATE_FALSE;
                                }
                                $scope.formListener();
                            },
                            function (reason) { $log.error('Check DNI failed', reason); }
                        );
                    }
                }, DELAY);
            });
        };
        
        // EMAIL 1 VALIDATOR
        this.validateEmail1 = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        if (element === 'form.email1') {
                            $scope.emailNoIguals = $scope.form.email2 !== undefined && newValue !== $scope.form.email2;
                            $scope.emailIsInvalid = !emailRE.test(newValue);
                        } else if (element === 'form.accountemail1') {
                            $scope.accountEmailNoIguals = $scope.form.accountemail2 !== undefined && newValue !== $scope.form.accountemail2;
                            $scope.accountEmailIsInvalid = !emailRE.test(newValue);
                        }
                        $scope.formListener();
                    }
                }, DELAY);
            });
        };

        // EMAIL 2 VALIDATOR
        this.validateEmail2 = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        if (element === 'form.email2') {
                            $scope.emailNoIguals = ($scope.form.email1 !== undefined || $scope.form.email1 !== '') && newValue !== $scope.form.email1;
                        } else if (element === 'form.accountemail2') {
                            $scope.accountEmailNoIguals = ($scope.form.accountemail1 !== undefined || $scope.form.accountemail1 !== '') && newValue !== $scope.form.accountemail1;
                        }
                        $scope.formListener();
                    }
                }, DELAY);
            });
        };

        // POSTAL CODE VALIDATOR
        this.validatePostalCode = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined && (!integerRE.test(newValue) || newValue.length > 5)) {
                    if (element === 'form.postalcode') {
                        $scope.form.postalcode = oldValue;
                    } else if (element === 'form.accountpostalcode') {
                        $scope.form.accountpostalcode = oldValue;
                    }
                }
            });
        };

    }]);
