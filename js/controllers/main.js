angular.module('mainController', [])

	.controller('mainController', function($scope,Yelp) {
		var location;


		// See if there browser has geolocation
		function getLocation() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition);
		    } else {
		        alert("Sorry you don't have geolocation on your browser.")
		    }
		}

		// This is here to set the width of the NG-Grid to the width of its parent container, because it wont accept 100% :(
		var width = $(".gridStyle").parent().width();
		$(".gridStyle").width(width);

		// Once the user clicks the search button lets do this...
		$scope.search = function() {
			$(".ngGrid").hide();
			$(".fa-spinner").show();
			getLocation();
		}

		// Callback for once the user grants us permission to use there location
		function showPosition(position) {
	    	position = position.coords.latitude+'%2C'+position.coords.longitude;
	   		get(position,$scope.name);
	   		$(".gridStyle").removeClass("hide");
		}

		var myData = [];

		// Get data from the Yelp Api by calling the Yelp Factory (services/services.js)
		function get(position,name) {
		 myData=[];
		 Yelp.get(position,name)
		 		// On return of our promise from the factory
	            .then(function(data) {
	               $scope.data = data.businesses;
	               for(var i = 0;i<$scope.data.length;i++) {
	               	var distance = $scope.data[i].distance*0.000621371;

	               	var restaurant = {
	               		Name:$scope.data[i].name,
	               		Rating:$scope.data[i].rating,
	               		Review:$scope.data[i].snippet_text,
	               		URL:$scope.data[i].url,
	               		Distance: distance.toFixed(2) + " Miles",
	               	}

	               	myData.push(restaurant);

	               }

	             $scope.myData = myData;
	            
	            }, function(error) {
	                alert(error);
	            });
		}

		// Our options for the NG-Grid
		$scope.gridOptions = { 
        data: 'myData',
        columnDefs: [
            {field:'Name', displayName:'Name', cellTemplate: '<a target="_blank" href="{{row.entity.URL}}">{{row.getProperty(col.field)}}</a>'},
        	{field: 'Rating', displayName: 'Ratings', width: 90},
        	{field: 'Review', displayName: 'Review'},
        	{field: 'Distance', displayName: 'Distance', width: 100},
        	{field:'URL', visible:false},
        	]
        };

	});
