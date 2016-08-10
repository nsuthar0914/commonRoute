var myApp = angular.module("myApp",[]);
myApp.controller("MainController", function(){
	this.text = "hello world";
	this.requestArray = [];
	this.renderArray = [];
	this.commonWaypoints = [];
	this.colourArray = ['navy', 'grey', 'fuchsia', 'black', 'white', 'lime', 'maroon', 'purple', 'aqua', 'red', 'green', 'silver', 'olive', 'blue', 'yellow', 'teal'];
	this.getData = function(form){
		console.log(this.pointA, this.pointB, this.pointC, this.pointD);
		this.requestArray.push({
			request: {
		        origin: this.pointA,
		        destination: this.pointB,
		        avoidTolls: true,
		        avoidHighways: false,
		        travelMode: google.maps.TravelMode.DRIVING
		    }
		},{
			request: {
		        origin: this.pointC,
		        destination: this.pointD,
		        avoidTolls: true,
		        avoidHighways: false,
		        travelMode: google.maps.TravelMode.DRIVING
		    }
		})
		console.log(this.requestArray);
		this.processRequests();

	}

	this.processRequests = function(){

        // Counter to track request submission and process one at a time;
        var i = 0;
        var that = this;
        // Used to submit the request 'i'
        function submitRequest(){
        	console.log('requesting', i);
            that.directionsService.route(that.requestArray[i].request, directionResults);
        }

        // Used as callback for the above request for current 'i'
        function directionResults(result, status) {
        	console.log('results', i, result);
            if (status == google.maps.DirectionsStatus.OK) {
                
                // Create a unique DirectionsRenderer 'i'
                that.renderArray[i] = new google.maps.DirectionsRenderer();
                that.renderArray[i].setMap(that.map);

                // Some unique options from the colorArray so we can see the routes
                that.renderArray[i].setOptions({
                    preserveViewport: true,
                    suppressInfoWindows: true,
                    polylineOptions: {
                        strokeWeight: i == 2 ? 6 : 4,
                        strokeOpacity: i == 2 ? 1 : 0.8,
                        strokeColor: that.colourArray[i]
                    },
                    markerOptions:{
                        icon:{
                            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                            scale: 3,
                            strokeColor: that.colourArray[i]
                        }
                    }
                });
                console.log(result);

                // Use this new renderer with the result
                that.renderArray[i].setDirections(result);
                // and start the next request
                if (i == 1) {
                	var array1 = that.renderArray[0].directions.routes[0].overview_path;
                	var array2 = that.renderArray[1].directions.routes[0].overview_path;
                	array1 = array1.map(function(point){
                		return {
                			lat: point.lat().toFixed(2),
                			lng: point.lng().toFixed(2),
                		}
                	});
                	array2 = array2.map(function(point){
                		return {
                			lat: point.lat().toFixed(2),
                			lng: point.lng().toFixed(2),
                		}
                	});
                	console.log(array2, array1, 'starting match');
                	array2.forEach(function(point2){
                		array1.forEach(function(point1){
                			if (point2.lat == point1.lat && point2.lng == point1.lng) {
                				that.commonWaypoints.push(point2);
                			}
                		});
                	});
                	console.log(that.commonWaypoints);
                	if (that.commonWaypoints.length) {
                		console.log(that.commonWaypoints[0].lat, that.commonWaypoints[0].lng);
                		console.log(that.commonWaypoints[that.commonWaypoints.length-1].lat,
                			that.commonWaypoints[that.commonWaypoints.length-1].lng);
                		that.commonPointA = new google.maps.LatLng(that.commonWaypoints[0].lat, that.commonWaypoints[0].lng);
                		that.commonPointB = new google.maps.LatLng(that.commonWaypoints[that.commonWaypoints.length-1].lat,
                			that.commonWaypoints[that.commonWaypoints.length-1].lng);
                		console.log(that.commonPointA, that.commonPointB);
                		that.requestArray.push({
	                		request: {
	                			origin: that.commonPointA,
						        destination: that.commonPointB,
						        avoidTolls: true,
						        avoidHighways: false,
						        travelMode: google.maps.TravelMode.DRIVING
	                		}
	                	});
	                	console.log(that.requestArray);
                	}

                }
                nextRequest();
            }

        }

        function nextRequest(){
            // Increase the counter
            i++;
            console.log('continuing', i);
            // Make sure we are still waiting for a request
            if(i >= that.requestArray.length){
                // No more to do
                console.log('coming out', i);
                return;
            }
            // Submit another request
            submitRequest();
        }

        // This request is just to kick start the whole process
        submitRequest();
    }

	this.initMap = function() {
		console.log(google, this);
		var that = this;
		that.pointA = new google.maps.LatLng(22, 77);
	    that.myOptions = {
	            zoom: 7,
	            center: that.pointA
	        };
	    that.map = new google.maps.Map(document.getElementById('map-canvas'), that.myOptions);
	        // Instantiate a directions service.
	    that.directionsService = new google.maps.DirectionsService;
	    that.directionsDisplay = new google.maps.DirectionsRenderer({
	            map: that.map
	        });
	    var start1 = document.getElementById('start1');
	    var start2 = document.getElementById('start2');
	    var end1 = document.getElementById('end1');
	    var end2 = document.getElementById('end2');
		var autocompleteStart1 = new google.maps.places.Autocomplete(start1);
		autocompleteStart1.addListener('place_changed', function() {
          that.start1 = autocompleteStart1.getPlace();
          that.pointA = new google.maps.LatLng(that.start1.geometry.location.lat(),
			that.start1.geometry.location.lng());
          that.markerA = new google.maps.Marker({
	            position: that.pointA,
	            title: "point A",
	            label: "A",
	            map: that.map
	        });
        });
        var autocompleteStart2 = new google.maps.places.Autocomplete(start2);
		autocompleteStart2.addListener('place_changed', function() {
          that.start2 = autocompleteStart2.getPlace();
          that.pointC = new google.maps.LatLng(that.start2.geometry.location.lat(),
			that.start2.geometry.location.lng());
          that.markerC = new google.maps.Marker({
	            position: that.pointC,
	            title: "point C",
	            label: "C",
	            map: that.map
	        });
        });
        var autocompleteEnd1 = new google.maps.places.Autocomplete(end1);
		autocompleteEnd1.addListener('place_changed', function() {
          that.end1 = autocompleteEnd1.getPlace();
          that.pointB = new google.maps.LatLng(that.end1.geometry.location.lat(),
			that.end1.geometry.location.lng());
          that.markerB = new google.maps.Marker({
	            position: that.pointB,
	            title: "point B",
	            label: "B",
	            map: that.map
	        });
        });
        var autocompleteEnd2 = new google.maps.places.Autocomplete(end2);
		autocompleteEnd2.addListener('place_changed', function() {
          that.end2 = autocompleteEnd2.getPlace();
          that.pointD = new google.maps.LatLng(that.end2.geometry.location.lat(),
			that.end2.geometry.location.lng());
          that.markerD = new google.maps.Marker({
	            position: that.pointD,
	            title: "point D",
	            label: "D",
	            map: that.map
	        });
        });
	}

	this.initMap();
});