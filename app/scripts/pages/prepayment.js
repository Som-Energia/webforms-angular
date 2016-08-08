'use strict';

angular.module('SomEnergiaWebForms')
    .controller('PrepaymentCtrl', function (cfg, prepaymentService, $http, $scope, $sce, $translate, $routeParams) {

        $scope.developing = cfg.DEVELOPMENT;

        if (!$scope.developing ) {
            $translate.fallbackLanguage('es');
        }
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

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
