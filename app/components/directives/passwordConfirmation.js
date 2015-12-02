dengueWebApp.directive('passwordConfirmation', function() {
    return {
        require: 'ngModel',
        scope: {
            originalPassword: "=passwordConfirmation"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.passwordConfirmation = function(modelValue, viewValue) {
                if (ngModel.$isEmpty(modelValue)) {
                    return true;
                }

                return modelValue ===  scope.originalPassword;
            };

            scope.$watch("originalPassword", function() {
                ngModel.$validate();
            });
        }
    };
});