
function initialize() {
	var mapOptions = {
	  center: { lat: 43.8427298, lng: 26.6044254},
	  zoom: 11
	};
	
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Set the general map styles
	map.setOptions({styles: styles});

	// Outline the 3 municipalities
	var municipalityLayer  = new google.maps.KmlLayer({
		url: 'https://sites.google.com/site/thepathofwater2/kmls/stg.kml',
		clickable: false,
		map: map
	});

	for(f of fountains.slice(1)) {
		var name = f[2];
		var X = Number(f[16]);
		var Y = Number(f[17]);
		
		var marker = new google.maps.Marker({
			position: { lat: Y, lng: X},
			title: name,
			map: map,
			icon: 'img/ico-fountain32.ico'
		});
	}
}

google.maps.event.addDomListener(window, 'load', initialize);
