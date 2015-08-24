

var Tour = function (layer) {
	this._layer = layer;
	this.checks = 0;
}


Tour.prototype.show = function (map) {
	this._layer.setMap(map);
}


Tour.prototype.hide = function () {
	this._layer.setMap(null);
}
