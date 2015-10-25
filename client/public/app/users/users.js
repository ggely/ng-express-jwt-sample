angular.module('logienApp.users', [
    'ui.router'
])
    .config(function ($stateProvider) {
        $stateProvider.state('users', {
            url: '/users',
            controller: 'UsersCtrl',
            templateUrl: 'app/users/users.html',
            data: {
                requiresLogin: true
            }
        });
    })
    .controller('UsersCtrl', function UsersCtrl($scope, Users) {
        $scope.me = Users.get({controller: 'me'});
        $scope.newUser = {};
        $scope.selectedUser = {};

        $scope.initResult = function () {
            $scope.result = {success: false, error: false};
        };
        var initModifiedUser = function () {
            if ($scope.selectedUser) {
                $scope.modifiedUser = {email: $scope.selectedUser.email, password: ''};
            } else {
                $scope.modifiedUser = {email: '', password: ''};
            }
        };

        var success = function () {
            $scope.result.success = true;
            $scope.result.error = false;
        };

        var error = function () {
            $scope.result.success = false;
            $scope.result.error = true;
        };

        $scope.select = function (user) {
            if ($scope.selectedUser._id !== user._id) {
                $scope.selectedUser = user;
                initModifiedUser();
                $scope.initResult();
            }
        };

        $scope.modifyEmail = function () {
            if ($scope.selectedUser) {
                $scope.modifiedUser._id = $scope.selectedUser._id;
                Users.save($scope.modifiedUser).$promise.then(
                    function (value) {
                        $scope.selectedUser.email = $scope.modifiedUser.email;
                        initModifiedUser();
                        $scope.initResult();
                        success();
                    },
                    function (error) {
                        error();
                    }
                )
            }
        };

        $scope.modifyPassword = function () {
            if ($scope.selectedUser) {
                $scope.selectedUser.password = $scope.modifiedUser.password;
                Users.save($scope.selectedUser).$promise.then(
                    function (value) {
                        initModifiedUser();
                        $scope.initResult();
                        success();
                    },
                    function (error) {
                        error();
                    }
                )
            }
        };

        var refreshList = function () {
            $scope.users = Users.query();
        };

        $scope.addNewUser = function () {
            Users.save($scope.newUser, function () {
                $scope.newUser = {};
                refreshList();
            });
        };

        initModifiedUser();
        $scope.initResult();
        refreshList();

    }).directive('available', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var userEmails = scope.users;

                ctrl.$validators.available = function (modelValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return true;
                    }
                    if (scope.me.email === modelValue || userEmails.filter(function (elm) {
                            return elm.email == modelValue && elm.email !== scope.selectedUser.email;
                        }).length !== 0) {
                        return false;
                    }
                    ;
                    return true;
                };
            }
        };
    }).directive('validateEmail', function () {
        var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        return {
            require: 'ngModel',
            restrict: '',
            link: function (scope, elm, attrs, ctrl) {
                if (ctrl && ctrl.$validators.email) {
                    ctrl.$validators.email = function (modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });