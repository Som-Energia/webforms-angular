'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('MainCtrl', ['cfg', '$scope', '$http', '$routeParams', '$translate', '$log', function (cfg, $scope, $http, $routeParams, $translate, $log) {

        // GET STATES
        $http.get(cfg.API_BASE_URL + 'data/provincies').success(function (response) {
                if (response.status === cfg.STATUS_ONLINE) {
                    if (response.state === cfg.STATE_TRUE) {
                        $scope.provinces = response.data.provincies;
                    } else {
                        $log.error('data/provinces error response recived', response);
                        $scope.showErrorDialog('GET provincies return false state (ref.003-001)');
                    }
                } else if (response.status === cfg.STATUS_OFFLINE) {
                    $scope.showErrorDialog('API server status offline (ref.002-001)');
                } else {
                    $scope.showErrorDialog('API server unknown status (ref.001-001)');
                }
            }
        );

        // GET LANGUAGES
        $http.get(cfg.API_BASE_URL + 'data/idiomes').success(function (response) {
                if (response.status === cfg.STATUS_ONLINE) {
                    if (response.state === cfg.STATE_TRUE) {
                        $scope.languages = response.data.idiomes;
                    } else {
                        $log.log('data/idiomes error response recived', response);
                        $scope.showErrorDialog('GET idiomes return false state (ref.003-002)');
                    }
                } else if (response.status === cfg.STATUS_OFFLINE) {
                    $scope.showErrorDialog('API server status offline (ref.002-002)');
                } else {
                    $scope.showErrorDialog('API server unknown status (ref.001-002)');
                }
            }
        );

        // INIT
        $scope.currentStep = 1;
        $scope.step1Ready = true;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.submitReady = false;
        $scope.submitted = false;
        $scope.userTypeClicked = false;
        $scope.paymentMethodClicked = false;
        $scope.form = {};
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.province = {};
        $scope.city = {};
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // ON CHANGE SELECTED STATE
        $scope.updateSelectedCity = function (form) {
            // GET CITIES
            $http.get(cfg.API_BASE_URL + 'data/municipis/' + $scope.form.province.id).success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        if (response.state === cfg.STATE_TRUE) {
                            $scope.cities = response.data.municipis;
                        } else {
                            $log.log('data/municipis/' + $scope.form.province.id + ' response recived', response);
                            $scope.showErrorDialog('GET municipis return false state (ref.003-003)');
                        }
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        $scope.showErrorDialog('API server status offline (ref.002-003)');
                    } else {
                        $scope.showErrorDialog('API server unknown status (ref.001-003)');
                    }
                }
            );
            $scope.formListener(form);
        };

        // ON SUBMIT FORM
        $scope.submit = function (form) {
            // Trigger validation flag.
            $scope.submitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
                return null;
            }

            var postData = {
                tipuspersona: $scope.form.usertype === 'person' ? cfg.USER_TYPE_PERSON : cfg.USER_TYPE_COMPANY,
                nom: $scope.form.social,
                cognom: '',
                dni: $scope.form.dni,
                tel: $scope.form.phone1,
                tel2: $scope.form.phone2,
                email: $scope.form.email1,
                cp: $scope.form.postalcode,
                provincia: $scope.form.province.id,
                adreca: $scope.form.address,
                municipi: $scope.form.city.id,
                idioma: $scope.form.language.id,
                payment_method: $scope.form.usertype === 'bankaccount' ? cfg.PAYMENT_METHOD_BANK_ACCOUNT : cfg.PAYMENT_METHOD_CREDIT_CARD
            };
            $log.log(postData);

            $http.post(cfg.API_BASE_URL + 'form/soci/alta', postData).success(function (response) {
                    if (response.status === cfg.STATUS_ONLINE) {
                        if (response.state === cfg.STATE_TRUE) {
                            $log.log('POST form/soci/alta response recived', response);
                        } else {
                            $log.log('form/soci/alta error response recived', response);
                            $scope.showErrorDialog('POST alta soci return false state (ref.003-004)');
                        }
                    } else if (response.status === cfg.STATUS_OFFLINE) {
                        $scope.showErrorDialog('API server status offline (ref.002-004)');
                    } else {
                        $scope.showErrorDialog('API server unknown status (ref.001-004)');
                    }
                }
            ).error(function () {
                    $log.log('error in ajax form/soci/alta submission');
                }
            );
        };

        // ON CHANGE FORM
        $scope.formListener = function (form) {
            $scope.step2Ready = $scope.userTypeClicked && form.language !== undefined;
            $scope.step3Ready =
                $scope.step2Ready &&
                    form.cif !== undefined &&
                    form.social !== undefined &&
                    form.dni !== undefined &&
                    form.person !== undefined &&
                    form.email1 !== undefined &&
                    form.email2 !== undefined &&
                    form.phone1 !== undefined &&
                    form.address !== undefined &&
                    form.postalcode !== undefined &&
                    form.province !== undefined &&
                    form.city !== undefined &&
                    form.accept !== undefined &&
                    form.accept !== false
            ;
            $scope.submitReady = $scope.step1Ready && $scope.step2Ready && $scope.step3Ready && $scope.paymentMethodClicked;
        };
        $scope.firstUserTypeClick = function (form) {
            $scope.userTypeClicked = true;
            $scope.formListener(form);
        };
        $scope.firstPaymentMethodClick = function (form) {
            $scope.paymentMethodClicked = true;
            $scope.formListener(form);
        };

        // SHOW ERROR MODAL DIALOG
        $scope.showErrorDialog = function (msg) {
            $scope.errorMsg = msg;
            jQuery('#api-server-offline-modal').modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        };
    }]);
