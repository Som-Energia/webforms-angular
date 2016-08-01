'use strict';

angular.module('newSomEnergiaWebformsApp')
.directive('personalData', function () {
    return {
        restrict: 'E',
        scope: {
            form: '=model',
            onchanged: '&?',
        },
        templateUrl: 'scripts/components/personaldata.html',
        controller: 'personalDataCtrl',
        link: function(scope, element, attrs, personalDataCtrl) {
            personalDataCtrl.init(element, attrs);
        },
    };
})
.controller('personalDataCtrl', function(
        cfg,
        ApiSomEnergia,
//      $log,
        ValidateHandler,
        $scope
        ) {
    var self = this;
    self.init = function(/*element, attrs*/) {
    };
    $scope.form.error = undefined;
    $scope.form.isReady = function() {
        console.log('personalData isReady');
        function error(message) {
            if ($scope.form.error !== message) {
                console.log(message);
                $scope.form.error = message;
            }
            return false;
        }
        if ($scope.form.usertype === undefined) {
            return error('NO_PERSON_TYPE');
        }
        if ($scope.form.name === undefined) {
            return error('NO_NAME');
        }
        if ($scope.form.usertype === 'person') {
            if ($scope.form.surname === undefined) {
                return error('NO_SURNAME');
            }
        }
        if (!$scope.form.dniEditor.isValid()) {
            return error('NO_NIF');
        }
        if ($scope.form.usertype === 'company') {
            if ($scope.form.representantname === undefined) {
                return error('NO_PROXY_NAME');
            }
            if ($scope.form.representantdni === undefined ||
                $scope.dniRepresentantIsInvalid !== false) {
                return error('NO_PROXY_NIF');
            }
        }
        if ($scope.form.address === undefined) {
            return error('NO_ADDRESS');
        }
        if ($scope.form.postalcode === undefined || $scope.postalCodeIsInvalid!==false) {
            return error('NO_POSTALCODE');
        }
        if ($scope.form.province === undefined) {
            return error('NO_STATE');
        }
        if ($scope.form.city === undefined) {
            return error('NO_CITY');
        }

        if ($scope.form.email1 === undefined ||
            $scope.emailIsInvalid !== false) {
            return error('NO_EMAIL');
        }
        if ($scope.form.email2 === undefined ||
            $scope.form.email1 !== $scope.form.email2 ||
            $scope.emailNoIguals !== false) {
            return error('NO_REPEATED_EMAIL');
        }
        if ($scope.form.phone1 === undefined) {
            return error('NO_PHONE');
        }
        if ($scope.form.language === undefined) {
            return error('NO_LANGUAGE');
        }
        if ($scope.form.accept !== true) {
            return error('UNACCEPTED_PRIVACY_POLICY');
        }
        $scope.form.error = undefined;
        return true;
    };
    $scope.form.setLanguage = function(languageCode) {
        for (var i=0; i<$scope.languages.length; i++) {
            if ($scope.languages[i].code !== languageCode) { continue; }
            $scope.form.language = $scope.languages[i];
            return;
        }
        $scope.form.language = $scope.languages[0];
    };

    $scope.languages = [];
    ApiSomEnergia.loadLanguages($scope);
    ApiSomEnergia.preloadStates();
    $scope.messages = null;
    $scope.form.usertype = 'person';
    $scope.form.dniEditor = {};
    $scope.form.representantdniEditor = {};

    $scope.dniRepresentantIsInvalid = false;
    $scope.dniDuplicated = false;
    $scope.emailIsInvalid = false;
    $scope.emailNoIguals = false;
    $scope.postalCodeIsInvalid = false;


    // POSTAL CODE VALIDATION
    var checkPostalCodeTimer = false;
    ValidateHandler.validatePostalCode($scope, 'form.postalcode', checkPostalCodeTimer);

    // TELEPHONE VALIDATION
    ValidateHandler.validateTelephoneNumber($scope, 'form.phone1');
    ValidateHandler.validateTelephoneNumber($scope, 'form.phone2');

    // DNI VALIDATION
    var checkDniTimer = false;
    ValidateHandler.validateDni($scope, 'form.dni', checkDniTimer);
    var checkDniRepresentantTimer = false;
    ValidateHandler.validateDni($scope, 'form.representantdni', checkDniRepresentantTimer);
    // EMAIL VALIDATION
    var checkEmail1Timer = false;
    ValidateHandler.validateEmail1($scope, 'form.email1', checkEmail1Timer);
    var checkEmail2Timer = false;
    ValidateHandler.validateEmail2($scope, 'form.email2', checkEmail2Timer);

    $scope.formListener = function() {
//        $log.debug('Personal data changed:', $scope.form);
        if ($scope.onchanged) {
            $scope.onchanged();
        }
    };

})
;
