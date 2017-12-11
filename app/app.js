//Here the AngularJs begins
//Create angular module and define external dependencies
let app = angular.module('sample', ['ngRoute', 'ngResource', 'ngFileUpload', 'ngSessionStorage', 'ngCookies']);
//This is a single page application(no page reloading), but I still wants to 
//navigate to different "pages"(templates). The $routeProvider does the job by
//providing routing to templates
app.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.when("/home", {
        templateUrl: "templates/home.html",
        controller: "HomeController"
    }).when("/account", {
        templateUrl: "templates/account.html",
        controller: "AccountController"
    }).when("/signup", {
        templateUrl: "templates/signUp.html",
        controller: "SignUpController"
    })
    $routeProvider.otherwise({
        redirectTo: '/home'
    });
});
//This controller gets data in UtilService and bind the data to index.html
app.controller('AppController', function($scope, UtilService) {
    $scope.closeErrorBox = function() {
        UtilService.isError = false;
    };
    $scope.getIsError = function() {
        return UtilService.isError;
    };
    $scope.getErrorMessage = function() {
        return UtilService.errorMessage;
    };
    $scope.closeSuccessBox = function() {
        UtilService.isSuccess = false;
    };
    $scope.getIsSuccess = function() {
        return UtilService.isSuccess;
    };
    $scope.getSuccessMessage = function() {
        return UtilService.successMessage;
    };
});