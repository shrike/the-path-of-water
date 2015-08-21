
var domain = "http://water.wepbro.com/";

function makeThumbPath(name) {
	return domain + 'wp-content/uploads/2015/08/' + name + '-150x150.jpg';
}

var Gallery = function (elem) {
	this.pics = [];
	
	this.show = function () {
		//XXX Change the domain below to / when deploying (on either test domain or production)
		
		elem.empty();
		
		var data = [];
		var imgs_div = $('<div class="img-container"></div>');
		var captions_div = $('<div class="captions-container"></div>');
		
		for (var i of this.pics) {
			/* Now make the img tags for each picture */
			var div = $('<div class="gallery-img"></div>');
			
			var img = $('<img />');
			img.attr('src', makeThumbPath(i.name));
			
			var caption = $('<span class="img-caption">' + i.caption + '</span>');
			
			imgs_div.append(img);
			captions_div.append(caption);
		}
	
		elem.append(imgs_div);
		elem.append(captions_div);
		elem.show()
	
	};
	
	this.hide = function () {elem.hide()};
}

Gallery.prototype.getCover = function () {
	if (this.pics.length > 0) {
		return makeThumbPath(this.pics[0].name);
	}
}

Gallery.prototype.setPics = function (picsStr, caption) {
	this.pics = [];
		
	if (picsStr.indexOf('-') > 0) {
		var picsArr = picsStr.split('-');
		
		var first = Number(picsArr[0]);
		var last = Number(picsArr[1]);
		
		for(var i=first; i <= last; ++i) {
			this.pics.push({
				name: "DSC9" + i,
				caption: caption
			});
		}
	} else {
		console.log("BAD picsStr: " + picsStr);
	}
	
	if (this.pics.length > 0) {
		this.show();
	} else {
		this.hide();		
	}
}