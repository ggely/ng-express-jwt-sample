angular.module('logienApp.navbar', [])
    .controller('NavbarCtrl', function ($scope, $location, Users, store, $location) {
        $scope.user = Users.get({controller: 'me'});
        $scope.isActive = function (path) {
            var currentPath = $location.path().split('/')[1];
            if (currentPath.indexOf('?') !== -1) {
                currentPath = currentPath.split('?')[0];
            }
            return currentPath === path.split('/')[1];
        };

        $scope.logout = function(){
            store.set('jwt', '');
            $location.path('/login');
        }
    })
    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/navbar.html',
            controller: 'NavbarCtrl'
        };
    });
