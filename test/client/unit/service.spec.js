describe('Service: Storage', function () {
    var $q,
        $rootScope,
        $scope,
        mockWeatherAPi;

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
    }

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
    }

    beforeEach(angular.mock.module('logienApp'));


    beforeEach(function () {
        var mockWeatherAPi = {};
        module('logienApp', function ($provide) {
            $provide.value('WeatherApi', mockWeatherAPi);
        });

        inject(function () {
            mockWeatherAPi.getForecast = function (id, success) {
                success(forecastData);
            };
            mockWeatherAPi.getCurrent = function (id, success) {
                success(current);
            };
        });
    });

    beforeEach(inject(function ( _Storage_) {
        storageService = _Storage_;
    }));

    it('should load cities datas', function (done) {
        storageService.loadCityData([12345]);
        setTimeout(function () {
            expect(storageService.datas[12345].forecast).toEqual(
                forecastData
            );
            expect(storageService.datas[12345].current).toEqual(
                current
            );
            done();
        }, 500);

    });

    it('should get return datas for a given city', function () {
        storageService.loadCityData([12345]);
        infos = storageService.getCityData(12345);
        expect(infos.forecast).toEqual(
            forecastData
        );
        expect(infos.current).toEqual(
            current
        );
    });
});

