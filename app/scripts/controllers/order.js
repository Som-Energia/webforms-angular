'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', '$scope', '$http', '$routeParams', '$translate', '$log', function (cfg, $scope, $http, $routeParams, $translate, $log) {


        // INIT
        $scope.initSubmitReady = false;

        // ON CHANGE FORMS
        $scope.initFormListener = function (form) {
            $scope.initSubmitReady = $scope.form.init.dni !== undefined && $scope.form.init.socinumber !== undefined;
        };

    }]);
