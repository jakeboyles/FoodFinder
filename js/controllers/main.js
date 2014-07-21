angular.module('mainController', [])


	// inject the Todo service factory into our controller
	.controller('mainController', function($scope,Yelp) {
		var location;

		$scope.name = "pizza";

		function getLocation() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition);
		    } else {
		        x.innerHTML = "Geolocation is not supported by this browser.";
		    }
		}

		var width = $(".gridStyle").parent().width();
		$(".gridStyle").width(width);

		$scope.search = function() {
			$(".ngGrid").hide();
			$(".fa-spinner").show();


			if($("#location").is(":checked")){
				getLocation();
			} else {
				init();
			}
		}

		function init() {
			lat = 37.7833;
			long = -122.4167;
	    	position = lat+'%2C'+long;
	   		get(position,$scope.name);
	   		$(".gridStyle").removeClass("hide");
		}

		function showPosition(position) {
	    position = position.coords.latitude+'%2C'+position.coords.longitude;
	   	get(position,$scope.name);
	   	$(".gridStyle").removeClass("hide");
		}

		var myData = [];

		function get(position,name) {
		 myData=[];
		 Yelp.get(position,name)
	            // then() called when son gets back
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
	            
	            }, 

	            function(error) {
	            	alert("ERROR IN API");
	            });
		}

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


        init();

	});



      

