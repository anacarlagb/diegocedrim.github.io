var baseSettings = angular.module("baseSettings", []);

baseSettings.constant("BaseSettings", {
	TokenHeaderName: "X-Auth-User-Token",
	AuthBaseURL: "http://localhost:8080/dengue-api/",
	ApiBaseURL: "http://localhost:8080/dengue-api/",
	DefaultLocation: "/",
	//AuthBaseURL: "http://dengue.les.inf.puc-rio.br/desenv/api/",
	//ApiBaseURL: "http://dengue.les.inf.puc-rio.br/desenv/api/",
	FacebookAppId: "356912444512038",
	BaseShareURL: "http://dengue.les.inf.puc-rio.br/desenv/"
});
