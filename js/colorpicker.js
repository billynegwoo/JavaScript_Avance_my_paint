(function($)
{
	$.fn.colorpicker = function(parametres)
	{
		return this.each(function()
		{
			var canvas = this.getContext('2d');
			canvas.canvas.width = 360;
			canvas.canvas.height = 360;
			var img = new Image();
			img.src = './img/couleur.jpg';
			$(img).load(function(){
				canvas.drawImage(img,0,0);
			});
			function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
			function toHex(n) {
				n = parseInt(n,10);
				if (isNaN(n)) return "00";
				n = Math.max(0,Math.min(n,255));
				return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
			}

			$(this).click(function(event){
				var x = event.pageX - this.offsetLeft;
				var y = event.pageY - this.offsetTop;
				var img_data = canvas.getImageData(x, y, 1, 1).data;
				var R = img_data[0];
				var G = img_data[1];
				var B = img_data[2];  var rgb = R + ',' + G + ',' + B;
				var hex = rgbToHex(R,G,B);
				if(parametres.callback){
					parametres.callback(hex);
				}
			});
		});
	};
})(jQuery);