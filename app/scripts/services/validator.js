'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('ValidateHandler', ['$timeout', '$log', 'AjaxHandler', 'cfg', function($timeout, $log, AjaxHandler, cfg) {

        var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var postalCodeRE = /^\d+$/;
        var DELAY = 1000; // in milliseconds

        // DNI 1 VALIDATOR
        this.validateDni1 = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                        dniPromise.then(
                            function (response) {
                                $scope.dniIsInvalid = response === cfg.STATE_FALSE;
                                $scope.dniDuplicated = false;
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
                        $scope.emailNoIguals = $scope.form.email2 !== undefined && newValue !== $scope.form.email2;
                        $scope.emailIsInvalid = !emailRE.test(newValue);
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
                        $scope.emailNoIguals = ($scope.form.email1 !== undefined || $scope.form.email1 !== '') && newValue !== $scope.form.email1;
                        $scope.formListener();
                    }
                }, DELAY);
            });
        };

        // POSTAL CODE VALIDATOR
        this.validatePostalCode = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined && (!postalCodeRE.test(newValue) || newValue.length > 5)) {
                    if (element === 'form.postalcode') {
                        $scope.form.postalcode = oldValue;
                    } else if (element === 'form.accountpostalcode') {
                        $scope.form.accountpostalcode = oldValue;
                    }
                }
            });
        };

    }]);
