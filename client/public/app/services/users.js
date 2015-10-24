angular.module('logienApp.services', [])
    .config(['$provide', function ($provide) {
        $provide.factory('Users', function ($resource) {
            return $resource('/api/users/:id', {id: '@_id'}, {
            });
        });
    }]);