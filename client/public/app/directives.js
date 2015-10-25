angular.module('logienApp.validations', []).directive('available', function (Users, $q) {
    return {
        require: 'ngModel',
        restrict: "A",
        scope: {user: '=user', admin: "@admin"},
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.available = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                if ((!scope.admin && !scope.user) || (!scope.user || scope.user.email == value)) {
                    return $q.when(true);
                }
                return Users.validateEmail(({_id: scope.user._id, email: value}), function resolved() {
                    return true;
                }, function rejected() {
                    return false;
                }).$promise;
            };
        }
    };
}).directive('validateEmail', function () {
    var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    return {
        require: 'ngModel',
        restrict: '',
        link: function (scope, elm, attrs, ctrl) {
            if (ctrl && ctrl.$validators.email) {
                ctrl.$validators.email = function (modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});