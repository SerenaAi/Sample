app.service('HttpService', function($http, $q) {
    var service = {};
    //Http request timeout after 8 seconds
    var timeout = 8000;
    //Send http GET request
    service.get = function(url) {
        var defer = $q.defer();
        $http.get(url, {
            timeout: timeout
        }).then(function(res) {
            defer.resolve(res.data);
        }, function(err) {
            defer.reject("Request fails");
        });
        return defer.promise;
    };
    //Send http POST request
    service.post = function(url, data) {
        var defer = $q.defer();
        $http.post(url, data, {
            timeout: timeout,
            withCredentials: true
        }).then(function(res) {
            defer.resolve(res.data);
        }, function(err) {
            defer.reject("Request fails");
        });
        return defer.promise;
    };
    return service;
});