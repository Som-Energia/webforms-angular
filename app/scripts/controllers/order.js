'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', '$scope', '$http', '$routeParams', '$translate', '$log', function (cfg, $scope, $http, $routeParams, $translate, $log) {

        // INIT
        $scope.initSubmitReady = false;
        $scope.initFormSubmitted = false;
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // ON CHANGE FORMS
        $scope.initFormListener = function (form) {
            $scope.initSubmitReady = form.dni !== undefined && form.socinumber !== undefined;
        };

        // ON SUBMIT FORM
        $scope.initSubmit = function (form) {
            // Trigger validation flag.
            $scope.initFormSubmitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
                return null;
            }

            // Get soci data
            $http.get(cfg.API_BASE_URL + 'data/soci/' + $scope.form.init.socinumber + '/' + $scope.form.init.dni).success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        if (response.state === cfg.STATE_TRUE) {
                            $log.log('POST data/soci response recived', response);
                        } else {
                            $log.error('data/soci error response recived', response);
//                            $scope.messages = $scope.getHumanizedAPIResponse(response.data);
                        }
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        $scope.showErrorDialog('API server status offline (ref.102-001)');
                    } else {
                        $scope.showErrorDialog('API server unknown status (ref.101-001)');
                    }
                }
            );
        };

        // SHOW MODAL DIALOGS
        $scope.showErrorDialog = function (msg) {
            $scope.errorMsg = msg;
            jQuery('#api-server-offline-modal').modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        };

    }]);
