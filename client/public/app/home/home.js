angular.module('logienApp.home', [
    'logienApp.navbar',
    'ui.router'
])
    .config(function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            controller: 'HomeCtrl',
            templateUrl: 'app/home/home.html',
            data: {
                requiresLogin: true
            }
        });
    })
    .controller('HomeCtrl', function HomeController($scope, Users, Storage, Cities) {
        $scope.selectedCityInfo;
        $scope.Math = window.Math;

        var init = function () {
            $scope.tab = 'cities';
            $scope.searchCity = '';
            $scope.searchResult = {error: false, cities: [], count: 0};
        };

        init();

        $scope.me = Users.get({controller: 'me'}, function () {
            $scope.cities = Users.getCities({id: $scope.me._id}, function (cities) {
                var ids = cities.map(function (city) {
                    return city.ref;
                });
                Storage.loadCityData(ids, function (count) {
                    if (count !== 0) {
                        $scope.select($scope.cities[0]);
                    }
                });
            });
        });

        $scope.changeTab = function (name) {
            $scope.tab = name;
        };

        $scope.select = function (city) {
            $scope.selectedCityInfo = {city: city, infos: Storage.getCityData(city.ref)};
        };

        $scope.findCity = function () {
            $scope.searchResult = {error: false, cities: [], count: 0};
            if ($scope.searchCity.length >= 2) {
                Cities.query({name: $scope.searchCity}, function (data) {
                    $scope.searchResult = {error: false, cities: data, count: data.length}
                }, function () {
                    $scope.searchResult = {error: true, cities: [], count: 0};
                })
            }
        };

        $scope.isAFollowedCity = function (city) {
            return ($scope.cities.filter(function (elm) {
                return elm._id == city._id
            }).length !== 0);
        };

        $scope.addCity = function (city) {
            if (!$scope.isAFollowedCity(city)) {
                Users.addCity({id: $scope.me._id}, city, function () {
                    $scope.cities.push(city);
                    init();
                    Storage.loadCityData([city.ref]);
                });
            }
        };
    });