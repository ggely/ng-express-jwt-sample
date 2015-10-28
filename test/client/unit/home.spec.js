describe('Service: Storage', function () {
    var $q,
        $rootScope,
        $scope,
        mockStorage,
        mockUsers,
        mockCities;

    var forecastData = {
        "city": {
            "id": 12345,
            "name": "Moscow",
            "coord": {
                "lon": 37.615555,
                "lat": 55.75222
            },
            "country": "RU",
            "population": 0,
            "sys": {"population": 0}
        },
        "cod": "200",
        "message": 0.0061,
        "cnt": 40,
        list: [{
            "dt": 1446044400,
            "main": {
                "temp": 274.17,
                "temp_min": 274.169,
                "temp_max": 274.17,
                "pressure": 1013.21,
                "sea_level": 1033.86,
                "grnd_level": 1013.21,
                "humidity": 76,
                "temp_kf": 0
            },
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10n"
                }
            ],
            "clouds": {"all": 56},
            "wind": {
                "speed": 6.67,
                "deg": 343.503
            },
            "rain": {"3h": 0.0025},
            "snow": {"3h": 0.0025},
            "sys": {"pod": "n"},
            "dt_txt": "2015-10-28 15:00:00"
        },
            {
                "dt": 1446055200,
                "main": {
                    "temp": 273.25,
                    "temp_min": 273.246,
                    "temp_max": 273.25,
                    "pressure": 1015.08,
                    "sea_level": 1035.94,
                    "grnd_level": 1015.08,
                    "humidity": 74,
                    "temp_kf": 0
                },
                "weather": [
                    {
                        "id": 800,
                        "main": "Clear",
                        "description": "sky is clear",
                        "icon": "01n"
                    }
                ],
                "clouds": {"all": 44},
                "wind": {
                    "speed": 5.9,
                    "deg": 346.001
                },
                "rain": {},
                "snow": {"3h": 0.01875},
                "sys": {"pod": "n"},
                "dt_txt": "2015-10-28 18:00:00"
            }]
    };
    var current = {
        "coord": {"lon": 145.77, "lat": -16.92},
        "weather": [{"id": 800, "main": "Clear", "description": "Sky is Clear", "icon": "01n"}],
        "base": "cmc stations",
        "main": {
            "temp": 294.919,
            "pressure": 1011.83,
            "humidity": 100,
            "temp_min": 294.919,
            "temp_max": 294.919,
            "sea_level": 1029.48,
            "grnd_level": 1011.83
        },
        "wind": {"speed": 3.42, "deg": 135.503},
        "clouds": {"all": 0},
        "dt": 1446039458,
        "sys": {"message": 0.0039, "country": "AU", "sunrise": 1445974855, "sunset": 1446020440},
        "id": 12345,
        "name": "Cairns",
        "cod": 200
    };

    var cityInfos = {
        forecastData: forecastData,
        current: current
    };

    beforeEach(angular.mock.module('logienApp'));


    beforeEach(function (done) {
        var mockStorage = {};
        var mockCities = {};
        var mockUsers = {};
        module('logienApp', function ($provide) {
            $provide.value('Storage', mockStorage);
            $provide.value('Cities', mockCities);
            $provide.value('Users', mockUsers);
        });

        inject(function () {
            mockStorage.loadCityData = function (ids) {
            };
            mockStorage.getCityData = function (id, success) {
                return (cityInfos);
            };
            mockCities.query = function (arg, success) {
                var cities = [
                    {
                        "ref": 12345,
                        "name": "Paris",
                        "country": "FR",
                        "coord": {
                            "lon": 2.35236,
                            "lat": 48.856461
                        }
                    }];
                setTimeout(function () {
                    success(cities)
                }, 100);
                return cities;
            };
            mockCities.post = function (arg, success) {
                var addedCity = {
                    "ref": 1234598,
                    "name": "Lyon",
                    "country": "FR",
                    "coord": {
                        "lon": 2.35236,
                        "lat": 48.856461

                    }
                }
                setTimeout(function () {
                    success(addedCity)
                }, 100);
                return addedCity;
            };
            mockUsers.get = function (arg, success) {
                if (arg.controller !== 'me')return;

                var user = {
                    _id: 123456,
                    email: 'mock1@mock.com',
                    isAdmin: false
                };
                setTimeout(function () {
                    success(user)
                }, 100);
                return user;
            };
            mockUsers.getCities = function (arg, success) {
                var cities = [
                    {
                        "ref": 12345,
                        "name": "Paris",
                        "country": "FR",
                        "coord": {
                            "lon": 2.35236,
                            "lat": 48.856461
                        }
                    }];
                setTimeout(function () {
                    success(cities)
                }, 100);
                return cities;
            };
            mockUsers.addCity = function (arg, city, success) {
                var city = {
                    "ref": 54321,
                    "name": "Lyon",
                    "country": "FR",
                    "coord": {
                        "lon": 2.35236,
                        "lat": 48.856461
                    }
                };
                setTimeout(function () {
                    success(city)
                }, 100);
                return city;
            };
        });
        done();
    });
    beforeEach(function (done) {
        inject(function ($controller, $rootScope, _$location_, _Storage_, _Cities_, _Users_) {
            scope = $rootScope.$new();
            $location = _$location_;
            Storage = _Storage_;
            Cities = _Cities_;
            Users = _Users_;

            $controller('HomeCtrl',
                {$scope: scope, Storage: Storage, Cities: Cities, Users: Users});

            scope.$digest()
            setTimeout(done, 300);
        });
    });


    it('should be init with user and cities in tab cities', function (done) {

        expect(scope.me).toEqual({
            _id: 123456,
            email: 'mock1@mock.com',
            isAdmin: false
        });
        expect(scope.cities).toEqual([
            {
                "ref": 12345,
                "name": "Paris",
                "country": "FR",
                "coord": {
                    "lon": 2.35236,
                    "lat": 48.856461
                }
            }]);
        expect(scope.tab).toEqual('cities');
        expect(scope.searchCity).toEqual('');
        expect(scope.searchResult).toEqual({error: false, cities: [], count: 0});
        done();

    });
    it('should be have information of selected city', function (done) {
        var city = {
            "ref": 12345,
            "name": "Paris",
            "country": "FR",
            "coord": {
                "lon": 2.35236,
                "lat": 48.856461
            }
        };

        scope.select(city);
        expect(scope.selectedCityInfo).toEqual({city: city, infos: cityInfos});
        done()


    });
    it('should say if t he city is followed', function (done) {
        var city = {
            "ref": 12345,
            "name": "Paris",
            "country": "FR",
            "coord": {
                "lon": 2.35236,
                "lat": 48.856461
            }
        };

        expect(scope.isAFollowedCity(city)).toEqual(true);
        done();

    });
    it('should find a city by name', function (done) {
        scope.searchCity = 'par';
        scope.findCity();
        setTimeout(function () {
            expect(scope.searchResult).toEqual({
                error: false, cities: [{
                    "ref": 12345,
                    "name": "Paris",
                    "country": "FR",
                    "coord": {
                        "lon": 2.35236,
                        "lat": 48.856461
                    }
                }], count: 1
            });
            done();
        }, 300);
    });
    it('could add city', function (done) {
        var city = {
            _id:456,
            "ref": 98651,
            "name": "Lyon",
            "country": "FR",
            "coord": {
                "lon": 2.35236,
                "lat": 48.856461
            }
        };

        var validate = function () {
            expect(scope.cities.length).toEqual(2);
            expect(scope.cities[1].ref).toEqual(98651);
            done();
        };
        scope.cities=[
            {
                _id:498732,
                "ref": 12345,
                "name": "Paris",
                "country": "FR",
                "coord": {
                    "lon": 2.35236,
                    "lat": 48.856461
                }
            }];
        scope.addCity(city);
        setTimeout(function () {
            validate()
        }, 300);
    });
    it('could add only one time each city ', function (done) {
        var city = {
            _id:498732,
            "ref": 98651,
            "name": "Lyon",
            "country": "FR",
            "coord": {
                "lon": 2.35236,
                "lat": 48.856461
            }
        };

        var validate = function () {
            expect(scope.cities.length).toEqual(1);
            expect(scope.cities[0].ref).toEqual(12345);
            done();
        };
        scope.cities=[
            {
                _id:498732,
                "ref": 12345,
                "name": "Paris",
                "country": "FR",
                "coord": {
                    "lon": 2.35236,
                    "lat": 48.856461
                }
            }];
        scope.addCity(city);
        setTimeout(function () {
            validate()
        }, 300);
    });
});

