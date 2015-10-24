angular.module( 'logienApp.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            controller: 'HomeCtrl',
            templateUrl: 'app/home/home.html',
            data: {
                requiresLogin: true
            }
        });
    })
    .controller( 'HomeCtrl', function HomeController( $scope) {});