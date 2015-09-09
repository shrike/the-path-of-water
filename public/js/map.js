//XXX Change the domain below to / when deploying (on either test domain or production)
var domain = "http://water.wepbro.com/";
var production = false;

var gallery;

jQuery(document).ready(function(){
	gallery = new Gallery($('#gallery'));	
	initMarkers();
	initTours();
	initNav();
	initMyPlaces();
});

var markers = {};
var tours = [];
var map;
var infobox;
var my_places;
var cat_to_all_check_boxes = {};


function parseHash() {
	var hash_parts = window.location.hash.split('+');
	var cat = hash_parts[0].substr(1);
	var name = hash_parts[1];
	
	if (!cat) {
		return;
	}
	
	// find the object corresponding to the hash
	var checkboxes = cat_to_all_check_boxes[cat]
	for(var c of checkboxes) {
		if (makeNameUrl(c.name) == name) {
			$(c).prop('checked', true);
			$(c).trigger('change');
			// Also open the corresponding accordion menu
			$('#' + cat + '-submenu').prev().click();
		}
	}
	
	for(k in markers) {
		var m = markers[k];
		if (m.getMap()) {
			google.maps.event.trigger(m, 'click');
		}
	}
}


function initMyPlaces() {
	my_places = new PlacesList($('#my-places'));
	
	infobox.addListener('domready', function() {
		$('#marker-popup-content a.add-to-my-places').on('click', function(event_data) {
			var id = event_data.currentTarget.dataset.objId;
			my_places.add(id, markers[id]);
		});
	});
}


function makeNameUrl(name) {
	var name_url = name.toLowerCase();
	name_url = name_url.replace(/[ –]/g, '-');
	name_url = name_url.replace(/["„”“().,]/g, '');
	name_url = name_url.replace(/-+/g, '-');
	name_url = name_url.substr(0, 36);
	
	//console.log(name, name_url);
	
	return name_url;
}


function createMarker(id, name, X, Y, description, cat, pics) {
	var icon_path;
	if (production) {
		icon_path = '/wp-content/themes/water/img/icons/';
	} else {
		icon_path = 'img/icons/';
	}

	var cat_url;
	
	if (cat == 'fountain') {
		icon_path += 'fountain.ico';
		cat_url = 'fountain';
	} else if (cat == 'birds') {
		icon_path += 'ornithological-tourism.ico';
		cat_url = 'orn-tourism';
	} else if (cat == 'culture') {
		cat_url = 'culture-tourism';
		icon_path += 'cultural-tourism.ico';
	} else if (cat == 'religion') {
		cat_url = 'pilgrimage-tourism';
		icon_path += 'pilgrimage-tourism.ico';
	} else if (cat == 'eco') {
		cat_url = 'eco-tourism';
		icon_path += 'eco-tourism.ico';
	} else if (cat == 'hunting') {
		cat_url = 'hunt-fish-tourism';
		icon_path += 'hunting-fishing-tourism.ico';
	} else if (cat == 'water') {
		cat_url = 'water-tourism';
		icon_path += 'water-river-tourism.ico';
	} else {
		console.log("WHAT? " + cat);
	}

	var marker = new google.maps.Marker({
		position: { lat: Y, lng: X},
		title: name,
		icon: icon_path
	});

	var read_more_url = domain + cat_url + "/" + makeNameUrl(name);
	
	// Uncomment below to load the pics for all objects in the starting gallery.
	// Can be used to debug if all images properly load.
	//gallery.addPics(pics, name);
	
	google.maps.event.addListener(marker, 'click', function() {
		gallery.setPics(pics, name);
		var img_url = gallery.getCover();

		var contentString = 
		'<div id="marker-popup-content">'+
			'<h2>' + name + '</h2>'+
			'<div id="marker-popup-thumb">'+
				'<img src="' + img_url + '" />' +
			'</div>'+
			'<div id="marker-popup-text">'+
				'<p>' + description + '</p>'+				
			'</div>'+
			'<div id="marker-popup-btns-container">' +
				'<a href="'+ read_more_url +'"><span class="marker-popup-btn">виж повече' + '</span></a>' +
				'<a href="#" data-obj-id="'+ id +'" class="add-to-my-places"><span class="marker-popup-btn">Добави към "Моите Места"</span></a>' + 
			'</div>' +
		'</div>';

		//XXX: hardcode the popup width here so we can always display it in the center of the map. 
		// If we change the width of the popup in css we HAVE to change it here too!
		var marker_popup_content_width = 390;
		infobox.setOptions({infoBoxClearance: new google.maps.Size(($('#map-canvas').width() - marker_popup_content_width) / 2, $('#gallery-container').height() + 40)})
		infobox.setContent(contentString);
		infobox.open(map, marker);
	});

	marker.show = function(map) {
		this.setMap(map);
	}
	
	marker.hide = function() {
		this.setMap(null);
	}
	
	marker.name = name;
	return marker;
}


function initTours() {
	// Load the kmls for all 13 tours
	for(var i=1; i<=13; ++i) {
		var tourLayer = new google.maps.KmlLayer({
			url: 'https://sites.google.com/site/thepathofwater2/kmls/t' + i + '.kml', //XXX Fix kml location
			clickable: false,
			preserveViewport: true
		});
		tour = new Tour(tourLayer);
		tour.setId(i);
		tours.push(tour);
	}
}


function initMarkers() {
	var close_png_url = "img/close.png";
	if (production) {
		close_png_url = "/wp-content/themes/water/img/close.png";
	}
	
    infobox = new InfoBox({
		disableAutoPan: false,
		maxWidth: 410,
		pixelOffset: new google.maps.Size(-410/2-10, 0),
		zIndex: null,
		boxClass: 'marker-popup',
		closeBoxMargin: "10px 4px 4px 4px",
		closeBoxURL: close_png_url
    });
	
	infobox.addListener('closeclick', function() {
		gallery.setPics([], '');
	})
    
	for(f of fountains.slice(1)) {
		var id = f[0];
		var name = f[2];
		var condition = f[7]
		var material = f[8];
		var has_water = f[9];
		var has_rest_area = f[10];
		var water_q = f[11];
		var X = Number(f[16]);
		var Y = Number(f[17]);
		var pics = f[13];
		var desc = "<ul>" + 
			'<li>Състояние: ' + condition + '</li>' +
			'<li>Материал: ' + material + '</li>' +
			'<li>Течаща вода: ' + has_water + '</li>' +
			'<li>Зона за отдих: ' + has_rest_area + '</li>' +
			'<li>Качество на водата: ' + water_q + '</li>' +
		'</ul>';
		
		markers[id] = createMarker(id, name, X, Y, desc, 'fountain', pics);
		markers[id].checks = 0;
		markers[id].desc = desc;
		markers[id].coords = X + ', ' + Y
	}

	for(o of objs.slice(1)) {
		var name = o[0];
		var coords = o[5].split(', ');
		var X = Number(coords[1]);
		var Y = Number(coords[0]);
		var cat1 = o[6];
		var cat2 = o[7];
		var cat3 = o[8];
		var desc = o[3];
		var pics = o[4];
		
		if (X > 0 && Y > 0) {
			// Using cat1 in the call below will mean that the marker will always link to the WP article
			// in the first category. This may cause some confusion for the users as when looking for a 
			// culture object, one may end up in the article for a fountain, if an object is listed as both.
			markers[coords] = createMarker(coords, name, X, Y, desc, parseCat(cat1), pics);
			markers[coords].checks = 0;
			markers[coords].desc = desc;
			markers[coords].coords = X + ', ' + Y
		}
	}
}


function parseCat(name) {
	if (name == 'Културен туризъм') {
		return 'culture';
	} else if(name == 'Орнитоложки') {
		return 'birds';
	} else if(name == 'Воден и речен туризъм') {
		return 'water';
	} else if(name == 'Еко туризъм') {
		return 'eco';
	} else if(name == 'Ловно-рибарски туризъм') {
		return 'hunting';
	} else if(name == 'Поколоннически') {
		return 'religion';
	} else {
		//console.log("UNRECOGNIZED CAT: " + name)
	}
}


function initNav() {
  $('#accordion h3').click(function() {
      $(this).next().toggleClass('active');
      $(this).toggleClass('open');
      return false;
  });
  
  var categories = ['fountains', 'birds', 'culture', 'religion', 'eco', 'hunting', 'water', 'tours'];
  var uls = {};
  
	function makeObjLi(obj, name, cat) {
		var li = $('<li>'+ name +'</li>')
		var chck_box = $('<input type="checkbox" value="' + name + '">');
		chck_box.prop('checked', false);
		li.append(chck_box);

		chck_box.change({obj: obj, check_box: chck_box}, function(event_data) {
			var obj = event_data.data['obj'];
			if (event_data.target.checked) {
				obj.checks += 1;
				if (obj.checks == 1)
					obj.show(map);
			}
			else {
				obj.checks -= 1;
				if (obj.checks == 0)
					obj.hide();
			}
		});

		chck_box.name = name;
		cat_to_all_check_boxes[cat].push(chck_box);

		return li;
	}

  for (var c of categories) {
	uls[c] = $('<ul></ul>');
	$('#' + c + '-submenu').append(uls[c]);
	
	$('#' + c + '-submenu').on('click', 'li', function(event_data) {
		$(event_data.target.children[0]).click();
	});
  
	var all_li = $('<li>' + 'Всички обекти' + '</li>');
	var all_chck_box = $('<input type="checkbox" value="all" />');
	all_chck_box.prop('checked', false);
	var all_check_boxes = [];
	cat_to_all_check_boxes[c] = all_check_boxes;
  
	all_chck_box.change({cat: c}, function (event_data){
		var cat = event_data.data['cat'];
		for(var b of cat_to_all_check_boxes[cat]) {
			if ($(b).prop('checked') != event_data.target.checked) {
				$(b).prop('checked', event_data.target.checked);
				$(b).trigger('change');
			}
		}
	});
  
	all_li.append(all_chck_box);
	uls[c].append(all_li);
  }

  var tours_ul = uls['tours'];
  for(t of tours) {
	var tour_li = makeObjLi(t, t.name, 'tours');
	tours_ul.append(tour_li);
  }
  
  var fountains_ul = uls['fountains'];

  for(f of fountains.slice(1)) {
	var name = f[2];
	var id = f[0]
	var fountain_li = makeObjLi(markers[id], name, 'fountains');
	fountains_ul.append(fountain_li);
  }
  
  /******************* OTHER OBJS NAV *********************/
  for(o of objs.slice(1)) {
	var name = o[0];
	var coords = o[5].split(', ');
	var X = Number(coords[1]);
	var Y = Number(coords[0]);
	
	if (!markers[coords]) continue;

	var cat1 = parseCat(o[6]);
	var cat2 = parseCat(o[7]);
	var cat3 = parseCat(o[8]);
	
	if (cat1) {
		uls[cat1].append(makeObjLi(markers[coords], name, cat1));
	}
	if (cat2) {
		uls[cat2].append(makeObjLi(markers[coords], name, cat2));
	}
	if (cat3) {
		uls[cat3].append(makeObjLi(markers[coords], name, cat3));
	}
  }
}

function initialize() {
	var mapOptions = {
	  center: { lat: 43.8427298, lng: 26.6044254},
	  zoom: 11
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Set the general map styles
	//map.setOptions({styles: styles});

	// Outline the 3 municipalities
	var municipalityLayer  = new google.maps.KmlLayer({
		url: 'https://sites.google.com/site/thepathofwater2/kmls/stg.kml', //XXX fix kml location
		clickable: false,
		map: map
	});
	
	// Uncomment below to show all markers and tours at map load time
	/* 
	for (t of tours) {
		t.show(map);
	}
	
	for(m_id in markers) {
		markers[m_id].setMap(map);
	}
	*/
	
	var parsedHash = false;
	map.addListener('tilesloaded', function() {
		if (!parsedHash) {
			parsedHash = true;
			parseHash();
		}
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
