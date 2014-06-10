'use strict';

angular.module('newSomEnergiaWebformsApp', [])
    .service('ajaxHandler', function($scope, $http, $log, cfg) {
        this.getRequest = function(URL, errorCode) {
            $http.get(URL).success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        if (response.state === cfg.STATE_TRUE) {
                            return response.data;
                        } else {
                            $log.error('data/idiomes error response recived', response);
                            $scope.showErrorDialog('GET idiomes return false state (ref.003-' + errorCode + ')');
                        }
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        $scope.showErrorDialog('API server status offline (ref.002-' + errorCode + ')');
                    } else {
                        $scope.showErrorDialog('API server unknown status (ref.001-' + errorCode + ')');
                    }

                    return false;
                }
            );
        };
    });
