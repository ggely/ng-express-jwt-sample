angular.module('logienApp.services', [])
    .config(['$provide', function ($provide) {
        $provide.factory('Users', function ($resource) {
            return $resource('/api/users/:id/:controller', {id: '@_id', controller: '@_controller'}, {
                validateEmail: {
                    method: 'GET', isArray: false,
                    params: {controller: 'email'}
                },
                getCities: {
                    method: 'GET', isArray: true,
                    params: {controller: 'cities'}
                },
                addCity: {
                    method: 'POST', isArray: false,
                    params: {controller: 'cities'}
                }
            });
        });

        $provide.factory('Cities', function ($resource) {
            return $resource('/api/cities/');
        });

        $provide.factory('WeatherApi', ['$http', function ($http) {
            var config = {
                headers: {
                    'Access-Control-Request-Headers': '',
                }
            };

            return {
                get: function (params, success, error) {
                    params.mode = 'json';
                    params.APPID = '4684ab8beca5ebad3bfead2d1505a663';
                    $http.get({
                        url: 'http://api.openweathermap.org/data/2.5/forecast',
                        params: params,
                        method: 'GET'
                    }, config).
                        success(success).
                        error(error);
                },
                findCity: function (params, success, error) {
                    params.mode = 'json';
                    params.APPID = 'bd82977b86bf27fb59a04b61b657fb6f';
                    params._ = '1445917532233';
                    params.type = 'like';
                    params.sort = 'population';
                    params.cnt = 30;
                    $http.get({url: 'http://api.openweathermap.org/data/2.5/find', params: params, method: 'GET'}, config).
                        success(success).
                        error(error);
                }
            };
        }]);

    }]);