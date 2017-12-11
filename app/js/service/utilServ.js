//This service defines functions and variables that is shared by
//all controllers
app.service('UtilService', function($timeout, $rootScope, $cookies) {
    var service = {};
    //This property indicates if there is an error,
    //if the value is true, then show the error message box,
    //otherwise hide the message box
    service.isError = false;
    //This property stores the error message
    service.errorMessage = "";
    //This property indicates if there is a success,
    //if the value is true, then show the success message box,
    //otherwise hide the message box
    service.isSuccess = false;
    //This property stores the success message
    service.successMessage = "";
    //This property indicates if user is currently logged in
    service.isLogin = false;
    //This function allows other part of the view to show error
    //message box for 4 seconds
    service.showErrorMessage = function(message) {
        service.errorMessage = message;
        service.isError = true;
        $timeout(function() {
            service.isError = false;
        }, 4000);
    };
    //This function allows other part of the view to show success
    //message box for 4 seconds
    service.showSuccessMessage = function(message) {
        service.successMessage = message;
        service.isSuccess = true;
        $timeout(function() {
            service.isSuccess = false;
        }, 4000);
    };
    //Watch for any changes in $cookies.get('client_cookie'),
    //if $cookies.get('client_cookie') is null, there is no session
    //or the current session is destroyed, which indicates a logout of the system.
    //Watch changes in this value and change isLogin flag accordingly
    $rootScope.$watch(function() {
        return $cookies.get('client_cookie');
    }, function() {
        if ($cookies.get('client_cookie')) {
            service.isLogin = true;
        } else {
            service.isLogin = false;
        }
    });
    return service;
});