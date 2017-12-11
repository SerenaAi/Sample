app.controller('HomeController', function($scope, HttpService, UtilService, $location) {
    //All picture information from server are stored in here
    $scope.pictures = [];
    //if picture list is empty or not
    $scope.hasPictures = false;
    //Stores the clicked image url
    $scope.currentImageUrl = null;
    //Angular route to signup view
    $scope.signup = function() {
        $location.path('/signup');
    };
    $scope.getIsLogin = function() {
        return UtilService.isLogin;
    };
    $scope.setCurrentImageUrl = function(imgUrl) {
        $scope.currentImageUrl = imgUrl;
    };
    //When the controller is initialized, get all pictures from server
    var getAllPictures = function() {
        //Sent http get request to server to get all pictures
        HttpService.get('/pictures').then(function(res) {
            if (res.success) {
                //Store painting information returned from server
                $scope.pictures = res.data;
                if ($scope.pictures.length > 0) {
                    $scope.hasPictures = true;
                }
            } else {
                //Create an alert for error message returned from server.
                UtilService.showErrorMessage(res.message);
            }
        }, function(err) {
            //If http request fails, create alert for it
            UtilService.showErrorMessage("Cannot get painting information, please check the internect connection.");
        });
    };
    getAllPictures();
});
