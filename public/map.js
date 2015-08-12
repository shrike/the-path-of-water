
jQuery(document).ready(function(){
	initMarkers();
	initNav();
});

var markers = {};
var map;
var infobox;

function createMarker(name, X, Y, description, img_url) {
	var marker = new google.maps.Marker({
		position: { lat: Y, lng: X},
		title: name,
		icon: 'img/ico-fountain32.ico'
	});

	var contentString = 
		'<div id="marker-popup-content">'+
			'<h2>' + name + '</h2>'+
			'<div id="marker-popup-thumb">'+
				'<img src="' + img_url + '" />' +
			'</div>'+
			'<div id="marker-popup-text">'+
				'<p>' + description + '</p>'+
				'<span id="marker-popup-btn">виж повече' + '</span>'+
			'</div>'+
		'</div>';

	google.maps.event.addListener(marker, 'click', function() {
		infobox.setContent(contentString);
		infobox.open(map, marker);
	});

	return marker;
}

function initMarkers() {
    infobox = new InfoBox({
		disableAutoPan: false,
		maxWidth: 410,
		pixelOffset: new google.maps.Size(-410/2, 0),
		zIndex: null,
		boxClass: 'marker-popup',
		closeBoxMargin: "20px 4px 4px 4px",
		closeBoxURL: "img/close.png",
		infoBoxClearance: new google.maps.Size(1, 1)
    });
    
	for(f of fountains.slice(1)) {
		var id = f[0];
		var name = f[2];
		var X = Number(f[16]);
		var Y = Number(f[17]);
		
		markers[id] = createMarker(name, X, Y, 'TODO desc', 'img/todo.png');
	}
	
}

function initNav() {
  $('#accordion h3').click(function() {
      $(this).next().toggleClass('active');
      return false;
  });
  
  var fountains_ul = $('<ul></ul>');
  var all_li = $('<li>' + 'Всички обекти' + '</li>');
  var all_chck_box = $('<input type="checkbox" checked="true" value="all" />');
  var all_check_boxes = [];
  
  all_chck_box.change(function (event_data){
	for(var b of all_check_boxes) {
		$(b).prop('checked', event_data.target.checked);
		$(b).trigger('change');
	}
  });
  
  all_li.append(all_chck_box);
  fountains_ul.append(all_li);

  for(f of fountains.slice(1)) {
	var name = f[2];
	var fountain_li = $('<li>'+ name +'</li>')
	var fountain_chck_box = $('<input type="checkbox" checked="true" value="' + name + '">');
	fountain_li.append(fountain_chck_box);
	
	fountain_chck_box.change({id: f[0], check_box: fountain_chck_box}, function(event_data) {
		var id = event_data.data['id'];
		if(event_data.target.checked)
			markers[id].setMap(map);
		else
			markers[id].setMap(null);
	});
	fountains_ul.append(fountain_li);
	all_check_boxes.push(fountain_chck_box);
  }
  
  $('#fountains-submenu').append(fountains_ul);
  
  $('#fountains-submenu li').click(function(event_data) {
	$(event_data.target.children[0]).click();
	$(event_data.target.children[0]).trigger('change');
  });
}

function initialize() {
	var mapOptions = {
	  center: { lat: 43.8427298, lng: 26.6044254},
	  zoom: 11
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Set the general map styles
	map.setOptions({styles: styles});

	// Outline the 3 municipalities
	var municipalityLayer  = new google.maps.KmlLayer({
		url: 'https://sites.google.com/site/thepathofwater2/kmls/stg.kml',
		clickable: false,
		map: map
	});

	for(m_id in markers) {
		markers[m_id].setMap(map);
	}
}

google.maps.event.addDomListener(window, 'load', initialize);
