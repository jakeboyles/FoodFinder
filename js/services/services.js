angular.module('YelpService', [])

.factory('Yelp',function($q) {
return {
    get: function (location,query) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        
        $.ajax({
			url: "http://www.jibclients.com/ChowPics/test.php",
			data: {location: location, name: query},
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
}
})




