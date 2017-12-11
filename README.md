## Gallery Sample
### What's this
This is a sample gallery website which allows user to sign up, sign in and post pictures. It uses AngularJs, Bootstrap on the client-side and NodeJs on the server-side. It uses Sqlite3 database to store user data.

### Project directory
Server-related source code is in `server/src`. Sqlite database is in `server/bin` folder. Client-side code, assets, libs are inside `app` folder.

### How to install and run
You can follow the instructions below:
1. Install [nodejs and npm](https://nodejs.org/)
2. Download the project folder
3. Open the terminal, go to the project directory:
    * run `npm install` to install all the dependencies
    * run `node server/src` to start the server - note the server will be  listening to port 8001
4. Open your browser, go to `http://localhost:8001`

Now you can see the website runing, enjoy playing with it. :coffee:


### How to test this project

This project includes testing files, they are located under `server/tests`. You can simply run those tests using terminal command `npm test`. That sounds so easy right? But make sure you nav to the project directory first and... don't forget to start the server.


### Code examples

EX 1. This is a piece of server-side javascript code that handles user login request. The server side middle-ware ExpressJs will route a request to a callback function. In this case, it takes the 'Post' request from 	`'/users/login'` and route it to the `login` function:

```javascript
    //Route to the login function in user module
    expressHandler.post('/users/login', user.login);
```

`'req'` and `'res'` are the request and response object, `'req'` contains information about HTTP request. `'res'` is responsible for sending back HTTP response.

```javascript
    ...

  exports.login = (req, res) => {
    //Set response headers
    //Make sure to allow Cross-origin resource sharing (CORS)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //Send back Json object
    res.setHeader('Content-Type', 'application/json');
    //If there is no userId in the request data, send back error state and message
    if (!req.body.userId) {
        res.send(JSON.stringify(new Response(false, "User ID is required")));
        return;
    }
    //If there is no password in the request data, send back error state and message
    if (!req.body.password) {
        res.send(JSON.stringify(new Response(false, "Password is required")));
        return;
    }
    //Check database to see if there is a match
    checkIdAndPassword(req.body.userId, req.body.password).then(ret => {
        //If ret is true, there is a match, otherwise send back a Response object with the error state and error message
        if (ret) {
            //Create and save a session		
            req.session.uid = req.body.userId;
            req.session.save();
            res.send(JSON.stringify(new Response(true, "Login success")));
        } else {
            res.send(JSON.stringify(new Response(false, "UserId and password doesn't match")));
        }
    }).catch(err => {
        //Catches any errors returned from 'checkIdAndPassword' and output an error message
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
  };

    ...
```
    
EX 2. This is AngularJs code that shows how the `'HeaderController'` handles the data and logic in `header` view.

What's in `header`:
```html
    ...
    
  <input class="form-control mr-sm-2" ng-model="login.userId" placeholder="AccountID" type="text">
    <input class="form-control mr-sm-2" ng-model="login.password" placeholder="Password" type="password">
      <button class="btn btn-outline-success my-2 my-sm-0" ng-click="signin()">
        Sign In
      </button>
    </input>
  </input>
    
    ...   
```



The `'ng-model'` is the angular syntax that binds what's in `<Input>` to the `$scope.login` object in the controller. And the `'ng-click'` tell angular to run `'signin()'` function when the `'Sign In'` button is clicked.

Here is the controller:


```javascript
  app.controller('HeaderController', function($scope, $location, HttpService, UtilService, $timeout, $cookies) {
		...
        
   	$scope.login = {
    	userId: undefined,
	    password: undefined
	};

    $scope.signin = function() {
    //Send post http request to server, with login information as payload
        HttpService.post('/users/login', $scope.login).then(function(res) {
            if (res.success) {
    		  	//When login success, get the userId and save it in 'client_cookie', so that the value is shared between views on the client-side
                $cookies.put('client_cookie', $scope.login.userId);
                //Angular route to home view
                $location.path('/');
                //Show success message
                UtilService.showSuccessMessage("Sign in success!");
            } else {
                //If login fails, show error message in alert box
                UtilService.showErrorMessage(res.message);
            }
        }, function(err) {
            //If login request fails, create an alert for it
            UtilService.showErrorMessage("Sign in fails, please check your internect connection.");
        });
    }
      
    ...   
```

### From the developer

Thank you for taking time to read this! Please feel free to contact me if you run into any problems. :blush: