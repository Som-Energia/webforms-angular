'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('PrepaymentCtrl', ['cfg', 'prepaymentService', '$http', '$scope', '$sce', '$log', function (cfg, prepaymentService, $http, $scope, $sce, $log) {

        $scope.data = prepaymentService.getData();

        $scope.getTrustPostAction = function() {
            return $sce.trustAsResourceUrl($scope.data.endpoint);
        };

        $scope.getOperationIdEscape = function() {
            if ($scope.payment_type === 'rebut') {
                $scope.data.payment_data.ID_OPERACION = escape($scope.data.payment_data.ID_OPERACION);
            }
        };

        // $log.log('prepayment endpoint', $scope.data.endpoint);
    }]);
