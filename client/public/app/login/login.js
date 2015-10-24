angular.module( 'logienApp.login', [
    'ui.router',
    'angular-storage'
])
    .config(function($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'app/login/login.html'
        });
    })
    .controller( 'LoginCtrl', function LoginController( $scope, $http, store, $state) {

        $scope.user = {};

        $scope.login = function() {
            $http({
                url: '/api/users/login',
                method: 'POST',
                data: $scope.user
            }).then(function(response) {
                console.log(response);
                store.set('jwt', response.data.token);
                $state.go('home');
            }, function(error) {
                alert(error.data);
            });
        }

    });