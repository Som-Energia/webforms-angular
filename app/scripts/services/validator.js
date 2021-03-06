'use strict';

angular.module('SomEnergiaWebForms')
    .service('ValidateHandler', ['$timeout', '$log', 'ApiSomEnergia', 'cfg', function($timeout, $log, ApiSomEnergia, cfg) {

        var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var integerRE = /^\d*$/;
        //var ibanFirstFieldRE = /^[a-zA-Z]{1,2}[0-9]*/;
        var dniRE = /^[a-zA-Z]?\d*[a-zA-Z]?$/;

        // INTEGER VALIDATOR
        this.validateInteger = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    if (element === 'formvalues.socinumber' && !integerRE.test(newValue)) {
                        $scope.formvalues.socinumber = oldValue;
                    } else if (element === 'form.estimation' && !integerRE.test(newValue)) {
                        $scope.form.estimation = oldValue;
                    }
                }
            });
        };

        this.validateNewPower = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    var re = /^\d*([.,'])?\d?/g;
                    var match = re.exec(newValue);
                    var result = match[0].replace(',', '.');
                    result = result.replace('\'', '.');
                    result = (result === '.') ? undefined : result;
                    result = ($scope.form.phases === 'mono' && parseFloat(result) >= 15) ? oldValue : result;
                    $scope.form.newpower = result;
                } else {
                    $scope.form.newpower = undefined;
                }
            });
        };

        // POWER VALIDATOR
        this.validatePower = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    var re = /^\d*([.,'])?\d{0,3}/g;
                    var match = re.exec(newValue);
                    var result = match[0].replace(',', '.');
                    result = result.replace('\'', '.');
                    $scope.rate20IsInvalid = false;
                    $scope.rate21IsInvalid = false;
                    $scope.rate3AIsInvalid = false;
                    if (element === 'form.power') {
                        if ($scope.form.rate === cfg.RATE_20A || $scope.form.rate === cfg.RATE_20DHA || $scope.form.rate === cfg.RATE_20DHS) {
                            $scope.form.power = result <= 0 || result > 10 ? oldValue : result;
                            $scope.rate20IsInvalid = result <= 0 || result > 10; // TODO: Never occurs

                        } else if ($scope.form.rate === cfg.RATE_21A || $scope.form.rate === cfg.RATE_21DHA || $scope.form.rate === cfg.RATE_21DHS) {
                            $scope.form.power =((newValue < 10 && newValue.length > 1) || result > 15) ? oldValue : result;
                            $scope.rate21IsInvalid = result <= 10 || result > 15;

                        } else if ($scope.form.rate === cfg.RATE_30A) {
                            $scope.form.power = result > 450 ? oldValue : result;
                            $scope.rate3AIsInvalid =
                                $scope.form.power2 !== undefined &&
                                $scope.form.power3 !== undefined &&
                                $scope.form.power <= 15 &&
                                $scope.form.power2 <= 15 &&
                                $scope.form.power3 <= 15;
                        }
                    } else if (element === 'form.power2') {
                        $scope.form.power2 = result > 450 ? oldValue : result;
                        $scope.rate3AIsInvalid =
                            $scope.form.power !== undefined &&
                            $scope.form.power3 !== undefined &&
                            $scope.form.power <= 15 &&
                            $scope.form.power2 <= 15 &&
                            $scope.form.power3 <= 15;
                    } else if (element === 'form.power3') {
                        $scope.form.power3 = result > 450 ? oldValue : result;
                        $scope.rate3AIsInvalid =
                            $scope.form.power !== undefined &&
                            $scope.form.power2 !== undefined &&
                            $scope.form.power <= 15 &&
                            $scope.form.power2 <= 15 &&
                            $scope.form.power3 <= 15;
                    }
                }
                $scope.formListener();
            });
        };

        // DNI VALIDATOR
        this.validateDni = function($scope, element, timer) {
            $scope.$watch(element, function(newValue, oldValue) {
                var makeApiAsyncCheck = true;
                if (newValue !== undefined && !dniRE.test(newValue)) {
                    if (element === 'form.dni') {
                        $scope.form.dni = oldValue;
                    } else if (element === 'formvalues.init.dni') {
                        $scope.formvalues.dni = oldValue;
                    }
                    makeApiAsyncCheck = false;
                }
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined && makeApiAsyncCheck) {
                        var dniPromise = ApiSomEnergia.getStateRequest($scope, cfg.API_BASE_URL + 'old/check/vat/' + newValue, '005');
                        dniPromise.then(
                            function (response) {
                                if (element === 'form.dni' || element === 'formvalues.dni') {
                                    $scope.dniIsInvalid = response.state === cfg.STATE_FALSE;
                                    $scope.dni2IsInvalid = response.state === cfg.STATE_FALSE;
                                    $scope.dniDuplicated = false;
                                } else if (element === 'form.representantdni') {
                                    $scope.dniRepresentantIsInvalid = response.state === cfg.STATE_FALSE;
                                    $scope.dni3IsInvalid = response.state === cfg.STATE_FALSE;
                                }
                                $scope.formListener();
                            },
                            function (reason) { $log.error('Check DNI failed', reason); }
                        );
                    }
                }, cfg.DEFAULT_MILLISECONDS_DELAY);
            });
        };

        // EMAIL 1 VALIDATOR
        this.validateEmail1 = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                $scope.validatingEmail = true;
                $scope.emailNoIguals = undefined;
                $scope.emailIsInvalid = undefined;
                timer = $timeout(function() {
                    $scope.validatingEmail = undefined;
                    if (newValue !== undefined) {
                        if (element === 'form.email1') {
                            $scope.emailNoIguals = $scope.form.email2 !== undefined && newValue !== $scope.form.email2;
                            $scope.emailIsInvalid = !emailRE.test(newValue);
                        }
                        $scope.formListener();
                    }
                }, cfg.DEFAULT_MILLISECONDS_DELAY);
            });
        };

        // EMAIL 2 VALIDATOR
        this.validateEmail2 = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                $scope.validatingEmail2 = true;
                $scope.emailNoIguals = undefined;
                timer = $timeout(function() {
                    $scope.validatingEmail2 = undefined;
                    if (newValue !== undefined) {
                        if (element === 'form.email2') {
                            $scope.emailNoIguals = ($scope.form.email1 !== undefined || $scope.form.email1 !== '') && newValue !== $scope.form.email1;
                        }
                    }
                    $scope.formListener();
                }, cfg.DEFAULT_MILLISECONDS_DELAY);
            });
        };

        // POSTAL CODE VALIDATOR
        this.validatePostalCode = function($scope, element, timer) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined && (!integerRE.test(newValue) || newValue.length > 5)) {
                    if (element === 'form.postalcode') {
                        $scope.form.postalcode = oldValue;
                    }
                }
                if (timer) {
                    $timeout.cancel(timer);
                }
                $scope.postalCodeIsInvalid=undefined;
                $scope.validatingPostalCode=true;
                timer = $timeout(function() {
                    $scope.validatingPostalCode=undefined;
                    var valueToApply = newValue !== undefined && newValue.length < 5;
                    if (element === 'form.postalcode') {
                        $scope.postalCodeIsInvalid = valueToApply;
                    }
                    $scope.formListener();
                }, cfg.DEFAULT_MILLISECONDS_DELAY);
            });
        };

        // TELEPHONE NUMBER VALIDATOR
        this.validateTelephoneNumber = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined && newValue !== '' && (!integerRE.test(newValue) || newValue.length > 9)) {
                    if (element === 'form.phone1') {
                        $scope.form.phone1 = oldValue;
                    } else if (element === 'form.phone2') {
                        $scope.form.phone2 = oldValue;
                    } else if (element === 'form.contact_phone') {
                        $scope.form.contact_phone = oldValue;
                    }
                }
            });
        };

        // BANK ACCOUNT INTEGER VALIDATOR
        this.validateBankAccountInteger = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    if (element === 'form.accountbank' && (!integerRE.test(newValue) || newValue.length > 4)) {
                        $scope.form.accountbank = oldValue;
                    } else if (element === 'form.accountoffice' && (!integerRE.test(newValue) || newValue.length > 4)) {
                        $scope.form.accountoffice = oldValue;
                    } else if (element === 'form.accountchecksum' && (!integerRE.test(newValue) || newValue.length > 2)) {
                        $scope.form.accountchecksum = oldValue;
                    } else if (element === 'form.accountnumber' && (!integerRE.test(newValue) || newValue.length > 10)) {
                        $scope.form.accountnumber = oldValue;
                    }
                }
            });
        };

        // IBAN VALIDATOR
        this.validateIban = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    if (element === 'form.accountbankiban1' && newValue.length > 4) {
                        $scope.form.accountbankiban1 = oldValue;
                    } else if (element === 'form.accountbankiban2' && newValue.length > 4) {
                        $scope.form.accountbankiban2 = oldValue;
                    } else if (element === 'form.accountbankiban3' && newValue.length > 4) {
                        $scope.form.accountbankiban3 = oldValue;
                    } else if (element === 'form.accountbankiban4' && newValue.length > 4) {
                        $scope.form.accountbankiban4 = oldValue;
                    } else if (element === 'form.accountbankiban5' && newValue.length > 4) {
                        $scope.form.accountbankiban5 = oldValue;
                    } else if (element === 'form.accountbankiban6' && newValue.length > 4) {
                        $scope.form.accountbankiban6 = oldValue;
                    }
                    if (newValue.length === 4) {
                        if (element === 'form.accountbankiban1') {
                            angular.element('#accountbankiban2input').focus();
                        } else if (element === 'form.accountbankiban2') {
                            angular.element('#accountbankiban3input').focus();
                        } else if (element === 'form.accountbankiban3') {
                            angular.element('#accountbankiban4input').focus();
                        } else if (element === 'form.accountbankiban4') {
                            angular.element('#accountbankiban5input').focus();
                        } else if (element === 'form.accountbankiban5') {
                            angular.element('#accountbankiban6input').focus();
                        }
                    }
                }
            });
        };

        // CUPS VALIDATOR
        this.validateCups = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        var cupsPromise = ApiSomEnergia.dataRequest('check/cups/' + newValue, '006');
                        cupsPromise.then(
                            function(response) {
                                if (response.state === cfg.STATE_TRUE) {
                                    $scope.cupsIsInvalid = false;
                                    $scope.cupsIsDuplicated = false;
                                } else {
                                    $scope.cupsIsInvalid = response.data.invalid_fields[0].error === 'incorrect';
                                    $scope.cupsIsDuplicated = response.data.invalid_fields[0].error === 'exist';
                                }
                                $scope.formListener($scope.form);
                            },
                            function(reason) { $log.error('Check CUPS failed', reason); }
                        );
                    }
                }, cfg.DEFAULT_MILLISECONDS_DELAY);
            });
        };

        // CNAE VALIDATOR
        this.validateCnae = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        var cnaePromise = ApiSomEnergia.dataRequest('check/cnae/' + newValue, '007');
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
                            function(reason) { $log.error('Check CNAE failed', reason); }
                        );
                    }
                }, cfg.DEFAULT_MILLISECONDS_DELAY);
            });
        };

    }]);
