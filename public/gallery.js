
var domain = "http://water.wepbro.com/";


function makeThumbPath(name) {
	return domain + 'wp-content/uploads/2015/08/' + name + '-150x150.jpg';
}
function makeImagePath(name) {
	return domain + 'wp-content/uploads/2015/08/' + name + '.jpg';
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
		//XXX Change the domain below to / when deploying (on either test domain or production)
		
		elem.empty();
		
		var data = [];
		var imgs_div = $('<div class="img-container"></div>');
		var captions_div = $('<div class="captions-container"></div>');
		
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

			var caption = $('<span class="img-caption">' + i.caption + '</span>');
			
			imgs_div.append(a);
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