angular.module('mainController', [])


	// inject the Todo service factory into our controller
	.controller('mainController', function($scope,Yelp) {
		var location,lat,long,marker,map,group, name;
		var points = [];
		$scope.name = "pizza";
		var myData = [];


		// Constructor for our restaurant object
		function Restaurant (name,rating,review,url,distance) {
		   this.Name = name,
		   this.Rating = rating,
		   this.Review = review,
		   this.URL = url,
		   this.Distance;
		}


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
	            // then() called when son gets back
	            .then(function(data) {
	               $scope.data = data.businesses;

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


	               	var Name = $scope.data[i].name;
	               	var Rating = $scope.data[i].rating;
	               	var Review = $scope.data[i].snippet_text;
	               	var URL = $scope.data[i].url;
	               	var Distance = distance.toFixed(2) + " Miles";

	               	var restaurant = new Restaurant(Name,Rating,Review,URL,Distance);

	               	myData.push(restaurant);

	               } // This ends Yelp.Get

	            
	            $scope.myData = myData;
	             

	            // Since the GeoEncode data has to go through an API and is acyncronous we have to delay our fitting of the map until all the data is resolved
	            setTimeout(function(){
	             var group = new L.featureGroup(points);
 				 map.fitBounds(group.getBounds());
 				},1000)

	            
	            }, 

	            function(error) {
	            	alert("ERROR IN API");
	            });

		}

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



      

