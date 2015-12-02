authModule.factory('AuthInterceptor',function($q, $window, BaseSettings, AuthService) {
	
	/**
	 * Intercepta a requisição e a adiciona o token como cabeçalho
	 */
	var addTokenToRequest = function(config) {
		config = config || {};
        config.headers = config.headers || {};
        if (AuthService.hasAuthenticatedUser()) {
            config.headers[BaseSettings.TokenHeaderName] = AuthService.getToken();
        }
        return config;
	};
	
	/**
	 * Intercepta a resposta quando ocorre erro 401
	 */
	var handleAuthorizationError = function(response) {
		AuthService.clearUserInfo();
	};
	
	var requestInterceptor = {
		request: addTokenToRequest,
		responseError: function(response) {
			if (response.status == 401) { //sem autorização!
				handleAuthorizationError(response);
			}
			return $q.reject(response);
		}
	};

	return requestInterceptor;
});


authModule.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.headers.common["Accept"] = "application/json;charset=UTF-8";
	$httpProvider.interceptors.push('AuthInterceptor');
}]);
