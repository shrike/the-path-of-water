

var id_to_name = {
	1: 'Дунавски парк, Тутракан',
	2: 'Екомаршрут Бръшленско блато - основен маршрут',
	3: 'Екомаршрут Бръшленско блато - черен път 2',
	4: 'Екомаршрут Бръшленско блато - черен път 3',
	5: 'Маршрут към о-в Голям Бръшлен',
	6: 'Обиколка на дунавските острови',
	7: 'Обиколка на историческите паметници, Тутракан',
	8: 'Калимок-Бръшлен',
	9: 'Подход към зона за отдих о-в Алеко',
	10: 'Сливо поле - р-т Жълта къща, Стамболово',
	11: 'към Дунавския бряг от Бръшленско блато',
	12: 'Сливо поле - р-т Рибарска среща, Сливо поле',
	13: 'Към резерват Калимок-Бръшлен'
}

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

Tour.prototype.setId = function (id) {
	this.id = id;
	this.name = id_to_name[id];
}