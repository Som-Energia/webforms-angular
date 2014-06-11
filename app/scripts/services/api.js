'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('AjaxHandler', function(cfg, $http, $q, $log) {
        // Async GET data call
        this.getDataRequest = function($scope, URL, errorCode) {
            var deferred = $q.defer();
            $http.get(URL)
                .success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        if (response.state === cfg.STATE_TRUE) {
                            deferred.resolve(response.data);
                        } else {
                            $log.error('AjaxHandler GET request error response recived', response);
                            $scope.showErrorDialog('GET response state false recived (ref.003-' + errorCode + ')');
                        }
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        $scope.showErrorDialog('API server response status offline recived (ref.002-' + errorCode + ')');
                    } else {
                        $scope.showErrorDialog('API server response unknown status recived (ref.001-' + errorCode + ')');
                    }
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };
        // Async GET state call
        this.getSateRequest = function($scope, URL, errorCode) {
            var deferred = $q.defer();
            $http.get(URL)
                .success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        deferred.resolve(response.state);
                        $scope.formListener($scope.form);
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        $scope.showErrorDialog('API server response status offline recived (ref.002-' + errorCode + ')');
                    } else {
                        $scope.showErrorDialog('API server unknown status (ref.001-' + errorCode + ')');
                    }
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };
    });
