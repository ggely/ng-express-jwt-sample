angular.module('logienApp.services', [])
    .config(['$provide', function ($provide) {
        $provide.factory('Users', function ($resource) {
            return $resource('/api/users/:id/:controller', {id: '@_id', controller: '@_controller'}, {
                validateEmail: {
                    method: 'GET', isArray: false,
                    params: {controller: 'email'}
                }
            });
        });
    }]);