'use strict';

angular.module('newSomEnergiaWebformsApp')
  .controller('MainCtrl', ['cfg', '$scope', '$http', '$log', function (cfg, $scope, $http, $log) {

        // GET STATES
        $http.get(cfg.API_BASE_URL + 'data/provincies').success(function(response) {
                $log.log('data/provinces response recived', response);
                if (response.status === cfg.STATUS_ONLINE) {
                  if (response.state === cfg.STATE_TRUE) {
                    $scope.provinces = response.data.provincies;
                  } else {
                        // TODO throw get provinces exception
                  }
                } else if (response.status === cfg.STATUS_OFFLINE) {
                    // TODO throw server down exception
                } else {
                    // TODO throw unknow server status exception
                }
              }
        );

        // GET LANGUAGES
        $http.get(cfg.API_BASE_URL + 'data/idiomes').success(function(response) {
                $log.log('data/idiomes response recived', response);
                if (response.status === cfg.STATUS_ONLINE) {
                  if (response.state === cfg.STATE_TRUE) {
                    $scope.languages = response.data.idiomes;
                  } else {
                        // TODO throw get languages exception
                  }
                } else if (response.status === cfg.STATUS_OFFLINE) {
                    // TODO throw server down exception
                } else {
                    // TODO throw unknow server status exception
                }
              }
        );

        // INIT
        $scope.submitted = false;
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.province = {};
        $scope.city = {};

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity = function() {
            // GET CITIES
            $http.get(cfg.API_BASE_URL + 'data/municipis/' + $scope.province.id).success(function(response) {
                    $log.log('data/municipis/' + $scope.province.id + ' response recived', response);
                    if (response.status === cfg.STATUS_ONLINE) {
                      if (response.state === cfg.STATE_TRUE) {
                        $scope.cities = response.data.municipis;
                      } else {
                            // TODO throw get municipi exception
                      }
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        // TODO throw server down exception
                    } else {
                        // TODO throw unknow server status exception
                    }
                  }
            );
          };

        // ON SUBMIT FORM
        $scope.submit = function(form) {
            // Trigger validation flag.
            $scope.submitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
              return null;
            }

            return true;
          };

      }]);
