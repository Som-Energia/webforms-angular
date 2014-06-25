'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('AjaxHandler', function(cfg, uiHandler, $http, $q, $log) {

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
        this.getSateRequest = function($scope, URL, errorCode) {
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
                            uiHandler.showWellDoneDialog();
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

    });
