var fs = require('fs');
var csv = require('fast-csv');

var fountains = "var fountains = [\n";

var all = csv.fromPath('fountains.csv')
	.on('data', function (data) {
		fountains += '["' + data.join('","') + '"],\n';
	})
	.on("end", function(){
		fountains += '];'
		fs.writeFileSync('fountains.js', fountains)
	});
/*
for(var line of lines) {
	console.log(line);
	console.log(line.split(',').length);
}
*/