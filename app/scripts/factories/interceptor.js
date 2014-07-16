'use strict';

angular.module('newSomEnergiaWebformsApp')
    .factory('fileInterceptor', ['$q', '$injector', '$log', function($q, $injector, $log) {
        return {
            responseError: function(response) {
                $log.log('fileInterceptor responseError', response);
                if (response.status === 413) {
                    $log.log('413 error recived');
//                    var SessionService = $injector.get('SessionService');
//                    var $http = $injector.get('$http');
//                    var deferred = $q.defer();

                    // Create a new session (recover the session)
                    // We use login method that logs the user in using the current credentials and
                    // returns a promise
//                    SessionService.login().then(deferred.resolve, deferred.reject);

                    // When the session recovered, make the same backend call again and chain the request
//                    return deferred.promise.then(function() {
//                        return $http(response.config);
//                    });
                }

                return $q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('fileInterceptor');
    }]);