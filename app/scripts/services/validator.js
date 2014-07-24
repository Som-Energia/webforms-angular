'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('ValidateHandler', ['$timeout', '$log', 'AjaxHandler', 'cfg', function($timeout, $log, AjaxHandler, cfg) {

        var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var integerRE = /^\d*$/;
        var dniRE = /^[a-zA-Z]?\d*[a-zA-Z]?$/;
        var DELAY = 1000; // in milliseconds

        // INTEGER VALIDATOR
        this.validateInteger = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    if (element === 'form.init.socinumber' && !integerRE.test(newValue)) {
                        $scope.form.init.socinumber = oldValue;
                    } else if (element === 'form.estimation' && !integerRE.test(newValue)) {
                        $scope.form.estimation = oldValue;
                    }
                }
            });
        };

        // POWER VALIDATOR
        this.validatePower = function($scope, element) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined) {
                    var re = /^\d*([.,'])?\d*/g;
                    var match = re.exec(newValue);
                    var result = match[0].replace(',', '.');
                    result = result.replace('\'', '.');
                    if (element === 'form.power') {
                        var valueToApply = result;
                        if ($scope.form.rate === cfg.RATE_20A || $scope.form.rate === cfg.RATE_20DHA) {
                            if (result > 10) {
                                valueToApply = oldValue;
                            }
                        } else if ($scope.form.rate === cfg.RATE_21A || $scope.form.rate === cfg.RATE_21DHA) {
                            if (result > 15 || (result > 1 && newValue.length === 1)) {
                                valueToApply = oldValue;
                            }
                        } else if ($scope.form.rate === cfg.RATE_30A) {
                            if (result > 450 || (result < 15 && newValue.length > 1)) {
                                valueToApply = oldValue;
                            }
                        }
                        $scope.form.power = valueToApply;
                    } else if (element === 'form.power2') {
                        if (result > 450 || (result < 15 && newValue.length > 1)) {
                            $scope.form.power2 = oldValue;
                        } else {
                            $scope.form.power2 = result;
                        }
                    } else if (element === 'form.power3') {
                        if (result > 450 || (result < 15 && newValue.length > 1)) {
                            $scope.form.power3 = oldValue;
                        } else {
                            $scope.form.power3 = result;
                        }
                    }
                }
            });
        };
        
        // DNI VALIDATOR
        this.validateDni = function($scope, element, timer) {
            $scope.$watch(element, function(newValue, oldValue) {
                var makeApiAsyncCheck = true;
                if (newValue !== undefined && !dniRE.test(newValue)) {
                    if (element === 'form.dni') {
                        $scope.form.dni = oldValue;
                    } else if (element === 'form.init.dni') {
                        $scope.form.init.dni = oldValue;
                    } else if (element === 'form.representantdni') {
                        $scope.form.representantdni = oldValue;
                    } else if (element === 'form.accountdni') {
                        $scope.form.accountdni = oldValue;
                    } else if (element === 'form.accountrepresentantdni') {
                        $scope.form.accountrepresentantdni = oldValue;
                    }
                    makeApiAsyncCheck = false;
                }
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined && makeApiAsyncCheck) {
                        var dniPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                        dniPromise.then(
                            function (response) {
                                if (element === 'form.dni' || element === 'form.init.dni') {
                                    $scope.dniIsInvalid  = response === cfg.STATE_FALSE;
                                    $scope.dni2IsInvalid = response === cfg.STATE_FALSE;
                                    $scope.dniDuplicated = false;
                                } else if (element === 'form.representantdni') {
                                    $scope.dniRepresentantIsInvalid = response === cfg.STATE_FALSE;
                                    $scope.dni3IsInvalid = response === cfg.STATE_FALSE;
                                } else if (element === 'form.accountdni') {
                                    $scope.dni4IsInvalid = response === cfg.STATE_FALSE;
                                } else if (element === 'form.accountrepresentantdni') {
                                    $scope.dni5IsInvalid = response === cfg.STATE_FALSE;
                                }
                                $scope.formListener();
                            },
                            function (reason) { $log.error('Check DNI failed', reason); }
                        );
                    }
                }, DELAY);
            });
        };
        
        // EMAIL 1 VALIDATOR
        this.validateEmail1 = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        if (element === 'form.email1') {
                            $scope.emailNoIguals = $scope.form.email2 !== undefined && newValue !== $scope.form.email2;
                            $scope.emailIsInvalid = !emailRE.test(newValue);
                        } else if (element === 'form.accountemail1') {
                            $scope.accountEmailNoIguals = $scope.form.accountemail2 !== undefined && newValue !== $scope.form.accountemail2;
                            $scope.accountEmailIsInvalid = !emailRE.test(newValue);
                        }
                        $scope.formListener();
                    }
                }, DELAY);
            });
        };

        // EMAIL 2 VALIDATOR
        this.validateEmail2 = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        if (element === 'form.email2') {
                            $scope.emailNoIguals = ($scope.form.email1 !== undefined || $scope.form.email1 !== '') && newValue !== $scope.form.email1;
                        } else if (element === 'form.accountemail2') {
                            $scope.accountEmailNoIguals = ($scope.form.accountemail1 !== undefined || $scope.form.accountemail1 !== '') && newValue !== $scope.form.accountemail1;
                        }
                        $scope.formListener();
                    }
                }, DELAY);
            });
        };

        // POSTAL CODE VALIDATOR
        this.validatePostalCode = function($scope, element, timer) {
            $scope.$watch(element, function(newValue, oldValue) {
                if (newValue !== undefined && (!integerRE.test(newValue) || newValue.length > 5)) {
                    if (element === 'form.postalcode') {
                        $scope.form.postalcode = oldValue;
                    } else if (element === 'form.accountpostalcode') {
                        $scope.form.accountpostalcode = oldValue;
                    }
                }
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined && newValue.length < 5) {
                        if (element === 'form.postalcode') {
                            $scope.postalCodeIsInvalid = true;
                        } else if (element === 'form.accountpostalcode') {

                        }
                    } else {
                        if (element === 'form.postalcode') {
                            $scope.postalCodeIsInvalid = false;
                        } else if (element === 'form.accountpostalcode') {

                        }
                    }
                    $scope.formListener();
                }, DELAY);
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
                    } else if (element === 'form.accountphone1') {
                        $scope.form.accountphone1 = oldValue;
                    } else if (element === 'form.accountphone2') {
                        $scope.form.accountphone2 = oldValue;
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

        // CUPS VALIDATOR
        this.validateCups = function($scope, element, timer) {
            $scope.$watch(element, function(newValue) {
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    if (newValue !== undefined) {
                        var cupsPromise = AjaxHandler.getStateRequest($scope, cfg.API_BASE_URL + 'check/cups/' + newValue, '006');
                        cupsPromise.then(
                            function(response) {
                                $scope.cupsIsInvalid = response === cfg.STATE_FALSE;
                                $scope.cupsIsDuplicated = false;
                                $scope.formListener($scope.form);
                            },
                            function(reason) { $log.error('Check CUPS failed', reason); }
                        );
                    }
                }, DELAY);
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
                            function(reason) { $log.error('Check CNAE failed', reason); }
                        );
                    }
                }, DELAY);
            });
        };

    }]);
