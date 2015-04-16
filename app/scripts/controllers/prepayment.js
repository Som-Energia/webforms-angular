'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('PrepaymentCtrl', function (cfg, prepaymentService, $http, $scope, $sce) {

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
    });
