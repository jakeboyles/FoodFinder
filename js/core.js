angular.module('NGGrid', ['mainController','ngRoute','YelpService','ngGrid'])

.config(function($routeProvider) {
$routeProvider
    .when('/', {
    controller:'mainController',
    templateUrl:'views/main.html'
    })
    .otherwise({
    redirectTo:'/'
    });
})

