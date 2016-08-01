'use strict';

angular.module('newSomEnergiaWebformsApp')
.directive('stateCity', function(
) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/components/statecity.html',
        scope: {
            model: '=',
            stateModel: '=',
            cityModel: '=',
            onchanged: '&?',
            small: '@?',
            quietlabels: '@?',
        },
        link: function(scope, element, attrs, stateCityController) {
            stateCityController.init(/*element, attrs*/);
        },
        controller: 'stateCityController',
    };
})
.controller('stateCityController', function(
    cfg,
    $scope,
    AjaxHandler,
    stateCityApi,
    uiHandler
) {
    var self = this;
    self.init = function(/*element,attrs*/) {
        $scope.form = {};
        $scope.provinces = [];
        $scope.cities = [];
        self.getStates($scope);

        $scope.updateCities = function() {
            $scope.cityModel=undefined;
            $scope.cities=[];
            if ($scope.stateModel===undefined) { return; }
            self.getCities($scope, $scope.stateModel.id);
        };

        $scope.formListener = function() {
            if ($scope.onchanged !== undefined) {
                $scope.onchanged();
            }
        };
    };


    self.getStates = function($scope) {
        stateCityApi.loadStates($scope);
    };

    // Get cities
    self.getCities = function($scope, provinceId) {
        if (provinceId === undefined) { return; }

        var citiesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  provinceId, '003');
        citiesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    $scope.cities = response.data.municipis;
                } else {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-003)');
                }
            },
            function (reason) {
                uiHandler.showErrorDialog('Update city select failed ' + reason);
            }
        );
        $scope.formListener();
    };
})
.service('stateCityApi', function(cfg, uiHandler, AjaxHandler) {
    var self = this;
    self.states = undefined;
    self.statesPromise = undefined;
    self.scopesWaitingStates = [];


    self.loadStates = function($scope) {
        if (self.states !== undefined) {
            $scope.provinces  = self.states;
            return;
        }
        self.scopesWaitingStates.push($scope);
        self.preloadStates();
    };
    self.preloadStates = function() {
        if (self.statesPromise!==undefined) {
            return;
        }
        self.statesPromise = true; // take it
        self.statesPromise = AjaxHandler.getDataRequest(undefined/*scope*/, cfg.API_BASE_URL + 'data/provincies', '001');
        self.statesPromise.then(
            function (response) {
                if (response.state !== cfg.STATE_TRUE) {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-001)');
                    return;
                }
                self.states = response.data.provincies;
                jQuery.each(self.scopesWaitingStates, function(i,s) {
                    s.provinces = self.states;
                });
            },
            function (reason) { uiHandler.showErrorDialog('Get states failed ' + reason); }
        );
    };
})
;
