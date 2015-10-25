describe('Controller: UsersCtrl', function () {
    var $q,
        $rootScope,
        $scope,
        mockUsers;

    beforeEach(angular.mock.module('logienApp'));


    beforeEach(function () {
        var mockUsers = {};
        module('logienApp', function ($provide) {
            $provide.value('Users', mockUsers);
        });

        inject(function () {
            mockUsers.data = [
                {
                    email: 'mock1@mock.com',
                    _id: 0,
                    isAdmin: false
                },
                {
                    email: 'mock2@mock.com',
                    _id: 1,
                    isAdmin: false
                },
                {
                    email: 'mock2@mock.com',
                    _id: 2,
                    isAdmin: false
                }
            ];

            mockUsers.get = function (id) {
                if (id) {
                    return this.data[id];
                } else {
                    return this.data;
                }
            };

            mockUsers.query = function () {
                return this.data;
            };

            mockUsers.save = function (data, success) {
                var id = this.data.length;
                var item = {
                    _id: id,
                    email: data.email,
                    isAdmin: false
                };
                delete (item.password);
                this.data.push(item);
                return success ? success(item) : item;
            };
        });
    });

    beforeEach(inject(function ($controller, $rootScope, _$location_, _Users_) {
        scope = $rootScope.$new();
        $location = _$location_;
        Users = _Users_;

        $controller('UsersCtrl',
            {$scope: scope, Users: Users});

        scope.$digest();
    }));

    it('should contain all the users at startup', function () {
        expect(scope.users).toEqual([
            {
                email: 'mock1@mock.com',
                _id: 0,
                isAdmin: false
            },
            {
                email: 'mock2@mock.com',
                _id: 1,
                isAdmin: false
            },
            {
                email: 'mock2@mock.com',
                _id: 2,
                isAdmin: false
            }
        ]);
    });
    it('should create user', function () {
        scope.newUser = {
            email: 'mock@mock.com',
            password: 'toto'
        };
        scope.addNewUser();
        expect(scope.users).toEqual([
            {
                email: 'mock1@mock.com',
                _id: 0,
                isAdmin: false
            },
            {
                email: 'mock2@mock.com',
                _id: 1,
                isAdmin: false
            },
            {
                email: 'mock2@mock.com',
                _id: 2,
                isAdmin: false
            },
            {
                email: 'mock@mock.com',
                _id: 3,
                isAdmin: false
            }
        ]);
    });
    it('should modify email', function () {
        scope.select({
            email: 'mock1@mock.com',
            _id: 0,
            isAdmin: false
        });
        scope.modifiedUser = {
            email: 'mock@mock.com',
        };
        scope.modifyEmail();
        expect(scope.result).toEqual({success: true, error: false});
        expect(scope.selectedUser).toEqual({
            email: 'mock@mock.com',
            _id: 0,
            isAdmin: false
        });
    });
    it('should modify password', function () {
        scope.select({
            email: 'mock2@mock.com',
            _id: 0,
            isAdmin: false
        });
        scope.modifiedUser = {
            password: 'mockPassword',
        };
        scope.modifyPassword();
        expect(scope.result).toEqual({success: true, error: false});
        expect(scope.modifiedUser).toEqual({
            _id: 0,
            email: 'mock2@mock.com',
            password: ''
        });
    });
});