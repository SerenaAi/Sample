//This controller includes data and logic for 'header' view
app.controller('HeaderController', function($scope, $location, HttpService, UtilService, $timeout, $cookies) {
    //Information needed to login
    $scope.login = {
        userId: undefined,
        password: undefined
    };
    $scope.getIsLogin = function() {
        return UtilService.isLogin;
    };
    //'client_cookies' stores the user id of the user logged in,
    //This function is to get the user id
    $scope.getCurrentUserId = function() {
        return $cookies.get('client_cookie');
    };
    //Call this when user clicked the 'Sign in' buttom, 
    $scope.signin = function() {
        //Send post http request to server, with login information as payload
        HttpService.post('/users/login', $scope.login).then(function(res) {
            if (res.success) {
                //When login success, get the userId and save it in 'client_cookie',
                //so that the value is shared between views on the client-side
                $cookies.put('client_cookie', $scope.login.userId);
                //Angular route to home view
                $location.path('/');
                //Show success message
                UtilService.showSuccessMessage("Sign in success!");
            } else {
                //If login fails, show error message
                UtilService.showErrorMessage(res.message);
            }
        }, function(err) {
            //If login request fails, create alert for it
            UtilService.showErrorMessage("Sign in fails, please check your internect connection.");
        });
    };
    //Call this when user click the 'Sign out' buttom, 
    $scope.signout = function() {
        //Send get http request to server
        HttpService.get('/users/logout').then(function(res) {
            if (res.success) {
                //When logout success, destroy the 'client_cookies'
                $cookies.remove('client_cookie');
                //Angular route to home view
                $location.path('/');
            } else {
                //If logout fails, show error message for 4s
                UtilService.showErrorMessage(res.message);
            }
        }, function(err) {
            //If logout request fails, create alert for it
            UtilService.showErrorMessage("Sign out fails, please check your internect connection.");
        });
    };
});