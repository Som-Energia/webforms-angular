'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', 'AjaxHandler', 'ValidateHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, AjaxHandler, ValidateHandler,  $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.dniIsInvalid = false;
        $scope.showUnknownSociWarning = false;
        $scope.showStep1Form = false;
        $scope.initSubmitReady = false;
        $scope.initFormSubmitted = false;
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

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

        // ON CHANGE FORMS
        $scope.formListener = function (form) {
            $scope.initSubmitReady = form.dni !== undefined && form.socinumber !== undefined && $scope.dniIsInvalid === false;
        };

        // ON SUBMIT FORM
        $scope.initSubmit = function (form) {
            // Trigger validation flag.
            $scope.initFormSubmitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
                return null;
            }

            // Get soci values
            var sociPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/soci/' + $scope.form.init.socinumber + '/' + $scope.form.init.dni, '001');
            sociPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_TRUE) {
                        $scope.soci = response.data.soci;
                        $scope.showStep1Form = true;
                        $scope.showUnknownSociWarning = false;
                    } else {
                        $scope.showUnknownSociWarning = true;
                    }
                },
                function (reason) { $log.error('Failed', reason); }
            );

            return true;
        };



    }]);
