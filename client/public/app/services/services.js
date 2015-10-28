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

        $provide.factory('WeatherApi', function () {
            return {
                getForecast: function (id, success, error) {
                    $.ajax({
                        url: 'http://api.openweathermap.org/data/2.5/forecast',
                        data: {id: id, APPID: '50f333d54cf1024253df432c0316ad2b', units: 'metric'},
                        type: "GET",
                        success: function (data) {
                            success(data)
                        },
                        error: function (err) {
                            if (error) error(err);
                        }
                    });
                },
                getHistory: function (id, success, error) {
                    var start = new Date();
                    var end = new Date(start);
                    end.setDate(end.getDate() - 5);
                    end = Math.floor(end.getTime() / 1000);
                    start = Math.floor(start.getTime() / 1000);
                    $.ajax({
                        url: 'http://api.openweathermap.org/data/2.5/history/city',
                        data: {
                            id: id,
                            APPID: '50f333d54cf1024253df432c0316ad2b',
                            start: start,
                            end: end,
                            units: 'metric'
                        },
                        type: "GET",
                        success: function (data) {
                            success(data)
                        },
                        error: function (err) {
                            if (error) error(err);
                        }
                    });
                },
                getCurrent: function (id, success, error) {
                    var start = new Date();
                    var end = new Date(start);
                    end.setDate(end.getDate() - 5);
                    $.ajax({
                        url: 'http://api.openweathermap.org/data/2.5/weather',
                        data: {id: id, APPID: '50f333d54cf1024253df432c0316ad2b', units: 'metric'},
                        type: "GET",
                        success: function (data) {
                            success(data)
                        },
                        error: function (err) {
                            if (error) error(err);
                        }
                    });
                }
            }
        }),

            $provide.service('Storage', function (WeatherApi) {
                var datas = this.datas = {};
                this.loadCityData = function (ids, cb) {
                    if (ids && ids.length) {
                        var count=0;
                        ids.forEach(function (id) {
                            WeatherApi.getForecast(id, function (data) {
                                datas[id] = datas[id] || {};
                                datas[id].forecast = data;
                                if(datas[id].current){
                                    count++;
                                    if(count==ids.length){cb(count)}
                                }
                            });
                            /*   WeatherApi.getHistory(id, function (data) { //invalid key
                             datas[id] = datas[id] || {};
                             datas[id].historic = data;
                             });*/
                            WeatherApi.getCurrent(id, function (data) {
                                datas[id] = datas[id] || {};
                                datas[id].current = data;
                                if(datas[id].forecast){
                                    count++;
                                    if(count==ids.length){cb(count)}
                                }
                            })
                        })
                    }
                };
                this.getCityData = function (id) {
                    return this.datas[id];
                }
            });

    }]);
