
jQuery(document).ready(function(){
	initMarkers();
	initNav();
});

var markers = {};
var map;

function initMarkers() {
	for(f of fountains.slice(1)) {
		var id = f[0];
		var name = f[2];
		var X = Number(f[16]);
		var Y = Number(f[17]);
		
		var marker = new google.maps.Marker({
			position: { lat: Y, lng: X},
			title: name,
			icon: 'img/ico-fountain32.ico'
		});

		markers[id] = marker;
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
