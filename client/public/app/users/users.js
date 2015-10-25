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
        $scope.me = Users.get({controller : 'me'});
        $scope.newUser = {};
        $scope.refreshList = function () {
            $scope.users = Users.query();
        };

        $scope.addNewUser = function () {
            Users.save($scope.newUser, function () {
                $scope.newUser={};
                $scope.refreshList();
            });
        };

        $scope.refreshList();

    }).directive('available', function ($q, $timeout) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var userEmails = scope.users;

                ctrl.$validators.available = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return true;
                    }
                    if (scope.me.email === modelValue || userEmails.filter(function(elm){return elm.email==modelValue}).length !==0){
                        return false;
                    };
                    return true;
                };
            }
        };
    }).directive('validateEmail', function() {
        var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        return {
            require: 'ngModel',
            restrict: '',
            link: function(scope, elm, attrs, ctrl) {
                if (ctrl && ctrl.$validators.email) {
                    ctrl.$validators.email = function(modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });