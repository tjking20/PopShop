$("document").ready(function(){



	var categories = [ "bakery", "bicycle_store", "book_store", "clothing_store", 
	"convenience_store", "department_store", "electronics_store", "florist", 
	 "food", "furniture_store", "grocery_or_supermarket", "hair_care", 
	 "hardware_store", "health", "home_goods_store", "jewelry_store", 
	 "liquor_store", "meal_takeaway", "movie_rental", "pet_store", 
	 "pharmacy", "shoe_store", "shopping_mall", "store" ];

	// acquires the initial position
	currentPosition();

	//set interval acquires client position once every 60 seconds
	setInterval(function(){
  		currentPosition();
	}, 60000);

	function currentPosition(){
		var startPos;
		var geoSuccess = function(position) {
			startPos = position;
			var address = {};
			var currentLat = startPos.coords.latitude
			var currentLon = startPos.coords.longitude 
			console.log(currentLat);
			console.log(currentLon);

			//getJson uses the google maps api to return address and place type of the client's latitude/longitude
			// var queryUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + currentLat + "," + currentLon + "0&radius=1&key=AIzaSyB6pjoK3bI7lkj-T_XU_O9DMIgsiDutmg8";
			var queryUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=39.896727, -75.029770&radius=1&key=AIzaSyB6pjoK3bI7lkj-T_XU_O9DMIgsiDutmg8";
			$.getJSON(queryUrl, function(result){
					address = result;
					var name = address.results[1].name;
					var streetAddress = address.results[1].vicinity;
					var placeType = address.results[1].types
					console.log(address);
					console.log(name);
					console.log(streetAddress);
					console.log(placeType);
					$("#name").html(name);
					$("#address").html(streetAddress);
					$("#types").html(placeType);

					$(document).on("click", "#geo", function(){
						$("#shop").show();
						
					});

				


			


			});

			
		};

		
		//provides error codes, if the users location could not be determined.
		var geoError = function(error) {
		  console.log('Error occurred. Error code: ' + error.code);
		  // potential error codes:
		    // 0: unknown error
		    // 1: permission denied
		    // 2: position unavailable (error response from location provider)
		    // 3: timed out
		};
		//getCurrentPosition(), accesses accesses browser geolocation
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);




	}
		




});

