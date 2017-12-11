app.controller('SignUpController', function($scope, HttpService, $location, UtilService) {
    //Stores user input information
    $scope.users = {
        userId: undefined,
        password: undefined,
        username: undefined
    };
    //Indicates whether the userId is available or not
    //If the value is false, tell user to use a different userId
    $scope.isIdAvailable = true;
    $scope.submit = function() {
        HttpService.post('/users', $scope.users).then(function(res) {
            if (res.success) {
                //Show success message
                UtilService.showSuccessMessage('You just created a new account!');
                $location.path('/');
            } else {
                UtilService.showErrorMessage(res.message);
            }
        }, function(err) {
            UtilService.showErrorMessage("Cannot send your request, please check the internect connection.");
        });
    };
    //Call this function whenever there is a change in $scope.users.userId
    $scope.checkUserId = function() {
        $scope.isIdAvailable = true;
        if (!$scope.users.userId) return;
        HttpService.get(['/users/check', $scope.users.userId].join('/')).then(function(res) {
            $scope.isIdAvailable = res.success;
        }, function(err) {
            console.log(err);
        });
    };
});