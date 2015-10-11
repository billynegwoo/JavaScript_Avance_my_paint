jQuery(document).ready(function($) {
	var x = 450;
	var	y = 100;
	var dx;
	var dy;
	var WIDTH;
	var HEIGHT;
	var intervalId = 0;
	var paddlex;
	var paddleh;
	var paddlew;
	var bricks;
	var NROWS;
	var NCOLS;
	var BRICKWIDTH;
	var BRICKHEIGHT;
	var PADDING;
	var tool = false;
	var tool_default = 'pencil',
	color = '#000',
	wheight = 1;
	var tools = {};
	var started = false;
	var canvas, context, canvas2, context2;
	var imgB4;
	var fun = false;
	canvas2 = document.getElementById('canvasDiv2');
	context2 = canvas2.getContext('2d');
	canvas2.height = $('#container').height();
	canvas2.width = $('#container').width();

	var container = $('#container');
	canvas = document.createElement('canvas');
	canvas.id = 'canvasDiv';
	canvas.width = canvas2.width;
	canvas.height = canvas2.height;
	container.append(canvas);
	context = canvas.getContext('2d');
	/*
	 * BickBreacker.
	 */
	function circle(x,y,r) {
		context.beginPath();
		context.arc(x, y, r, 0, Math.PI*2, true);
		context.closePath();
		context.fill();
	}

	function rect(x,y,w,h) {
		context.beginPath();
		context.rect(x,y,w,h);
		context.closePath();
		context.fill();
	}

	function init_paddle() {
		paddlex = WIDTH / 2;
		paddleh = 10;
		paddlew = 75;
	}

	function initbricks() {
		NROWS = 5;
		NCOLS = 10;
		BRICKWIDTH = (WIDTH/NCOLS) - 1;
		BRICKHEIGHT = 15;
		PADDING = 1;

		bricks = new Array(NROWS);
		for (i=0; i < NROWS; i++) {
			bricks[i] = new Array(NCOLS);
			for (j=0; j < NCOLS; j++) {
				bricks[i][j] = 1;
			}
		}
	}

	function init(){
		WIDTH = $('#container').width();
		HEIGHT = $('#container').height();
		intervalId = setInterval(draw, 10);
	}

	function clear()
	{
		context.clearRect(0,0,WIDTH,HEIGHT);
	}


	function draw(){
		clear();
		fun = true;
		count = NROWS * NCOLS;
		circle(x,y,10);
		rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);
		for (i=0; i < NROWS; i++) {
			for (j=0; j < NCOLS; j++) {
				if (bricks[i][j] == 1) {
					rect((j * (BRICKWIDTH + PADDING)) + PADDING, 
						(i * (BRICKHEIGHT + PADDING)) + PADDING,
						BRICKWIDTH, BRICKHEIGHT);
				}
				if (bricks[i][j] == 0)count --;
				if (count == 0){
					clear();
					clearInterval(intervalId);
					fun = false;
				}

			}
		}
		rowheight = BRICKHEIGHT + PADDING;
		colwidth = BRICKWIDTH + PADDING;
		row = Math.floor(y/rowheight);
		col = Math.floor(x/colwidth);

		if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
			dy = -dy;
			bricks[row][col] = 0;
		}

		if (x + dx > WIDTH || x + dx < 0)dx = -dx;
		if (y + dy < 0)dy = -dy;
		else if (y + dy > HEIGHT) {
			if (x > paddlex && x < paddlex + paddlew){
				dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
				dy = -dy;
			}
			else{
				clearInterval(intervalId);
				clear();
				fun = false;
			}
		}
		x += dx;
		y += dy;
	}

	$('#fun').on('click', function(e) {
		if(fun)return false;
		e.preventDefault();
		fun = true;
		x = 450;
		y = 100;
		dx = 2;
		dy = 4;
		init();
		init_paddle();
		initbricks();
	});

	/*
	 * Drawing.
	 */
	
	$('#canvasDiv').bind('mousemove mouseup mousedown',function(e){
		e.preventDefault();
		paddlex = e.clientX - 550;
		if (!fun){
			ev_canvas(e)
		}
	});
	$('#canvasDiv').bind('dragenter dragover',function(e) {
		e.preventDefault();
		e.stopPropagation();
	});

	$('#color').css({
		'background-color': color
	});

	$('#canvasDiv').on('drop', function(event){
		event.preventDefault()
		var img = new Image();
		var reader = new FileReader();
		reader.onload = function(event) {
			img.src = event.target.result;
		};
		reader.readAsDataURL(event.originalEvent.dataTransfer.files[0]);
		$(img).load(function(){
			context.drawImage(img,0,0,$('#container').width(),$('#container').height());
			img_update();
		});
	});

	$('#canvas_picker').colorpicker({'callback':function(data){
		color = "#"+data;
		$('#color').css({
			'background-color': color
		});
	}});

	$('#tool').on('change', function(e){
		if (tools[this.value]) {
			tool = new tools[this.value]();
		}
	})
	$('.mdl-js-slider').on('change',function(){
		wheight = this.value;
	})
	

	tools.pencil = function(){
		var tool = this;
		this.started = false;
		
		this.mousedown = function (ev) {
				context.beginPath();
				context.lineWidth = wheight;
				context.lineJoin = context.lineCap = 'round';
				context.strokeStyle = color;
				context.moveTo(ev._x, ev._y);
				tool.started = true;
				context.lineTo(ev._x +1, ev._y +1);		
		};
		this.mousemove = function (ev) {
			if (tool.started) {
				context.lineTo(ev._x, ev._y);
				context.stroke();
			}
		};
		this.mouseup = function (ev) {
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
				img_update()
			}
		};
	}

	tools.rubber = function(){
		var tool = this;
		this.started = false;
		
		this.mousedown = function (ev) {
			context.beginPath();
			context.lineWidth = wheight;
			context.lineJoin = context.lineCap = 'round';
			context.strokeStyle = "#FFF";
			context.moveTo(ev._x, ev._y);
			tool.started = true;
			context.lineTo(ev._x +1, ev._y +1);
		};
		this.mousemove = function (ev) {
			if (tool.started) {
				context.lineTo(ev._x, ev._y);
				context.stroke();
			}
		};
		this.mouseup = function (ev) {
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
				img_update()
			}
		};
	}
	tools.rectangle = function(){
		var tool = this;
		this.started = false;

		this.mousedown = function(ev){
			context.lineWidth = wheight;
			context.strokeStyle = color;
			tool.started = true;
			tool.x0 = ev._x;
			tool.y0 = ev._y;
		};

		this.mousemove = function(ev){
			if (!tool.started) {
				return;
			}
			var x = Math.min(ev._x,	tool.x0),
			y = Math.min(ev._y,	tool.y0),
			w = Math.abs(ev._x - tool.x0),
			h = Math.abs(ev._y - tool.y0);

			context.clearRect(0, 0, canvas.width, canvas.height);

			context.strokeRect(x, y, w, h);
		}
		this.mouseup = function(ev) {
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
				img_update()
			}
		};
	}
	tools.line = function(){
		var tool = this;
		this.started = false;

		this.mousedown = function(ev){
			context.lineWidth = wheight;
			context.strokeStyle = color;
			tool.started = true;
			tool.x0 = ev._x,
			tool.y0 = ev._y;
		}
		this.mousemove = function(ev){
			if(!tool.started){
				return;
			}
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.beginPath()
			context.lineJoin = context.lineCap = 'round';
			context.moveTo(tool.x0,tool.y0);
			context.lineTo(ev._x, ev._y);
			context.stroke();
			context.closePath();
		}
		this.mouseup = function(ev){
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
				img_update()
			}
		}
	}
	tools.circle = function(){
		var tool = this;
		this.started = false;
		this.mousedown = function(ev){
			context.lineWidth = wheight;
			context.strokeStyle = color;
			tool.started = true;
			tool.x0 = ev._x,
			tool.y0 = ev._y;
		}
		this.mousemove = function(ev){
			if(!tool.started){
				return;
			}
			context.clearRect(0, 0, canvas.width, canvas.height);
			var radius = Math.abs(tool.x0 - ev._x);

			context.beginPath();

			context.arc(tool.x0, tool.y0, radius, 0, Math.PI * 2, false);
			context.closePath();
			context.stroke();
		}
		this.mouseup = function (ev) {
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
				img_update();
			}
		};
	}
	if (tools[tool_default]) {
		tool = new tools[tool_default]();
		$('#tool').val = tool_default;
	}

	function ev_canvas(ev) {
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
		var func = tool[ev.type];
		if (func) {
			func(ev);
		}
	}
	function img_update() {
		context2.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
	}


	/*
	 * Side menu.
	 */
	$(".close").css("display", "none");

	var isMenuOpen = false;
	var isColorOpen = false;

	function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}
	$('.menu_btn').click(function()
	{
		if (isMenuOpen == false)
		{
			$("#menu").clearQueue().animate({
				right : '0'
			})
			$("#page").clearQueue().animate({
				"margin-left" : '-290px'
			})

			$(this).fadeOut(200);
			$(".close").fadeIn(300);

			isMenuOpen = true;
		} 
	});

	$("#color").click(function() {
		if(isColorOpen == false){
			isColorOpen = true;
			$("#canvas_picker").show('slow');

		}else if(isColorOpen == true){
			isColorOpen = false;
			$("#canvas_picker").hide('slow');
		}
	});

	$('.close').click(function()
	{
		if (isMenuOpen == true)
		{
			$("#menu").clearQueue().animate({
				right : '-240px'
			})
			$("#page").clearQueue().animate({
				"margin-left" : '0px'
			})

			$(this).fadeOut(200);
			$(".menu_btn").fadeIn(300);

			isMenuOpen = false;
		}
	});

	$("#save").on('click', function() {
		downloadCanvas(this, 'canvasDiv2', 'canvas.png');
	});

	$("#clear").on('click', function(event) {
		event.preventDefault();
		context2.clearRect(0, 0, canvas2.width, canvas.height);
	});

});