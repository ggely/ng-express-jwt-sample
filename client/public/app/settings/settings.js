angular.module('logienApp.settings', [
    'ui.router',
])
    .config(function ($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings',
            controller: 'SettingsCtrl',
            templateUrl: 'app/settings/settings.html',
            data: {
                requiresLogin: true
            }
        });
    })
    .controller('SettingsCtrl', function UsersCtrl($scope, Users) {
        $scope.me = Users.get({controller: 'me'}, function(){
            $scope.initUser();
        });

        $scope.initResult = function () {
            $scope.result = {success: false, error: false};
        };
        $scope.initUser = function () {
            $scope.modifiedUser = {_id : $scope.me._id,email: $scope.me.email, password: ''};
        };

        var success = function () {
            $scope.result.success = true;
            $scope.result.error = false;
        };

        var error = function () {
            $scope.result.success = false;
            $scope.result.error = true;
        };
        
        $scope.modifyEmail = function () {
            Users.save($scope.modifiedUser,
                function (value) {
                    $scope.me.email = $scope.modifiedUser.email;
                    $scope.initUser();
                    $scope.initResult();
                    success();
                },
                function (err) {
                    error();
                }
            )
        };

        $scope.modifyPassword = function () {
            Users.save($scope.modifiedUser,
                function (value) {
                    $scope.initUser();
                    $scope.initResult();
                    success();
                },
                function (err) {
                    error();
                }
            )
        };

        $scope.initResult();

    });