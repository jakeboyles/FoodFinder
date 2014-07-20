angular.module('mainController', [])

	.controller('mainController', function($scope,Yelp) {
		var location,lat,long,marker,map,group, name;
		var points = [];

		$scope.name = "Pizza";


		$scope.init = function() {
		position = "37.7833%2C122.4167";
        get(position,$scope.name);
    	}


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

			if($("#location").is(":checked")){
				getLocation();
			} else {
				init();
			}
		}

		// Callback for once the user grants us permission to use there location
		function showPosition(position) {
			lat = position.coords.latitude;
			long = position.coords.longitude

	    	position = position.coords.latitude+'%2C'+position.coords.longitude;
	   		get(position,$scope.name);
	   		$(".gridStyle").removeClass("hide");
		}


		function init() {
			lat = 37.7833;
			long = -122.4167;
	    	position = lat+'%2C'+long;
	   		get(position,$scope.name);
	   		$(".gridStyle").removeClass("hide");
		}

		var myData = [];

		// Get data from the Yelp Api by calling the Yelp Factory (services/services.js)
		function get(position,name) {

		if(typeof map !== 'undefined') {
			map.remove();
		}
		 
		if(typeof map !== 'undefined' || !map || map == null) {
	 	map = L.map('map').setView([lat, long], 10);
	 	}

		L.tileLayer('http://{s}.tiles.mapbox.com/v3/jakeboyles.j0ajipap/{z}/{x}/{y}.png', {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		    maxZoom: 18
		}).addTo(map);


		 Yelp.get(position,name)
		 		// On return of our promise from the factory
	            .then(function(data) {
	               $scope.data = data.businesses;

	               $scope.myData = [];
	               myData = [];

	               for(var i = 0;i<$scope.data.length;i++) {
	               	var distance = $scope.data[i].distance*0.000621371;
	               	name = $scope.data[i].name;

	               	// If Yelp gives us the lat and long use this
	               	if($scope.data[i].location.coordinate) {
	               		marker = L.marker([$scope.data[i].location.coordinate.latitude, $scope.data[i].location.coordinate.longitude]).addTo(map);
	               		marker.bindPopup("<h3><a href='"+$scope.data[i].url+"'>"+$scope.data[i].name+"</a></h3><img src='"+$scope.data[i].rating_img_url_small+"' /><br>"+$scope.data[i].snippet_text).openPopup();
	               		points.push(marker);
	               	} 
	               	else {
	               		// If not we need to do some geo encoding
	               		var location = $scope.data[i].location.address + " " + $scope.data[i].location.city + $scope.data[i].location.state_code;
	               		Yelp.geoEncode(location,$scope.data[i])
	               		.then(function(data2){
	               			lat = data2.newData.results[0].geometry.location.lat;
	               			long = data2.newData.results[0].geometry.location.lng;
	               			business = data2.oldData;
	               			marker = L.marker([lat, long]).addTo(map);
	               			marker.bindPopup("<h3><a href='"+business.url+"'>"+business.name+"</a> </h3><img src='"+business.rating_img_url_small+"' /><br>"+business.snippet_text).openPopup();
	               			points.push(marker);	
	               		})
	               	}

	               	// Restaurant Object for NG-Grid
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
	             

	            // Since the GeoEncode data has to go through an API and is acyncronous we have to delay our fitting of the map until all the data is resolved
	            setTimeout(function(){
	             var group = new L.featureGroup(points);
 				 map.fitBounds(group.getBounds());
 				},1000)

	            
	            }, function(error) {
	                alert(error);
	            });

		}

		// Our options for the NG-Grid
		$scope.gridOptions = { 
        data: 'myData',
        columnDefs: [
            {field: 'Name', displayName:'Name', cellTemplate: '<a target="_blank" href="{{row.entity.URL}}">{{row.getProperty(col.field)}}</a>'},
        	{field: 'Rating', displayName: 'Ratings', width: 90},
        	{field: 'Review', displayName: 'Review'},
        	{field: 'Distance', displayName: 'Distance', width: 100},
        	{field: 'URL', visible:false},
        	]
        };


        init();


	});
