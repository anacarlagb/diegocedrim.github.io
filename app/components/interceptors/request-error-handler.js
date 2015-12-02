angular.module("dengueWebApp").service('RequestErrorHandler', function($location, $rootScope) {
	
	this.handle = function(requestError) {
		if (requestError.data && requestError.data.errors) {
			$rootScope.errorMessage = "Erro ao requisitar: " + requestError.data.errors[0].message;
		} else {
			$rootScope.errorMessage = "Erro ao requisitar";
			//TODO mudar esse tratamento e tradução ao melhorar o gerenciamento de erros
		}
		
	};
	
});
