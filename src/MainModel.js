StatisticsModule.MainModel = (function() {
	var that = {},
	spinnerOverlay, 
	spinner, 

	init = function() {
		$("#loadingOverlay").width($("body").width());
		$("#loadingOverlay").height($("body").height());
		initSpinner(); 
		startSpinner();
		getMinAndMaxDate(); 
		getLoginStatistics();
		getReadWriteData();  
		getCourseData(); 
		getCategoryData();
		return that; 
	}, 

	initSpinner = function() {
		var opts = {
		  lines: 13 // The number of lines to draw
			, length: 10 // The length of each line
			, width: 5 // The line thickness
			, radius: 12 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#fff' // #rgb or #rrggbb or array of colors
			, opacity: 0.25 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1.3 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '50%' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
		};

		spinnerOverlay = $("#loadingOverlay")[0];
		spinner = new Spinner(opts).spin(spinnerOverlay); 
		spinner.stop(); 
	}, 

	stopSpinner = function() {
		$("body").css("overflow-y", "visible");
		$("#loadingOverlay").hide(); 
	    spinner.stop(); 
	}, 

	startSpinner = function() {
		$('html, body').animate({
	        scrollTop: $("body").offset().top
	    }, 10);
		$("body").css("overflow-y", "hidden");
		$("#loadingOverlay").show(); 
		spinner.spin(spinnerOverlay);
	}, 

	getMinAndMaxDate = function() {
		$.get("src/php/functions.php?command=getMinAndMaxDate").done(
		function(data) {
			var json = data; 
			var object = jQuery.parseJSON(json); 
			console.log(object); 
			$(that).trigger('initTimePeriod', object);
		});
	}
	getCategoryData = function() {
		$.get("src/php/functions.php?command=getCategoryData").done(
		function(data) {
			var json = data; 
			var object = jQuery.parseJSON(json); 
			console.log(object); 
			$(that).trigger('addTagCloud', object);
			stopSpinner(); 
		}); 
	}, 

	getLoginStatistics = function() {
		$.get("src/php/functions.php?command=getLoginCount").done(
		function(data) {
			var json = data; 
			var object = jQuery.parseJSON(json); 
			$(that).trigger('drawChart', [object, "login"]);
		}); 
	}, 

	getReadWriteData = function() {
		$.get("src/php/functions.php?command=getReadWriteData").done(
		function(data) {
			var json = data; 
			var object = jQuery.parseJSON(json); 
			console.log(object); 
			$(that).trigger('drawChart', [object, "readWrite"]);
		}); 
	}, 

	getCourseData = function() {
		$.get("src/php/functions.php?command=getCourseData").done(
		function(data) {
			var json = data; 
			var object = jQuery.parseJSON(json); 
			console.log(object); 
			$(that).trigger('drawChart', [object, "course"]);
		});
	}, 

	getCounts = function(start, end) {
		console.log(start, end); 
		$.ajax({url: "src/php/functions.php?command=getCounts", data: {start: start, end: end}}).done(
		function(data) {
			var json = data; 
			var object = jQuery.parseJSON(json); 
			console.log(object); 
			$(that).trigger('changeCountValues', [object]);
		});
	}; 


	that.init = init; 
	that.getCounts = getCounts; 
	return that; 
})(); 
