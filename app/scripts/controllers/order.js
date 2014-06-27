'use strict';

angular.module('newSomEnergiaWebformsApp')
    .controller('OrderCtrl', ['cfg', 'AjaxHandler', 'ValidateHandler', 'uiHandler', '$scope', '$http', '$routeParams', '$translate', '$timeout', '$window', '$log', function (cfg, AjaxHandler, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.step0Ready = true;
        $scope.step1Ready = false;
        $scope.step2Ready = false;
        $scope.step3Ready = false;
        $scope.dniIsInvalid = false;
        $scope.cupsIsInvalid = false;
        $scope.cnaeIsInvalid = false;
        $scope.accountIsInvalid = false;
        $scope.showUnknownSociWarning = false;
        $scope.showBeginOrderForm = false;
        $scope.showStep1Form = false;
        $scope.initSubmitReady = false;
        $scope.initFormSubmitted = false;
        $scope.isStep2ButtonReady = false;
        $scope.isStep3ButtonReady = false;
        $scope.isFinalStepButtonReady = false;
        $scope.orderFormSubmitted = false;
        $scope.languages = [];
        $scope.provinces = [];
        $scope.cities = [];
        $scope.language = {};
        $scope.form = {};
        $scope.form.choosepayer = 'titular';
        $scope.completeAccountNumber = '';
        $scope.form.init = {};
        $scope.rates = ['2.0A', '2.0DHA', '2.1A', '2.1DHA', '3.0A'];
        $scope.numberRegex = new RegExp('^\\d+$');
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // GET LANGUAGES
        var languagesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/idiomes', '002');
        languagesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    $scope.languages = response.data.idiomes;
                } else {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-002)');
                }
            },
            function (reason) { $log.error('Failed', reason); }
        );

        // GET STATES
        var statesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/provincies', '001');
        statesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    $scope.provinces = response.data.provincies;
                    $scope.provinces2 = response.data.provincies;
                    $scope.provinces3 = response.data.provincies;
                } else {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-001)');
                }
            },
            function (reason) { $log.error('Failed', reason); }
        );

        // SOCI NUMBER VALIDATION
        $scope.$watch('form.init.socinumber', function(newValue, oldValue) {
            if (newValue !== undefined) {
                if (!$scope.numberRegex.test(newValue)) {
                    $scope.form.init.socinumber = oldValue;
                }
            }
        });

        // POWER VALIDATION
        $scope.$watch('form.power', function(newValue, oldValue) {
            if (newValue !== undefined && isNaN(newValue)) {
                $scope.form.power = oldValue;
            }
        });

        // DNI VALIDATION
        var checkDniTimer = false;
        $scope.$watch('form.init.dni', function(newValue) {
            if (checkDniTimer) {
                $timeout.cancel(checkDniTimer);
            }
            checkDniTimer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                    dniPromise.then(
                        function (response) {
                            $scope.dniIsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener();
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });
        var checkDni2Timer = false;
        $scope.$watch('form.dni', function(newValue) {
            if (checkDni2Timer) {
                $timeout.cancel(checkDni2Timer);
            }
            checkDni2Timer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                    dniPromise.then(
                        function (response) {
                            $scope.dni2IsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener();
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });
        var checkDni3Timer = false;
        $scope.$watch('form.representantdni', function(newValue) {
            if (checkDni3Timer) {
                $timeout.cancel(checkDni3Timer);
            }
            checkDni3Timer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '006');
                    dniPromise.then(
                        function (response) {
                            $scope.dni3IsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener();
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });
        var checkDni4Timer = false;
        $scope.$watch('form.accountdni', function(newValue) {
            if (checkDni4Timer) {
                $timeout.cancel(checkDni4Timer);
            }
            checkDni4Timer = $timeout(function() {
                if (newValue !== undefined) {
                    var dniPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '008');
                    dniPromise.then(
                        function (response) {
                            $scope.dni4IsInvalid = response === cfg.STATE_FALSE;
                            $scope.formListener();
                        },
                        function (reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // EMAIL VALIDATIONS
        var checkEmail1Timer = false;
        $scope.$watch('form.email1', function(newValue) {
            if (checkEmail1Timer) {
                $timeout.cancel(checkEmail1Timer);
            }
            checkEmail1Timer = $timeout(function() {
                if (newValue !== undefined) {
                    $scope.emailNoIguals = $scope.form.email2 !== undefined && newValue !== $scope.form.email2;
                    $scope.emailIsInvalid = !ValidateHandler.isEmailValid(newValue);
                    $scope.formListener();
                }
            }, 400);
        });
        var checkEmail2Timer = false;
        $scope.$watch('form.email2', function(newValue) {
            if (checkEmail2Timer) {
                $timeout.cancel(checkEmail2Timer);
            }
            checkEmail2Timer = $timeout(function() {
                if (newValue !== undefined) {
                    $scope.emailNoIguals = ($scope.form.email1 !== undefined || $scope.form.email1 !== '') && newValue !== $scope.form.email1;
                    $scope.formListener();
                }
            }, 400);
        });
        var checkAccountEmail1Timer = false;
        $scope.$watch('form.accountemail1', function(newValue) {
            if (checkAccountEmail1Timer) {
                $timeout.cancel(checkAccountEmail1Timer);
            }
            checkAccountEmail1Timer = $timeout(function() {
                if (newValue !== undefined) {
                    $scope.accountEmailNoIguals = $scope.form.accountemail2 !== undefined && newValue !== $scope.form.accountemail2;
                    $scope.accountEmailIsInvalid = !ValidateHandler.isEmailValid(newValue);
                    $scope.formListener();
                }
            }, 400);
        });
        var checkAccountEmail2Timer = false;
        $scope.$watch('form.accountemail2', function(newValue) {
            if (checkAccountEmail2Timer) {
                $timeout.cancel(checkAccountEmail2Timer);
            }
            checkAccountEmail2Timer = $timeout(function() {
                if (newValue !== undefined) {
                    $scope.accountEmailNoIguals = ($scope.form.accountemail1 !== undefined || $scope.form.accountemail1 !== '') && newValue !== $scope.form.accountemail1;
                    $scope.formListener();
                }
            }, 400);
        });

        // CUPS VALIDATION
        var checkCupsTimer = false;
        $scope.$watch('form.cups', function(newValue) {
            if (checkCupsTimer) {
                $timeout.cancel(checkCupsTimer);
            }
            checkCupsTimer = $timeout(function() {
                if (newValue !== undefined) {
                    var cupsPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/cups/' + newValue, '006');
                    cupsPromise.then(
                        function(response) {
                            $scope.cupsIsInvalid = response === cfg.STATE_FALSE;
                            $scope.cupsIsDuplicated = false;
                            $scope.formListener($scope.form);
                        },
                        function(reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // CNAE VALIDATION
        var cnaeCupsTimer = false;
        $scope.$watch('form.cnae', function(newValue) {
            if (cnaeCupsTimer) {
                $timeout.cancel(cnaeCupsTimer);
            }
            cnaeCupsTimer = $timeout(function() {
                if (newValue !== undefined) {
                    var cnaePromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'check/cnae/' + newValue, '007');
                    cnaePromise.then(
                        function(response) {
                            $scope.cnaeIsInvalid = response.state === cfg.STATE_FALSE;
                            if (!$scope.cnaeIsInvalid && response.data !== undefined) {
                                $scope.cnaeDescription = response.data.description;
                            } else {
                                $scope.cnaeDescription = null;
                            }
                            $scope.formListener($scope.form);
                        },
                        function(reason) { $log.error('Failed', reason); }
                    );
                }
            }, 400);
        });

        // POSTAL CODE VALIDATIONS
        $scope.$watch('form.postalcode', function(newValue, oldValue) {
            if (newValue !== undefined) {
                if (!$scope.numberRegex.test(newValue) || newValue.length > 5) {
                    $scope.form.postalcode = oldValue;
                }
            }
        });
        $scope.$watch('form.accountpostalcode', function(newValue, oldValue) {
            if (newValue !== undefined) {
                if (!$scope.numberRegex.test(newValue) || newValue.length > 5) {
                    $scope.form.accountpostalcode = oldValue;
                }
            }
        });

        // ON CHANGE FORMS
        $scope.formListener = function() {
            $scope.initSubmitReady = $scope.form.init.dni !== undefined && $scope.form.init.socinumber !== undefined && $scope.dniIsInvalid === false;
            $scope.isStep2ButtonReady = $scope.initSubmitReady &&
                $scope.form.address !== undefined &&
                $scope.form.province !== undefined &&
                $scope.form.city !== undefined &&
                $scope.form.cups !== undefined &&
                $scope.form.cnae !== undefined &&
                $scope.cupsIsInvalid === false &&
                $scope.cnaeIsInvalid === false &&
                $scope.form.power !== undefined &&
                $scope.form.rate !== undefined;
            $scope.isStep3ButtonReady = $scope.isStep2ButtonReady &&
                ($scope.form.isownerlink === 'yes' &&
                    (($scope.form.usertype === 'company' && $scope.form.representantdni !== undefined && $scope.form.representantname !== undefined) || $scope.form.usertype === 'person') ||
                    ($scope.form.isownerlink === 'no' &&
                        $scope.form.language !== undefined &&
                        $scope.form.name !== undefined &&
                        ($scope.form.surname !== undefined && $scope.form.usertype === 'person' || $scope.form.usertype === 'company') &&
                        $scope.form.dni !== undefined &&
                        $scope.form.email1 !== undefined &&
                        $scope.form.email2 !== undefined &&
                        $scope.form.email1 === $scope.form.email2 &&
                        $scope.form.phone1 !== undefined &&
                        $scope.form.address2 !== undefined &&
                        $scope.form.postalcode !== undefined &&
                        $scope.form.province2 !== undefined &&
                        $scope.form.city2 !== undefined &&
                        $scope.form.accept !== undefined &&
                        $scope.form.accept !== false &&
                        $scope.dni2IsInvalid === false &&
                        $scope.emailIsInvalid === false &&
                        $scope.emailNoIguals === false
                        )
                    );
            $scope.isFinalStepButtonReady = $scope.isStep3ButtonReady &&
                !$scope.accountIsInvalid &&
                $scope.completeAccountNumber.length > 0 &&
                $scope.form.acceptaccountowner &&
                $scope.form.voluntary !== undefined && ($scope.form.choosepayer !== 'altre' ||
                ($scope.form.choosepayer === 'altre' &&
                        $scope.form.payertype !== undefined &&
                        $scope.form.accountname !== undefined &&
                        $scope.form.accountsurname !== undefined &&
                        $scope.form.accountdni !== undefined &&
                        $scope.form.accountemail1 !== undefined &&
                        $scope.form.accountemail2 !== undefined &&
                        $scope.form.accountemail1 === $scope.form.accountemail2 &&
                        $scope.form.accountphone1 !== undefined &&
                        $scope.form.accountaddress !== undefined &&
                        $scope.form.accountpostalcode !== undefined &&
                        $scope.form.province3 !== undefined &&
                        $scope.form.city3 !== undefined &&
                        $scope.form.accept2 !== undefined &&
                        $scope.form.accept2 !== false &&
                        $scope.dni4IsInvalid === false &&
                        $scope.accountEmailIsInvalid === false &&
                        $scope.accountEmailNoIguals === false))
            ;
        };
        $scope.formAccountListener = function () {
            if ($scope.form.accountbank !== undefined && $scope.form.accountoffice !== undefined && $scope.form.accountchecksum !== undefined && $scope.form.accountnumber !== undefined) {
                $scope.completeAccountNumber = $scope.form.accountbank + $scope.form.accountoffice + $scope.form.accountchecksum + $scope.form.accountnumber;
                var accountPromise = AjaxHandler.getSateRequest($scope, cfg.API_BASE_URL + 'check/bank/' + $scope.completeAccountNumber, '017');
                accountPromise.then(
                    function (response) {
                        $scope.accountIsInvalid = response === cfg.STATE_FALSE;
                        $scope.formListener($scope.form);
                    },
                    function(reason) { $log.error('Failed', reason); }
                );
            }
        };

        // ON INIT SUBMIT FORM
        $scope.initSubmit = function(form) {
            // Trigger validation flags
            $scope.initFormSubmitted = true;
            if (form.$invalid) {
                return null;
            }
            // GET SOCI VALUES
            $scope.executeGetSociValues();

            return true;
        };

        // MOVE TO STEP 1 FORM
        $scope.initOrderForm = function() {
            $scope.showStep1Form = true;
            $scope.step0Ready = false;
            $scope.step1Ready = true;
        };

        // MOVE TO STEP 2 FORM
        $scope.moveToStep2Form = function() {
            $scope.step1Ready = false;
            $scope.step2Ready = true;
        };

        // MOVE TO STEP 3 FORM
        $scope.moveToStep3Form = function() {
            $scope.step2Ready = false;
            $scope.step3Ready = true;
        };

        // ON SUBMIT FORM
        $scope.submitOrder = function(form) {
            // Trigger validation flags
            $scope.orderFormSubmitted = true;
            $scope.cupsIsDuplicated = false;
            $scope.messages = null;
            if (form.$invalid) {
                return null;
            }
            uiHandler.showLoadingDialog();

            // Prepare request data
            var formData = new FormData();
            formData.append('id_soci', $scope.form.init.socinumber);
            formData.append('dni', $scope.form.init.dni);
            formData.append('tipus_persona', $scope.form.usertype === 'person' ? 0 : 1);
            formData.append('soci_titular', $scope.form.isownerlink === 'yes' ? 1 : 0);
            formData.append('representant_nom', $scope.form.usertype === 'company' ? $scope.form.representantname : '');
            formData.append('representant_dni', $scope.form.usertype === 'company' ? $scope.form.representantdni : '');
            formData.append('titular_nom', $scope.form.isownerlink === 'yes' ? $scope.soci.nom : $scope.form.name);
            formData.append('titular_cognom', $scope.form.isownerlink === 'yes' ? $scope.soci.cognom : $scope.form.surname === undefined ? '' : $scope.form.surname);
            formData.append('titular_dni', $scope.form.isownerlink === 'yes' ? $scope.soci.dni : $scope.form.dni);
            formData.append('titular_email', $scope.form.isownerlink === 'yes' ? $scope.soci.email : $scope.form.email1);
            formData.append('titular_tel', $scope.form.isownerlink === 'yes' ? $scope.soci.tel : $scope.form.phone1);
            formData.append('titular_tel2', $scope.form.isownerlink === 'yes' ? $scope.soci.tel2 : $scope.form.phone2 === undefined ? '' : $scope.form.phone2);
            formData.append('titular_adreca', $scope.form.isownerlink === 'yes' ? $scope.soci.adreca : $scope.form.address2);
            formData.append('titular_municipi', $scope.form.isownerlink === 'yes' ? $scope.soci.municipi : $scope.form.city2.id);
            formData.append('titular_cp', $scope.form.isownerlink === 'yes' ? $scope.soci.cp : $scope.form.postalcode);
            formData.append('titular_provincia', $scope.form.isownerlink === 'yes' ? $scope.soci.provincia : $scope.form.province2.id);
            formData.append('tarifa', $scope.form.rate);
            formData.append('cups', $scope.form.cups);
            formData.append('consum', $scope.form.estimation === undefined ? '' : $scope.form.estimation);
            formData.append('potencia', $scope.form.power * 1000);
            formData.append('cnae', $scope.form.cnae);
            formData.append('cups_adreca', $scope.form.address);
            formData.append('cups_provincia', $scope.form.province.id);
            formData.append('cups_municipi', $scope.form.city.id);
            formData.append('referencia', $scope.form.catastre === undefined ? '' : $scope.form.catastre);
            formData.append('fitxer', jQuery('#fileuploaderinput')[0].files[0]);
            formData.append('entitat', $scope.form.accountbank);
            formData.append('sucursal', $scope.form.accountoffice);
            formData.append('control', $scope.form.accountchecksum);
            formData.append('ncompte', $scope.form.accountnumber);
            formData.append('escull_pagador', $scope.form.choosepayer);
            formData.append('compte_nom', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountname);
            formData.append('compte_dni', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountdni);
            formData.append('compte_adreca', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountaddress);
            formData.append('compte_provincia', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.province3.id);
            formData.append('compte_municipi', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.city3.id);
            formData.append('compte_email', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountemail1);
            formData.append('compte_tel', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountphone1);
            formData.append('compte_tel2', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountphone2);
            formData.append('compte_cp', $scope.form.choosepayer !== 'altre' ? '' : $scope.form.accountpostalcode);
            formData.append('condicions', 1);
            formData.append('condicions_privacitat', 1);
            formData.append('condicions_titular', 1);
            formData.append('donatiu', $scope.form.voluntary === 'yes' ? 1 : 0);

            // Send POST request data
            $http({
                method: 'POST',
                url: cfg.API_BASE_URL + 'form/contractacio',
                headers: {'Content-Type': undefined},
                data: formData,
                transformRequest: angular.identity
            }).then(
                function(response) {
                    uiHandler.hideLoadingDialog();
                    $log.log('response recived', response);
                    if (response.data.status === cfg.STATUS_ONLINE) {
                        if (response.data.state === cfg.STATE_TRUE) {
                            uiHandler.showWellDoneDialog();
                        } else {
                            $scope.messages = $scope.getHumanizedAPIResponse(response.data.data);
                            $scope.submitReady = false;
                        }
                    } else if (response.data.status === cfg.STATUS_OFFLINE) {
                        uiHandler.showErrorDialog('API server status offline (ref.022-022)');
                    } else {
                        uiHandler.showErrorDialog('API server unknown status (ref.021-021)');
                    }
                },
                function(reason) { $log.error('Failed', reason); }
            );

            return true;
        };

        // ON CHANGE SELECTED PROVINCE
        $scope.updateSelectedCity = function() {
            if ($scope.form.province !== undefined) {
                // GET CITIES
                var citiesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  $scope.form.province.id, '003');
                citiesPromise.then(
                    function (response) {
                        if (response.state === cfg.STATE_TRUE) {
                            $scope.cities = response.data.municipis;
                        } else {
                            uiHandler.showErrorDialog('GET response state false recived (ref.003-003)');
                        }
                    },
                    function (reason) { $log.error('Failed', reason); }
                );
                $scope.formListener();
            }
        };
        $scope.updateSelectedCity2 = function() {
            if ($scope.form.province2 !== undefined) {
                // GET CITIES
                var citiesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  $scope.form.province2.id, '004');
                citiesPromise.then(
                    function (response) {
                        if (response.state === cfg.STATE_TRUE) {
                            $scope.cities2 = response.data.municipis;
                        } else {
                            uiHandler.showErrorDialog('GET response state false recived (ref.003-004)');
                        }
                    },
                    function(reason) { $log.error('Failed', reason); }
                );
                $scope.formListener();
            }
        };
        $scope.updateSelectedCity3 = function() {
            if ($scope.form.province3 !== undefined) {
                // GET CITIES
                var citiesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  $scope.form.province3.id, '005');
                citiesPromise.then(
                    function (response) {
                        if (response.state === cfg.STATE_TRUE) {
                            $scope.cities3 = response.data.municipis;
                        } else {
                            uiHandler.showErrorDialog('GET response state false recived (ref.003-005)');
                        }
                    },
                    function(reason) { $log.error('Failed', reason); }
                );
                $scope.formListener();
            }
        };

        $scope.executeGetSociValues = function() {
            var sociPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/soci/' + $scope.form.init.socinumber + '/' + $scope.form.init.dni, '001');
            sociPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_TRUE) {
                        $scope.soci = response.data.soci;
                        $scope.showBeginOrderForm = true;
                        $scope.showUnknownSociWarning = false;
//                        $scope.showStep1Form = false; // uncomment on production
                    } else {
                        $scope.showUnknownSociWarning = true;
                        $scope.showStep1Form = false;
                    }
                },
                function (reason) { $log.error('Failed', reason); }
            );
        };

        // GET HUMANIZED API RESPONSE
        $scope.getHumanizedAPIResponse = function(arrayResponse) {
            var result = '';
            if (arrayResponse.required_fields !== undefined) {
                result = result + 'ERROR:'; // TODO $translate it
                for (var i = 0; i < arrayResponse.required_fields.length; i++) {
                    result = result + ' ' + arrayResponse.required_fields[i];
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                result = result + ' ERROR:'; // TODO $translate it
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    result = result + ' ' + arrayResponse.invalid_fields[j].field + '·' + arrayResponse.invalid_fields[j].error;
                    if (arrayResponse.invalid_fields[j].field === 'cups' && arrayResponse.invalid_fields[j].error === 'exist') {
                        $scope.cupsIsDuplicated = true;
                    }
                }
            }
            $scope.step1Ready = true;
            $scope.step2Ready = true;
            $scope.step3Ready = true;

            return result;
        };

        // DEBUG (comment on production)
        $scope.form.init.socinumber = 1706;
        $scope.form.init.dni = '52608510N';
        $scope.form.address = 'Avda. Sebastià Joan Arbó, 6';
        $scope.form.cups = 'ES0031406222973003LE0F';
        $scope.form.cnae = '0520';
        $scope.form.power = '5.5';
        $scope.form.rate = '2.0A';
        $scope.executeGetSociValues();
        $scope.showStep1Form = true;
        $scope.step0Ready = false;
        $scope.step1Ready = true;
        $scope.step2Ready = false;
        $scope.form.accountbank = '1491';
        $scope.form.accountoffice = '0001';
        $scope.form.accountchecksum = '20';
        $scope.form.accountnumber = '20363698';
    }]);
