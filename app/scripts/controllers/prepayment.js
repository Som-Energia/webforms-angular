'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('PrepaymentCtrl', ['cfg', 'prepaymentService', '$http', '$scope', '$sce', function (cfg, prepaymentService, $http, $scope, $sce) {

        $scope.data = prepaymentService.getData();

        $scope.getTrustPostAction = function () {
            return $sce.trustAsResourceUrl($scope.data.endpoint);
        };

        $scope.getOperationIdEscape = function () {
            if ($scope.payment_type === 'rebut') {
                $scope.data.payment_data.ID_OPERACION = escape($scope.data.payment_data.ID_OPERACION);
            }
        };

        // TODO enable on production to avoid prepayment template render
        // $scope.getOperationIdEscape();
        // $http.post($scope.data.endpoint, $scope.data.payment_data);

    }]);
