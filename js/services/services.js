angular.module('YelpService', [])
// super simple service
// each function returns a promise object 

.factory('Yelp',function($http,$q) {
return {
    get: function (location,name) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $.ajax({
			url: "http://www.jibclients.com/ChowPics/test.php",
			data: {location: location, name: name},
			xhrFields: {
	       	withCredentials: true
         	},
         	crossDomain: true,
         	dataType: 'jsonp',
			success: function(data){
				deferred.resolve(data);
				$(".fa-spinner").hide();
				$(".ngGrid").show();
			},
		});

	return promise
    .then(function(response) {
        return response;
    })
    }
}})




