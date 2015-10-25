describe('Controller: SettingsCtrl', function () {
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
            mockUsers.me = {
                email: 'mock1@mock.com',
                _id: 0,
                isAdmin: false
            };

            mockUsers.get = function (id) {
                if (id) {
                    return this.me;
                } else {
                    return;
                }
            };

            mockUsers.save = function (data, success) {
                var item = {
                    _id: data._id,
                    email: data.email,
                    isAdmin: false
                };
                delete (item.password);
                return success ? success(item) : item;
            };
        });
    });

    beforeEach(inject(function ($controller, $rootScope, _$location_, _Users_) {
        scope = $rootScope.$new();
        $location = _$location_;
        Users = _Users_;

        $controller('SettingsCtrl',
            {$scope: scope, Users: Users});

        scope.$digest();
    }));

    it('should contain me at startup', function () {
        expect(scope.me).toEqual(
            {
                email: 'mock1@mock.com',
                _id: 0,
                isAdmin: false
            }
        );
    });

    it('should modify email', function () {
        scope.modifiedUser = {
            email: 'mock1@mock.com',
            _id: 0,
            isAdmin: false
        };
        scope.modifyEmail();
        expect(scope.result).toEqual({success: true, error: false});
        expect(scope.me).toEqual({
            email: 'mock1@mock.com',
            _id: 0,
            isAdmin: false
        });
    });
    it('should modify password', function () {
        scope.modifiedUser={
            email: 'mock1@mock.com',
            _id: 0,
            isAdmin: false,
            password: 'mockPassword'
        };
        scope.modifyPassword();
        expect(scope.result).toEqual({success: true, error: false});
        expect(scope.me).toEqual({
            email: 'mock1@mock.com',
            _id: 0,
            isAdmin: false,
        });
    });
});