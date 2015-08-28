

var PlacesList = function (elem) {
	this._elem = elem;
	this._places = {};
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
