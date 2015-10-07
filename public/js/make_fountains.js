var fs = require('fs');
var csv = require('fast-csv');

var fountains = "var fountains_en = [\n";

var all = csv.fromPath('../fountains-en.csv')
	.on('data', function (data) {
		fountains += '["' + data.join('","') + '"],\n';
	})
	.on("end", function(){
		fountains += '];'
		fs.writeFileSync('fountains-en.js', fountains)
	});
/*
for(var line of lines) {
	console.log(line);
	console.log(line.split(',').length);
}
*/