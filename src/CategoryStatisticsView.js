StatisticsModule.CategoryStatisticsView = (function() {
	var that = {}, 
	categoryStatisticsTableItemCount = 0, 
	categoryStatisticsCompareTableItemCount = 0, 
	categoryStatisticsSelectItemCount = 0, 
	categoryData = {}, 

	init = function() {
		addCategoryStatisticsSelectItem(); 
		$("#categoryStatisticsOptionsAddButton").on('click', onCategoryStatisticsOptionsAddButtonClick); 
		return that; 
	}, 

	onCategoryStatisticsOptionsAddButtonClick = function(event) {
		$(".selectSeparator:last").show(); 
		addCategoryStatisticsSelectItem(); 
	}, 

	addTagCloud = function(object) {
		categoryData = object;
		var words = [];
		for (var key in object) {
			console.log(key); 
			if(key != "all") {
			var faculty = object[key];
			var text = faculty["name"];
			var weight = faculty["courses"];
			var color = faculty["color"];
			var materials = faculty["materials"];
			var subscriber = faculty["subscriber"];
			var trainer = faculty["trainer"];
			var id = faculty["id"];
			var word = {};
			word['text'] = text;
			word['weight'] = weight;
			word['color'] = color;
			word['materials'] = materials;
			word['subscriber'] = subscriber;
			word['trainer'] = trainer;
			word['id'] = id;
			words.push(word); 
			}
		}
		$("#instituteSelect").hide();
		$("#courseOfStudiesSelect").hide();
		$("#categoryStatsTab").on("click", {"words": words}, onCategoryStatsTabClick);
	}, 

	onCategoryStatsTabClick = function(event) {
		initCloud(event.data.words);
	}, 

	initCloud = function(words) {

		$("#tagcloud").jQCloud(words, {
	      	autoResize: true, 
	      	removeOverflowing: false, 
	      	fontSize: {
		    	from: 0.06,
		    	to: 0.02
		  	}
	    });

		setTimeout(function () {
		    var obj = $("#tagcloud").data("jqcloud");
		    var data = obj.word_array;
		    var count = 0;
		    for (var i in data) {
		    	var text = data[i]["text"];
		    	var color = data[i]["color"];
		    	var id = data[i]["id"];
		        $("#" + data[i]["attr"]["id"]).css("color", color);
		        //$('#facultySelect').selectpicker();
		        $("#facultySelect").append("<option value='"+ id + "'>" + text + "</option>");
		        //$("#facultySelect").selectpicker('refresh');
				//$("#facultySelect").selectpicker('val', "-");
		        count++;
		    }
		}, 100);
		$("#categoryStatisticsModal").on('shown.bs.modal', {'words': words}, onCategoryStatisticsModalShow); 
	}, 

	onCategoryStatisticsModalShow = function(event) {
		drawPieChart(event.data.words);
	},

	drawPieChart = function(words) {
		var data = [], chart_labels = [], chart_series_colors = [];
		var weightSum = 0; 
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			var weight = word["weight"];
			var text = word["text"];
			var color = word["color"];
			var materials = word["materials"];
			var subscriber = word["subscriber"];
			var trainer = word["trainer"];
			weightSum += parseInt(weight);
			data.push(weight);
			chart_labels.push(text);
			chart_series_colors.push(color);
			addCategoryStatisticsTableItem(text, weight, materials, subscriber, trainer); 
		}
		for (var i = 0; i < data.length; i++) {
			data[i] = (parseInt(data[i])/weightSum) *100;
		}
	
		var coursePie = $.jqplot ('coursePie', [data], 
	    { 
	        seriesDefaults: {
	            renderer: jQuery.jqplot.PieRenderer, 
	            rendererOptions: {
	                //dataLabels: chart_labels, 
	                showDataLabels: true
	            }
	        }, 
	        legend: {
	            show:true,
	            location: 'e',
	            labels: chart_labels
	        },
	        highlighter: {
			    show: true,
			    useAxesFormatters: false, // must be false for piechart   
			    tooltipLocation: 'w',
			    formatString:'%s, %P',
			},
	        seriesColors: chart_series_colors
	    });
	}, 

	makeCategoryStatisticsTableItem = function(options) {
		var item = StatisticsModule.CategoryStatisticsTableItem().init({
			id: options.id,
			category: options.category,
			courseCount: options.courseCount,
			materialsCount: options.materialsCount, 
			subscriberCount: options.subscriberCount, 
			trainerCount: options.trainerCount
		}); 
		var $el = item.render(); 
		$("#categoryStatisticsTableItemContainer").append($el); 
	}, 

	addCategoryStatisticsTableItem = function(category, courseCount, materialsCount, subscriberCount, trainerCount) {
		makeCategoryStatisticsTableItem({
			id: "categoryStatisticsTableItem" + categoryStatisticsTableItemCount, 
			category: category,
			courseCount: courseCount, 
			materialsCount: materialsCount, 
			subscriberCount: subscriberCount, 
			trainerCount: trainerCount
		});
		categoryStatisticsTableItemCount++;
	},

	makeCategoryStatisticsCompareTableItem = function(options) {
		var item = StatisticsModule.CategoryStatisticsCompareTableItem().init({
			id: options.id, 
			title: options.title, 
			trainerCount: options.trainerCount, 
			subscriberCount: options.subscriberCount, 
			materialsCount: options.materialsCount
		}); 
		var $el = item.render(); 
		$("#categoryStatisticsCompareTableItemContainer").append($el); 
	}, 

	addCategoryStatisticsCompareTableItem = function(count, title, trainerCount, subscriberCount, materialsCount) {
		makeCategoryStatisticsCompareTableItem({
			id: "categoryStatisticsCompareTableItem" + count, 
			title: title, 
			trainerCount: trainerCount, 
			subscriberCount: subscriberCount, 
			materialsCount: materialsCount
		});
		categoryStatisticsCompareTableItemCount++;
	},

	makeCategoryStatisticsSelectItem = function(options) {
		var item = StatisticsModule.CategoryStatisticsSelectItem().init({
			id: options.id
		}); 
		var $el = item.render(); 
		$("#categoryStatisticsSelectItemContainer").append($el); 
	}, 

	addCategoryStatisticsSelectItem = function() {
		makeCategoryStatisticsSelectItem({
			id: "categoryStatisticsSelectItem" + categoryStatisticsSelectItemCount
		});
		categoryStatisticsSelectItemCount++;

		$('#facultySelect').on('change', function(){
		   var selected = $('#facultySelect option:selected').val();
		   console.log("selected", selected); 
		   var id = $('#facultySelect option:selected').attr("value"); 
		   $("#instituteSelect").show();
		   $("#courseOfStudiesSelect").hide();

		   var all = categoryData["all"][selected];
		   var name = all["name"];
		   var institutes = all["subcategory"];
		   var subscriber = all["subscriber"];
		   var trainer = all["trainer"];
		   var materials = all["materials"];
		   $("#categoryStatisticsCompareTableItem" + categoryStatisticsSelectItemCount).remove(); 
		   addCategoryStatisticsCompareTableItem(categoryStatisticsSelectItemCount, name, trainer, subscriber, materials);

		   $("#instituteSelect").empty(); 
		   $("#instituteSelect").append("<option>-</option>");
		   for (var i in institutes) {
		   		var id = institutes[i]["id"];
		    	var text = institutes[i]["name"];
		        $("#instituteSelect").append("<option value='"+ id + "'>" + text + "</option>");
		    }

		    $('#a').focus();
		});
		$('#instituteSelect').on('change', function(){
			var selectedFaculty = $('#facultySelect option:selected').val();
		   	var selectedInstitute = $('#instituteSelect option:selected').val();
		   	var id = $('#instituteSelect option:selected').attr("value"); 
		   	console.log(selectedFaculty, selectedInstitute);
		   	$("#courseOfStudiesSelect").show();

			var all = categoryData["all"][selectedFaculty]["subcategory"][selectedInstitute]; 
			var courseOfStudies = all["subcategory"];
		   	var name = all["name"];
		   	var institutes = all["subcategory"];
		   	var subscriber = all["subscriber"];
		   	var trainer = all["trainer"];
		   	var materials = all["materials"];
		   	$("#categoryStatisticsCompareTableItem" + categoryStatisticsSelectItemCount).remove(); 
		   	addCategoryStatisticsCompareTableItem(categoryStatisticsSelectItemCount, name, trainer, subscriber, materials);

			$("#courseOfStudiesSelect").empty(); 
			$("#courseOfStudiesSelect").append("<option>-</option>");
			for (var i in courseOfStudies) {
				var id = courseOfStudies[i]["id"];
		    	var text = courseOfStudies[i]["name"];
		        $("#courseOfStudiesSelect").append("<option value='"+ id + "'>" + text + "</option>");
		    }

		    $('#a').focus();
		});
		$('#courseOfStudiesSelect').on('change', function(){
			var selectedFaculty = $('#facultySelect option:selected').val();
		   	var selectedInstitute = $('#instituteSelect option:selected').val();
		   	var selectedCourseOfStudy = $('#courseOfStudiesSelect option:selected').val();
		   	var id = $('#courseOfStudiesSelect option:selected').attr("value"); 

			var all = categoryData["all"][selectedFaculty]["subcategory"][selectedInstitute]["subcategory"][selectedCourseOfStudy]; 
			var courseOfStudies = all["subcategory"];
		   	var name = all["name"];
		   	var institutes = all["subcategory"];
		   	var subscriber = all["subscriber"];
		   	var trainer = all["trainer"];
		   	var materials = all["materials"];
		   	$("#categoryStatisticsCompareTableItem" + categoryStatisticsSelectItemCount).remove(); 
		   	addCategoryStatisticsCompareTableItem(categoryStatisticsSelectItemCount, name, trainer, subscriber, materials);
			$('#a').focus();
		});
	}; 

	that.addTagCloud = addTagCloud; 
	that.init = init; 
	return that; 
})();