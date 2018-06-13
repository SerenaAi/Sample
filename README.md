# Gallery Sample
### What is it?
The **Gallery Sample** is an image gallery website that allows users to host and post pictures online by registering and signing-in into their account. It makes use of [AngularJS](https://angularjs.org/) and [Bootstrap](https://getbootstrap.com/) on the client-side and Node.js on the back end. It utilizes [SQLite3](https://www.sqlite.org/) database in order store the user's data.

### How is the code structured?
The root directory is composed of two directories, the first one `app/` contains the client-side codebase, while the second directory `server/` contains all server-side code. The SQLite3 database can be found under the `server/bin` folder.

### How to Install it and Run it?
The **Gallery Sample** app can be easily installed using npm. Here are the steps on how to get started:

1. Install [Node.js](https://nodejs.org/) along [npm](https://www.npmjs.com/get-npm) (Usually npm is installed with Node.js) *
2. $ git clone https://github.com/aishikoyo/Sample.git
3. $ cd Sample/
4. $ npm install
5. $ node server/src 
6. Open your browser, go to `http://localhost:8001`

You should be able to see the app running, enjoy playing with it. :coffee:

**Notes:** 
1. It's best to install Node.js through your distribution package manager. You can find more information in the **Node.js's** [website](https://nodejs.org/en/download/package-manager/).
2. The server will listen on port 8001

### How to Test the Project?
Software testing is a key component of this project, therefore, I have included the required testing files which are located under `server/tests`. You can simply run these tests using the terminal command:

    $ npm test

Faily easy right? Just make sure to first navigate to the project's directory and don't forget to start the server prior to run the test suite.

### Design Documents
##### Database design
Use logical data modeling techniques to design database tables:

![alt text](/logical_data_model.png)

Create database tables using sql:
```sql
CREATE TABLE Picture (
    p_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    u_id  TEXT NOT NULL,
    name  TEXT,
    description   TEXT,
    url   TEXT NOT NULL,
    FOREIGN KEY (u_id) REFERENCES User (u_id)
);

CREATE TABLE User (
    u_id  TEXT PRIMARY KEY,
    name  TEXT,
    photo BLOB,
    description   TEXT,
    password  TEXT NOT NULL
);
```

### Code Examples
The following code samples describe parts of the codebase that are currently being used in order to handle certain functionality within the app.

##### Example 1
The following code snippet is part of the server-side Javascript code that handles user login requests. The server side middle-ware Express.js will route a request to a callback function. In this case, it takes the 'POST' request from  `/users/login` and routes it to the `login` function:

```javascript
// Route to the login function in user module
expressHandler.post('/users/login', user.login);
```

For the snippet below, `req` and `res` are the request and response objects, `req` contains information about the HTTP request. `res` is responsible for sending back an HTTP response.

```javascript
    ...

exports.login = (req, res) => {
    // Set response headers
    // Make sure to allow Cross-origin resource sharing (CORS)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Send back Json object
    res.setHeader('Content-Type', 'application/json');
    // If there is no userId in the request data, send back error state and message
    if (!req.body.userId) {
        res.send(JSON.stringify(new Response(false, "User ID is required")));
        return;
    }
    // If there is no password in the request data, send back error state and message
    if (!req.body.password) {
        res.send(JSON.stringify(new Response(false, "Password is required")));
        return;
    }
    // Check database to see if there is a match
    checkIdAndPassword(req.body.userId, req.body.password).then(ret => {
        // If ret is true, there is a match, otherwise send back a Response object with the error state and error message
        if (ret) {
            // Create and save a session        
            req.session.uid = req.body.userId;
            req.session.save();
            res.send(JSON.stringify(new Response(true, "Login success")));
        } else {
            res.send(JSON.stringify(new Response(false, "UserId and password doesn't match")));
        }
    }).catch(err => {
        // Catches any errors returned from 'checkIdAndPassword' and output an error message
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};

    ...
```

##### Example 2    
The following code is part of AngularJS in the client-side which shows how the `HeaderController` handles the data and logic in `header` view.

What does the `header` view contains?

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

The `ng-model` is the AngularJS syntax that binds what's in `<Input>` to the `$scope.login` object in the controller. And the `ng-click` tells angular to run the `signin()` function when the `'Sign In'` button is clicked.

Here is the controller side:

```javascript
app.controller('HeaderController', function($scope, $location, HttpService, UtilService, $timeout, $cookies) {
        ...
        
    $scope.login = {
        userId: undefined,
        password: undefined
    };

    $scope.signin = function() {
    // Send post http request to server, with login information as payload
        HttpService.post('/users/login', $scope.login).then(function(res) {
            if (res.success) {
                // When login success, get the userId and save it in 'client_cookie', 
                // so that the value is shared between views on the client-side
                $cookies.put('client_cookie', $scope.login.userId);
                // Angular route to home view
                $location.path('/');
                // Show success message
                UtilService.showSuccessMessage("Sign in success!");
            } else {
                // If login fails, show error message in alert box
                UtilService.showErrorMessage(res.message);
            }
        }, function(err) {
            // If login request fails, create an alert for it
            UtilService.showErrorMessage("Sign in fails, please check your internect connection.");
        });
    }
      
    ...   
```

##### Example 3    
Data in AngularJS service can be shared by all AngularJS controllers. In this case, I put a
`isLogin` boolean into the service called `UtilService` to indicate whether user is logged in or not. So that controllers can make UI changes base on this value. `isLogin` gets its value by watching if cookie exist. 


```javascript
app.service('UtilService', function($timeout, $rootScope, $cookies) {
    //This property indicates if user is currently logged in
    service.isLogin = false;

    ...

    //Watch for any changes in $cookies.get('client_cookie'),
    //if $cookies.get('client_cookie') is null, there is no session
    //or the current session is destroyed, which indicates a logout from the system.
    //Watch changes in this value and change isLogin state accordingly
    $rootScope.$watch(function() {
        return $cookies.get('client_cookie');
    }, function() {
        if ($cookies.get('client_cookie')) {
            service.isLogin = true;
        } else {
            service.isLogin = false;
        }
    });

    ...   
```

### From the developer
Thank you for taking time to read this! Please feel free to contact me if you run into any problems. :blush:
