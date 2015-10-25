'use strict';

angular.module('logienApp', [
    'logienApp.services',
    'logienApp.login',
    'logienApp.home',
    'logienApp.users',
    'logienApp.settings',
    'logienApp.navbar',
    'logienApp.validations',
    'ui.router',
    'ngResource',
    'angular-storage',
    'angular-jwt'
])
    .config(function myAppConfig($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');

        jwtInterceptorProvider.tokenGetter = function (store) {
            return store.get('jwt');
        };

        $httpProvider.interceptors.push('jwtInterceptor');
    })
    .run(function ($rootScope, $state, store, jwtHelper) {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            if (to.data && to.data.requiresLogin) {

                if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                    e.preventDefault();
                    $state.go('login');
                }
            }
        });
    })
    .controller('AppCtrl', function AppCtrl($scope, $location) {
        $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
            if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
                $scope.pageTitle = nextRoute.$$route.pageTitle + ' | ngEurope Sample';
            }
        });
    })

;
