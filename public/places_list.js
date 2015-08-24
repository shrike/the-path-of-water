

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
		
		elem = this._elem;
		remove_link.on('click', function(event_data){
			delete places[id];
			$(event_data.target.parentNode).remove();
		});

		li.append(remove_link);
		elem.append(li);
	}
}

PlacesList.prototype._update = function() {
	this._elem.empty();
	
	for(var id in this._places) {
		console.log(id);
	}
}