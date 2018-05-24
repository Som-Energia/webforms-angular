'use strict';

angular.module('SomEnergiaWebForms')
.directive('tokenRetriever', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            uri: '@',
            token: '@',
            onready: '&',
        },
        templateUrl: 'scripts/components/tokenretriever.html',
        controller: 'tokenRetrieverCtrl',
        link: function(scope, element, attrs, memberChooserCtrl) {
            memberChooserCtrl.init();
        },
    };
})
.controller('tokenRetrieverCtrl', function (
        cfg,
        $scope,
        $timeout,
        $log,
        ApiSomEnergia
        ) {
    var self = this;
    self.init = function() {
        $scope.model.soci = {};
        $scope.model.ready = false;
        $scope.loading = true;

        // GET PARTNER DATA
        //var base = 'intercoop/tokeninfo/contract/';
        var base = 'data/soci/';
        var sociPromise = ApiSomEnergia.dataRequest(base+$scope.token, '001');
        sociPromise.then(
            function(response) {
                if (response.state === cfg.STATE_TRUE) {
                    $log.log('Get partner info response received', response);
                    $scope.model.soci = response.data.soci;
                    $scope.model.ready = true;
                    $scope.loading = false;
                    if ($scope.onready) { $scope.onready(); }
                } else {
                    $scope.loading = false;
                    $scope.model.ready = false;
                }
            },
            function(reason) {
                $log.error('Get partner info failed', reason);
                $scope.model.ready=false;
                $scope.loading=false;
                $scope.apiError = reason;
            }
        );
    };
});



