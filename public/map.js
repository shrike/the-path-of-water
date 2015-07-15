
function initialize() {
	var mapOptions = {
	  center: { lat: 43.8427298, lng: 26.6044254},
	  zoom: 11
	};
	
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	for(f of fountains.slice(1)) {
		var name = f[2];
		var X = Number(f[16]);
		var Y = Number(f[17]);
		
		var marker = new google.maps.Marker({
			position: { lat: Y, lng: X},
			title: name,
			map: map,
		});
	}
}

google.maps.event.addDomListener(window, 'load', initialize);
