'use strict';

angular.module('newSomEnergiaWebformsApp')
  .controller('MainCtrl', ['cfg', '$scope', '$http', '$log', function (cfg, $scope, $http, $log) {

        // GET STATES
        $http.get(cfg.API_BASE_URL + 'data/provincies').success(function(response) {
                if (response.status === cfg.STATUS_ONLINE) {
                  if (response.state === cfg.STATE_TRUE) {
                    $scope.provinces = response.data.provincies;
                  } else {
                    $log.error('data/provinces error response recived', response);
                    $scope.showErrorDialog('GET provincies return false state');
                  }
                } else if (response.status === cfg.STATUS_OFFLINE) {
                  $scope.showErrorDialog('API server status offline');
                } else {
                  $scope.showErrorDialog('API server unknown status');
                }
              }
        );

        // GET LANGUAGES
        $http.get(cfg.API_BASE_URL + 'data/idiomes').success(function(response) {
                if (response.status === cfg.STATUS_ONLINE) {
                  if (response.state === cfg.STATE_TRUE) {
                    $scope.languages = response.data.idiomes;
                  } else {
                    $log.log('data/idiomes error response recived', response);
                    $scope.showErrorDialog('GET idiomes return false state');
                  }
                } else if (response.status === cfg.STATUS_OFFLINE) {
                  $scope.showErrorDialog('API server status offline');
                } else {
                  $scope.showErrorDialog('API server unknown status');
                }
              }
        );

        // INIT
        $scope.currentStep = 1;
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
                    if (response.status === cfg.STATUS_ONLINE) {
                      if (response.state === cfg.STATE_TRUE) {
                        $scope.cities = response.data.municipis;
                      } else {
                        $log.log('data/municipis/' + $scope.province.id + ' response recived', response);
                        $scope.showErrorDialog('GET municipis return false state');
                      }
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                      $scope.showErrorDialog('API server status offline');
                    } else {
                      $scope.showErrorDialog('API server unknown status');
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

        // SHOW ERROR MODAL DIALOG
        $scope.showErrorDialog = function(msg) {
          $scope.errorMsg = msg;
          jQuery('#api-server-offline-modal').modal({
//            backdrop: 'static',
            keyboard: false,
            show: true
          });
        };
      }]);
