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
        $scope.initModifiedUser = function () {
            if ($scope.selectedUser) {
                $scope.modifiedUser = {_id: $scope.selectedUser._id, email: $scope.selectedUser.email, password: ''};
            } else {
                $scope.modifiedUser = {_id: '', email: '', password: ''};
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
                $scope.initModifiedUser();
                $scope.initResult();
            }
        };

        $scope.modifyEmail = function () {
            if ($scope.selectedUser) {
                Users.save($scope.modifiedUser,
                    function (value) {
                        $scope.selectedUser.email = $scope.modifiedUser.email;
                        $scope.initModifiedUser();
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
                Users.save($scope.selectedUser,
                    function (value) {
                        $scope.initModifiedUser();
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

        $scope.deleteUser = function () {
            if ($scope.selectedUser) {
                Users.delete({id: $scope.selectedUser._id}, function () {
                    $scope.selectedUser = {};
                    refreshList();
                });
            }
        };

        $scope.initModifiedUser();
        $scope.initResult();
        refreshList();

    });