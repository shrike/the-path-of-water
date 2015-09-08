
function replaceSpaces(name) {
	return name.replace(/ /g, '-');
}

function makeThumbPath(name) {
	return domain + 'wp-content/uploads/2015/08/' + replaceSpaces(name) + '-150x150.jpg';
}
function makeImagePath(name) {
	return domain + 'wp-content/uploads/2015/08/' + replaceSpaces(name) + '.jpg';
}

function resizeMap() {
	$('#map-canvas').height($('#rest').height() - $('#gallery-container').height())
}

var Gallery = function (elem) {
	this.pics = [];
	
	this._makeDialog = function(a, full_img_div, title) {
		a.on('click', function(){
			full_img_div.dialog({
				closeOnEscape: true,
				draggable: false,
				modal: true,
				resizable: false,
				title: title,
				width:'auto'
			});
		});
	}
		

/*	elem.on('click', 'a', function(event_data){
		$(event_data.currentTarget.children[0]).dialog({
			closeOnEscape: true,
			draggable: false,
			modal: true,
			resizable: false,
			
		});
	});
*/	
	this.show = function () {
		elem.empty();
		
		var data = [];
		var imgs_div = $('<div class="img-container"></div>');
		
		for (var i of this.pics) {
			/* Now make the img tags for each picture */
			
			var thumb = $('<img />');
			thumb.attr('src', makeThumbPath(i.name));
			var full_img = $('<img />');
			full_img.attr('src', makeImagePath(i.name));
			
			var full_img_div = $('<div class="full-img-dialog"></div>');
			full_img_div.append(full_img);

			var a = $('<a href="#"></a>');
			a.append(thumb);
			this._makeDialog(a, full_img_div, i.caption);

			var img_div = $('<div></div>');
			var caption = $('<span class="img-caption">' + i.caption + '</span>');
			
			img_div.append(a);
			img_div.append(caption);

			imgs_div.append(img_div);
		}
	
		elem.append(imgs_div);
		elem.show();
		resizeMap();
	};
	
	this.hide = function () {
		elem.hide()
		resizeMap();
	};
}

Gallery.prototype.getCover = function () {
	if (this.pics.length > 0) {
		return makeThumbPath(this.pics[0].name);
	} else {
		return "img/default-img.jpg"
	}
}

Gallery.prototype.setPics = function (picsStr, caption) {
	this.pics = [];
	
	if (picsStr.indexOf(';') > 0) {
		var picsArr = picsStr.split(';');
		for(var picName of picsArr) {
			this.pics.push({
				name: picName.trim(),
				caption: caption
			});
		}
	} else if (picsStr.indexOf('-') > 0) {
		var picsArr = picsStr.split('-');
		
		var first = Number(picsArr[0]);		
		var last = Number(picsArr[1]);
		
		if (Number.isNaN(first) || Number.isNaN(last)) {
			this.pics.push({
				name: picsStr.trim(),
				caption: caption
			});
		} else {
			for(var i=first; i <= last; ++i) {
				this.pics.push({
					name: "DSC9" + i,
					caption: caption
				});
			}
		}
	} else if (picsStr.length > 0) {
		this.pics.push({
			name: picsStr.trim(),
			caption: caption
		});		
	} else {
		console.log("BAD picsStr: " + picsStr);
	}
	
	if (this.pics.length > 0) {
		this.show();
	} else {
		this.hide();		
	}
}


Gallery.prototype.addPics = function (picsStr, caption) {
	if (picsStr.indexOf(';') > 0) {
		var picsArr = picsStr.split(';');
		for(var picName of picsArr) {
			this.pics.push({
				name: picName.trim(),
				caption: caption
			});
		}
	} else if (picsStr.indexOf('-') > 0) {
		var picsArr = picsStr.split('-');
		
		var first = Number(picsArr[0]);		
		var last = Number(picsArr[1]);
		
		if (Number.isNaN(first) || Number.isNaN(last)) {
			this.pics.push({
				name: picsStr.trim(),
				caption: caption
			});
		} else {
			for(var i=first; i <= last; ++i) {
				this.pics.push({
					name: "DSC9" + i,
					caption: caption
				});
			}
		}
	} else if (picsStr.length > 0) {
		this.pics.push({
			name: picsStr.trim(),
			caption: caption
		});		
	} else {
		console.log("BAD picsStr: " + picsStr);
	}
	
	if (this.pics.length > 0) {
		this.show();
	} else {
		this.hide();		
	}
}