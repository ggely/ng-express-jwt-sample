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
        $scope.getDate = function (date) {
            var formattedDate = new Date(date*1000);
            return moment(formattedDate).format('D MMM');
        };
        $scope.getTime = function (date) {
            var formattedDate = new Date(date*1000);
            return moment(formattedDate).format('H');
        };

        var init = function () {
            $scope.tab = 'cities';
            $scope.weather = 'current';
            $scope.searchCity = '';
            $scope.searchResult = {error: false, cities: [], count: 0};
        };

        init();

        $scope.me = Users.get({controller: 'me'}, function () {
            $scope.cities = Users.getCities({id: $scope.me._id}, function (cities) {
                var ids = cities.map(function (city) {
                    return city.ref;
                });
                Storage.loadCityData(ids).then(function () {
                    $scope.select($scope.cities[0]);
                });
            });
        });

        $scope.changeTab = function (name) {
            $scope.tab = name;
        };
        $scope.changeWeather = function (name) {
            $scope.weather = name;
        };


        $scope.select = function (city) {
            if (city) {
                var storageInfos = Storage.getCityData(city.ref);
                var infos = {
                    current: {
                        icon: storageInfos.current.weather[0].icon,
                        description: storageInfos.current.weather[0].description,
                        temp: Math.round(storageInfos.current.main.temp),
                        wind: storageInfos.current.wind.speed,
                        humidity: storageInfos.current.main.humidity,
                        pressure: storageInfos.current.main.pressure,
                        precipitation: Math.round(((storageInfos.current.rain || {'3h': 0})['3h'] || 0) / 3)
                    },
                    forecast: []
                };
                storageInfos.forecast.list.forEach(function (elm) {
                    var info = {
                        date: elm.dt,
                        icon: elm.weather[0].icon,
                        description: elm.weather[0].description,
                        temp: Math.round(elm.main.temp)
                    };
                    infos.forecast.push(info);
                });


                $scope.selectedCityInfo = {city: city, infos: infos};
            }
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