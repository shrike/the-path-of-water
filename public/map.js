
var gallery;

jQuery(document).ready(function(){
	initMarkers();
	initNav();
	gallery = new Gallery($('#gallery'));
});

var markers = {};
var map;
var infobox;


function makeNameUrl(name) {
	var name_url = name.toLowerCase();
	name_url = name_url.replace(/[ –]/g, '-');
	name_url = name_url.replace(/["„”“().,]/g, '');
	name_url = name_url.replace(/-+/g, '-');
	
	//console.log(name, name_url);
	
	return name_url;
}


function createMarker(name, X, Y, description, cat, pics) {
	var marker = new google.maps.Marker({
		position: { lat: Y, lng: X},
		title: name,
		icon: 'img/ico-fountain32.ico'
	});

	var cat_url;
	if (cat == 'fountain') {
		cat_url = 'fountain';
	} else if (cat == 'birds') {
		cat_url = 'orn-tourism';
	} else if (cat == 'culture') {
		cat_url = 'culture-tourism';
	} else if (cat == 'religion') {
		cat_url = 'pilgrimage-tourism';
	} else if (cat == 'eco') {
		cat_url = 'eco-tourism';
	} else if (cat == 'hunting') {
		cat_url = 'hunt-fish-tourism';
	} else if (cat == 'water') {
		cat_url = 'water-tourism';
	} else {
		console.log("WHAT? " + cat);
	}
	
	//XXX Change the domain below to / when deploying (on either test domain or production)
	var domain = "http://water.wepbro.com/";
	var read_more_url = domain + cat_url + "/" + makeNameUrl(name);
	
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
				'<span id="marker-popup-btn"><a href="'+ read_more_url +'">виж повече' + '</a></span>'+
			'</div>'+
		'</div>';

		infobox.setContent(contentString);
		infobox.open(map, marker);
	});

	return marker;
}

function initMarkers() {
    infobox = new InfoBox({
		disableAutoPan: false,
		maxWidth: 410,
		pixelOffset: new google.maps.Size(-410/2-10, 0),
		zIndex: null,
		boxClass: 'marker-popup',
		closeBoxMargin: "10px 4px 4px 4px",
		closeBoxURL: "img/close.png",
		infoBoxClearance: new google.maps.Size(1, 1)
    });
	
	infobox.addListener('closeclick', function() {
		gallery.setPics([], '');
	})
    
	for(f of fountains.slice(1)) {
		var id = f[0];
		var name = f[2];
		var X = Number(f[16]);
		var Y = Number(f[17]);
		var pics = f[13];
		
		markers[id] = createMarker(name, X, Y, 'TODO desc', 'fountain', pics);
		markers[id]['checks'] = 0;
	}

	for(o of objs.slice(1)) {
		var name = o[0];
		var coords = o[5].split(', ');
		var X = Number(coords[1]);
		var Y = Number(coords[0]);
		var cat1 = o[6];
		var cat2 = o[7];
		var cat3 = o[8];
		
		if (X > 0 && Y > 0) {
			// Using cat1 in the call below will mean that the marker will always link to the WP article
			// in the first category. This may cause some confusion for the users as when looking for a 
			// culture object, one may end up in the article for a fountain, if an object is listed as both.
			markers[coords] = createMarker(name, X, Y, 'TODO desc', parseCat(cat1), '');
			markers[coords]['checks'] = 0;
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
      return false;
  });
  
  var categories = ['fountains', 'birds', 'culture', 'religion', 'eco', 'hunting', 'water'];
  var uls = {};
  var cat_to_all_check_boxes = {};
  
	function makeObjLi(id, name, cat) {
		var li = $('<li>'+ name +'</li>')
		var chck_box = $('<input type="checkbox" checked="true" value="' + name + '">');
		li.append(chck_box);

		markers[id]['checks'] += 1;
		
		chck_box.change({id: id, check_box: chck_box}, function(event_data) {
			var id = event_data.data['id'];
			if (event_data.target.checked) {
				markers[id]['checks'] += 1;
				if (markers[id]['checks'] == 1)
					markers[id].setMap(map);
			}
			else {
				markers[id]['checks'] -= 1;
				if (markers[id]['checks'] == 0)
					markers[id].setMap(null);
			}
		});

		cat_to_all_check_boxes[cat].push(chck_box);

		return li;
	}

  for (var c of categories) {
	uls[c] = $('<ul></ul>');
	$('#' + c + '-submenu').append(uls[c]);

	var all_li = $('<li>' + 'Всички обекти' + '</li>');
	var all_chck_box = $('<input type="checkbox" checked="true" value="all" />');
	var all_check_boxes = [];
	cat_to_all_check_boxes[c] = all_check_boxes;
  
	all_chck_box.change({cat: c}, function (event_data){
		var cat = event_data.data['cat'];
		for(var b of cat_to_all_check_boxes[cat]) {
			$(b).prop('checked', event_data.target.checked);
			$(b).trigger('change');
		}
	});
  
	all_li.append(all_chck_box);
	uls[c].append(all_li);
  }
  
  var fountains_ul = uls['fountains'];

  for(f of fountains.slice(1)) {
	var name = f[2];
	var id = f[0]
	var fountain_li = makeObjLi(id, name, 'fountains');
	fountains_ul.append(fountain_li);
  }
  
  $('#fountains-submenu li').click(function(event_data) {
	$(event_data.target.children[0]).click();
	$(event_data.target.children[0]).trigger('change');
  });
  
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
		uls[cat1].append(makeObjLi(coords, name, cat1));
	}
	if (cat2) {
		uls[cat2].append(makeObjLi(coords, name, cat2));
	}
	if (cat3) {
		uls[cat3].append(makeObjLi(coords, name, cat3));
	}
  }
  
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
