var fs = require('fs');
var csv = require('fast-csv');

var objs = "var objs_en = [\n";

var all = csv.fromPath('../objects-en.csv')
	.on('data', function (data) {
		var escaped_data = [];
		for(var d of data) {
			escaped_data.push(d.replace(/"/gm, '\\"').replace(/\n/g, " "));
		}
		objs += '["' + escaped_data.join('","') + '"],\n';
	})
	.on("end", function(){
		objs += '];'
		fs.writeFileSync('objects-en.js', objs)
	});
/*
for(var line of lines) {
	console.log(line);
	console.log(line.split(',').length);
}
*/