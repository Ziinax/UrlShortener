/*###############################################################################
 # Frontend part 
###############################################################################*/

// MODULE
var roowixTest = angular.module('roowixTest', ['ngRoute', 'ngResource']);

// ROUTES
roowixTest.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
        templateUrl: 'views/pages/home.htm',
        controller: 'homeController'
    })



});

// SERVICES
roowixTest.service('urlService', function() {

    this.urlLink = "";

});

// CONTROLLERS
roowixTest.controller('homeController', ['$scope', 'urlService', '$http', '$location', '$window', function($scope, urlService, $http, $location, $window) {


    $scope.links=[]

    $scope.urlLink = urlService.urlLink;

    $scope.$watch('urlLink', function() {
        urlService.urlLink = $scope.urlLink;        
    });

    $scope.addRow = function(){	

        if ($scope.urlLink!="")
        {
            $http.post('/api/shorten', {url: $scope.urlLink}).then(function successCallback(response) {

                console.log(response);

                $scope.links.push(
                    { 
                        'longUrl': response.data.longUrl, 
                        'shortUrl': response.data.shortUrl, 
                        'date':new Date(),
                        'click' : response.data.clicked 

                    });
                $scope.urlLink="";

            }, function errorCallback(response) {
                console.log(response)
            });
        }

    };

    $scope.clicked = function($event){
        var url = $($event.target).data('url');
        console.log(url, typeof(url));
        $http.post('/api/click', { url : url}).then(function successCallback(response) {
            console.log("reponse : " , response);
            for (var i = 0, length = $scope.links.length; i < length; i++) {
                if ($scope.links[i].longUrl== response.data.longUrl)
                    $scope.links[i].click = response.data.click;
            }

        }, function errorCallback(response) {
            console.log(response)
        });  
    };

    $http.get('/api/all').then(function successCallback(res) {
        for(var k in res.data) {
            $scope.links.push(
                { 
                    'longUrl': res.data[k].long_url, 
                    'shortUrl': res.data[k]._id, 
                    'date': res.data[k].created_at,
                    'click' : res.data[k].clicked || 0

                });
        }

    }, function errorCallback(res) {
        console.log(res)

    }); 

}]);