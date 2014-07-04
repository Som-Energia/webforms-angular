'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('AjaxHandler', ['cfg', 'uiHandler', '$http', '$q', '$log', function(cfg, uiHandler, $http, $q, $log) {

        // Get languages
        this.getLanguages = function($scope) {
            var languagesPromise = this.getDataRequest($scope, cfg.API_BASE_URL + 'data/idiomes', '002');
            languagesPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_TRUE) {
                        $scope.languages = response.data.idiomes;
                    } else {
                        uiHandler.showErrorDialog('GET response state false recived (ref.003-002)');
                    }
                },
                function (reason) { $log.error('Get languages failed', reason); }
            );
        };

        // Get states
        this.getStates = function($scope) {
            var statesPromise = this.getDataRequest($scope, cfg.API_BASE_URL + 'data/provincies', '001');
            statesPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_TRUE) {
                        $scope.provinces  = response.data.provincies;
                        $scope.provinces2 = response.data.provincies;
                        $scope.provinces3 = response.data.provincies;
                    } else {
                        uiHandler.showErrorDialog('GET response state false recived (ref.003-001)');
                    }
                },
                function (reason) { $log.error('Get states failed', reason); }
            );
        };

        // Get cities
        this.getCities = function($scope) {
            if ($scope.form.province !== undefined) {
                var citiesPromise = this.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  $scope.form.province.id, '003');
                citiesPromise.then(
                    function (response) {
                        if (response.state === cfg.STATE_TRUE) {
                            $scope.cities = response.data.municipis;
                        } else {
                            uiHandler.showErrorDialog('GET response state false recived (ref.003-003)');
                        }
                    },
                    function (reason) { $log.error('Update city select failed', reason); }
                );
                $scope.formListener();
            }
        };

        // Async GET data call
        this.getDataRequest = function($scope, URL, errorCode) {
            var deferred = $q.defer();
            $http.get(URL)
                .success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        if (response.state !== cfg.STATE_TRUE) {
                            $log.error('AjaxHandler GET request ' + URL + ' error response recived', response);
                        }
                        deferred.resolve(response);
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        uiHandler.showErrorDialog('API server response status offline recived (ref.002-' + errorCode + ')');
                    } else {
                        uiHandler.showErrorDialog('API server response unknown status recived (ref.001-' + errorCode + ')');
                    }
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        // Async GET state call
        this.getStateRequest = function($scope, URL, errorCode) {
            var deferred = $q.defer();
            $http.get(URL)
                .success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        deferred.resolve(response.state);
                        $scope.formListener($scope.form);
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        uiHandler.showErrorDialog('API server response status offline recived (ref.002-' + errorCode + ')');
                    } else {
                        uiHandler.showErrorDialog('API server unknown status (ref.001-' + errorCode + ')');
                    }
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        // Async POST call
        this.postRequest = function($scope, URL, postData, errorMsg) {
            var deferred = $q.defer();
            $http.post(URL, postData)
                .success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        if (response.state === cfg.STATE_TRUE) {
                            $log.log('AjaxHandler POST request ' + URL + ' response recived', response);
                            //uiHandler.showWellDoneDialog();
                        } else {
                            $log.error('AjaxHandler POST request ' + URL + ' error response recived', response);
                        }
                        deferred.resolve(response);
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        uiHandler.showErrorDialog('API server status offline (ref.002-' + errorMsg + ')');
                    } else {
                        uiHandler.showErrorDialog('API server unknown status (ref.001-' + errorMsg + ')');
                    }
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

    }]);
