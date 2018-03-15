    // MODULE
    var roowixTest = angular.module('roowixTest', ['ngRoute', 'ngResource']);

    // ROUTES
    roowixTest.config(function ($routeProvider) {

        $routeProvider

        .when('/', {
            templateUrl: 'pages/home.htm',
            controller: 'homeController'
        })



    });

    // SERVICES
    roowixTest.service('urlService', function() {

        this.urlLink = "";

    });

    // CONTROLLERS
    roowixTest.controller('homeController', ['$scope', 'urlService', '$http', function($scope, urlService, $http) {

        $scope.links=[]

        $scope.urlLink = urlService.urlLink;

        $scope.$watch('urlLink', function() {
           urlService.urlLink = $scope.urlLink;        
        });

        $scope.addRow = function(){	

            if ($scope.urlLink!="")
                {
                    $http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAF9PYhA5AltjNRkxtCULFvWwbe1qjm8R8', {"longUrl": $scope.urlLink}).then(function successCallback(response) {
                             console.log(response);

                        $http.get('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAF9PYhA5AltjNRkxtCULFvWwbe1qjm8R8&shortUrl='+
                                  response.data.id+
                                  '&projection=ANALYTICS_CLICKS').then(function successCallback(responseClick) {
                             console.log(responseClick);
                                 $scope.links.push(
                                { 
                                    'longUrl': response.data.longUrl, 
                                    'shortUrl': response.data.id, 
                                    'date':new Date(),
                                    'click' : responseClick.data.analytics.allTime.shortUrlClicks

                                });
                                   $scope.urlLink="";


                        }, function errorCallback(responseClick) {
                                console.log(responseClick)
                        });  

                               console.log(responseClick);

      }, function errorCallback(response) {
        console.log(response)
      });  
                }

    };

    }]);

