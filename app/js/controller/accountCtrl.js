app.controller('AccountController', function($scope, HttpService, UtilService, $location, Upload, $timeout, $cookies) {
    //If there is a picture upload error
    $scope.isPictureError = false;
    $scope.pictureErrorMessage = "";
    //If picture is ready for upload
    $scope.isReadyToUploadPicture = false;
    //If there is spinner on "Upload" button
    $scope.spinnerStatus = false;
    //User information is stored in here
    $scope.user = {
        username: undefined,
        description: undefined,
        photo: undefined
    };
    //Picture information is stored in here
    $scope.picture = {
    	file: undefined,
        name: undefined,
        desc: undefined
    };
    //Everytime when user uploaded a new picture, the $scope.picture.file object will change
    //Detect this change and run callback function
    $scope.$watch('picture.file', function() {
    	console.log($scope.picture.file)
    	//Reset picture error state
        $scope.isPictureError = false;
        //Reset the ready to upload state
        $scope.isReadyToUploadPicture = false;
        //$scope.picture.file is null when the file type is not a valid image format
        //In this case, give user an error alert
        if ($scope.picture.file === null) {
            //show error message
            $scope.pictureErrorMessage = "The file you choose must be in image format.";
            $scope.isPictureError = true;
        }  else {
            //$scope.picture.file is not null or undefined
            if ($scope.picture.file) {
                //if file length is zero, show error message
                if ($scope.picture.file.size == 0) {
                    $scope.pictureErrorMessage = "File length cannot be zero.";
                    $scope.isPictureError = true;
                } else {
                    //if file length is not zero, okay to upload
                    $scope.isReadyToUploadPicture = true;
                }
            }
        }
    });
    //Call this when user clicked the "Upload" button
    //It will send request to server to upload the picture
    $scope.uploadPicture = function() {
        //Spinner shows up for at least 400ms
        $scope.spinnerStatus = true;
        $timeout(function() {
        	//This is a ng-file-upload function
            Upload.upload({
                url: '/pictures',
                method: 'POST',
                data: {
                    pictureName: $scope.picture.name,
                    pictureDescription: $scope.picture.desc,
                    file: $scope.picture.file
                }
            }).then(function(ret) {
            	//When picture is successfully added
                if (ret.data.success) {
                	UtilService.showSuccessMessage("Upload success!");
	                //Clear picture information
                    $scope.picture.file = undefined;
                    $scope.picture.name = undefined;
                    $scope.picture.desc = undefined;
                } else {
                	UtilService.showErrorMessage(ret.data.message);
                }
                $scope.spinnerStatus = false;
            }, function(err) {
            	//When there is an error uploading picture
            	UtilService.showErrorMessage("Upload fails, please check your internet connection");
                $scope.spinnerStatus = false;
            }, function(evt) {
            	console.log(evt);
            });
        }, 400);
    };
    //Call this when user clicked the camara icon button
    //It will send request to server to upload user's photo
    $scope.uploadPhoto = function(photofile, errFile) {
    	console.log(photofile)
        if (photofile) {
            Upload.upload({
                url: '/users',
                method: 'PUT',
                data: {
                    file: photofile
                }
            }).then(function(ret) {
                if (ret.data.success) {
                	UtilService.showSuccessMessage("Your photo is updated!");
	                if(ret.data.data){
		                $scope.user.description = ret.data.data.u_description;
		                $scope.user.photo = ret.data.data.u_photo;
	                }
                } else {
                	UtilService.showErrorMessage(ret.data.message);
                }
            }, function(err) {
            	UtilService.showErrorMessage("Upload fails, please check your internet connection");
            }, function(evt) {
                console.log(evt);
            });
        }
    };

    //Call every time when this controller is initialized
    var init = function() {
        //send http get request to server, to get user information
        HttpService.get('/users').then(function(res) {
            if (res.success) {
                $scope.user.username = res.data.u_name;
                $scope.user.description = res.data.u_description;
                $scope.user.photo = res.data.u_photo;
            } else {
            	UtilService.showErrorMessage(res.message);
                $cookies.remove('client_cookie');
                $location.path('/');
            }
        }, function(err) {
     		UtilService.showErrorMessage(err);
        });
    };
    init();
});