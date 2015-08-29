

var PlacesList = function (elem) {
	this._elem = elem;
	this._places = {};
	
	that = this;
	
	$('#print-btn').click(function () {
		that.populatePrint($('#print'));

		$('#print').toggleClass('print-show');
		$('#print-prev').toggleClass('print-hide');
		$('#nav').toggleClass('print-hide');
		$('#map-canvas').toggleClass('print-hide');
		$('#gallery-container').toggleClass('print-hide');
		$('#my-places').toggleClass('print-hide');
		
		window.print()

		$('#print').toggleClass('print-show');
		$('#print-prev').toggleClass('print-hide');
		$('#nav').toggleClass('print-hide');
		$('#map-canvas').toggleClass('print-hide');
		$('#gallery-container').toggleClass('print-hide');
		$('#my-places').toggleClass('print-hide');
	})

	$('#print-prev-btn').click(function () {
		that.populatePrint($('#print-prev'));
		
		$('#print-prev').dialog({
			closeOnEscape: true,
			draggable: false,
			modal: true,
			resizable: false,
			width:'auto'
		});
	})

}

PlacesList.prototype.populatePrint = function(elem) {
	console.log(this._places)

	var idx = 0;
	elem.find('.obj-container').empty();
	for (var k in this._places) {
		idx += 1;
		var p = this._places[k];
		
		var printObj = $('<div class="print-object"></div>');
		var headObj = $('<div class="head-object"></div>')
		var h1 = $('<h1>' + idx + '. ' + p.name + '</h1>');
		var gps = $('<div class="gps-c"></div>')
		var coords = $('<span>Координати:</span><br><span>' + p.coords + '</span>')
		
		printObj.append(headObj);
		headObj.append(h1);
		headObj.append(gps);
		gps.append(coords);
		
		
		var infoObj = $('<div class="info-object"><div></div></div>')
		printObj.append(infoObj);
		infoObj.append(p.desc)
		
		elem.find('.obj-container').append(printObj)
	}
}

	
PlacesList.prototype.add = function (id, obj) {
	if (id in this._places) {
		// already in list!
	} else {
		places = this._places
		places[id] = obj;
		
		var li = $('<li>' + obj.name + '</li>');
		var remove_link = $('<a href="#">[X]</a>');
		
		_elem = this._elem;
		list = _elem.find('ol');
		remove_link.on('click', function(event_data){
			delete places[id];
			$(event_data.target.parentNode).remove();
			if (list.children().length == 0) {
				_elem.hide();
			}
		});

		li.append(remove_link);
		list.append(li);
		_elem.show();
	}
}
