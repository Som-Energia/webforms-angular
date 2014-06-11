'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('PrepaymentCtrl', ['cfg', 'prepaymentService', '$scope', '$sce', '$log', function (cfg, prepaymentService, $scope, $sce, $log) {

        // INIT
        $scope.data = prepaymentService.getData();

        $scope.getTrustPostAction = function () {
            return $sce.trustAsResourceUrl($scope.data.endpoint);
        };

    }]);
