'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('ValidateHandler', function($timeout) {

        var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var postalCodeRE = /^\d+$/;

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
                }, 1000);
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
                }, 1000);
            });
        };

        // POSTAL CODE VALIDATOR
        this.validatePostalCode = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    if (!postalCodeRE.test(newValue) || newValue.length > 5) {
                        $scope.form.postalcode = oldValue;
                    }
                }
            });
        };

    });
