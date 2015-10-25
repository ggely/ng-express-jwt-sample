angular.module('logienApp.home', [
    'logienApp.navbar',
    'ui.router'
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