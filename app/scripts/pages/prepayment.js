'use strict';

angular.module('SomEnergiaWebForms')
    .controller('PrepaymentCtrl', function (cfg, $http, ApiSomEnergia, $log, $scope, $sce, $translate, uiHandler, $routeParams) {

        $scope.developing = cfg.DEVELOPMENT;

        if (!$scope.developing ) {
            $translate.fallbackLanguage('es');
        }
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        $scope.getTrustPostAction = function() {
            if ($scope.data.endpoint)
                return $sce.trustAsResourceUrl($scope.data.endpoint);
        };

        var dataPromise = ApiSomEnergia.dataRequest('pagament/redirectiondata','010');
        dataPromise.then(
            function (response) {
                if (response.state === cfg.STATE_FALSE) {
                    // error
                    uiHandler.showErrorDialog('Payment Error',
                        'No se ha podido obtener los datos');
                    return;
                } else if (response.state === cfg.STATE_TRUE) {
                    // Credit card or bank 
                    $scope.data=response.data;
                    console.log(response.data);
                    $scope.target = $sce.trustAsResourceUrl($scope.data.endpoint);
                    $log.log($scope.target);
                    if ($scope.data.payment_type === 'rebut') {
                        $scope.data.payment_data.ID_OPERACION = escape(
                            $scope.data.payment_data.ID_OPERACION);
                    }
                    $log.log('response received', response);
                    if ($scope.target) {
                        setTimeout(function () {
                            jQuery('#prepayment-webform').submit();
                            }, 1000);
                    }
                }
            },
            function (reason) {
                $log.error('Post data failed', reason);
                $scope.rawReason = JSON.stringify(reason,null,'  ');
                jQuery('#webformsGlobalMessagesModal').modal('show');
            }
        );

        // $log.log('prepayment endpoint', $scope.data.endpoint);
    });
