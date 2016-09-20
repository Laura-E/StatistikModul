StatisticsModule.CategoryStatisticsView = (function() {
	var that = {}, 
	categoryStatisticsTableItemCount = 0, 
	categoryStatisticsCompareTableItemCount = 0, 
	categoryStatisticsSelectItemCount = 0, 
	categoryData = {}, 

	init = function() {
		//$('#inactiveCoursesTable').hide(); 
		//$('#inactiveUsersTable').hide();
		addCategoryStatisticsSelectItem(); 
		$("#categoryStatisticsOptionsAddButton").on('click', onCategoryStatisticsOptionsAddButtonClick); 
		$("#searchInactiveUsersButton").on('click', onSearchInactiveUsersButtonClick); 
		return that; 
	}, 

	onSearchInactiveUsersButtonClick = function(event) {
		var kind = $("#inactivityKindSelect").val(); 
		var count = $("#inactiveUsersPeriodSelect").val(); 
		var dateType = $("#inactiveUsersPeriodYearMonthSelect").val(); 
		dateType = ((dateType == "Jahr/e") ? "year" : "month");
		$(that).trigger("getInactiveCoursesAndUsers", [kind, count, dateType]);
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
		        $("#facultySelect").append("<option value='"+ id + "'>" + text + "</option>");
		        count++;
		    }
		}, 100);
		$("#categoryStatisticsModal").on('shown.bs.modal', {'words': words}, onCategoryStatisticsModalShow); 
	}, 

	onCategoryStatisticsModalShow = function(event) {
		drawPieChart(event.data.words);
	},

	showInactiveCoursesAndUsers = function(inactiveUsers) {
		//$('#inactiveCoursesTable').hide(); 
		//$(".table-responsive").hide(); 
		//$('#inactiveUsersTable').show();
		$("#inactiveCoursesAndUsersTableContainer").empty(); 
		addInactiveUsersTable(); 
		//$(".pages").empty(); 
		for (var i in inactiveUsers) {
			var inactiveUser = inactiveUsers[i];
			var id = inactiveUser["id"];
			var firstname = inactiveUser["firstname"];
			var lastname = inactiveUser["lastname"];
			var email = inactiveUser["email"];
			var lastlogin = inactiveUser["date_formatted"];
			addInactiveUsersTableItem(id, firstname, lastname, email, lastlogin);
		} 
		$('#inactiveUsersTable').DataTable({
		     columnDefs: [
		       { type: 'de_date', targets: 4 }
		     ], 
		     "language": {
	            "lengthMenu": "_MENU_ Ergebnisse pro Seite",
	            "zeroRecords": "Es konnten keine Ergebnisse gefunden werden",
	            "info": "Seite _PAGE_ von _PAGES_",
	            "infoEmpty": "Keine Ergebnisse verfügbar"
	        }
		  }); 
	}, 

	showInactiveCourses = function(inactiveCourses) {
		//$('#inactiveUsersTable').hide(); 
		//$(".table-responsive").hide(); 
		$("#inactiveCoursesAndUsersTableContainer").empty(); 
		addInactiveCoursesTable(); 
		//$('#inactiveCoursesTable').show(); 
		//$(".pages").empty(); 
		for (var i in inactiveCourses) {
			var inactiveCourse = inactiveCourses[i];
			var id = inactiveCourse["id"];
			var name = inactiveCourse["fullname"];
			var lastActivity = inactiveCourse["date_formatted"];
			addInactiveCoursesTableItem(id, name, lastActivity);
		} 
		$('#inactiveCoursesTable').DataTable({
		     columnDefs: [
		       { type: 'de_date', targets: 2 }
		     ], 
		     "language": {
	            "lengthMenu": "_MENU_ Ergebnisse pro Seite",
	            "zeroRecords": "Es konnten keine Ergebnisse gefunden werden",
	            "search": "Suche:",
	            "info": "Seite _PAGE_ von _PAGES_",
	            "infoEmpty": "Keine Ergebnisse verfügbar", 
	            "paginate": {
			        "first":      "Anfang",
			        "last":       "Ende",
			        "next":       "Vor",
			        "previous":   "Zurück"
			    },
	        }
		  }); 
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


	makeInactiveUsersTable = function(options) {
		var item = StatisticsModule.InactiveUsersTable().init({
			id: options.id
		}); 
		var $el = item.render(); 
		$("#inactiveCoursesAndUsersTableContainer").append($el); 
	}, 

	addInactiveUsersTable = function() {
		makeInactiveUsersTable({
			id: "inactiveUsersTable"
		});
	},

	makeInactiveCoursesTable = function(options) {
		var item = StatisticsModule.InactiveCoursesTable().init({
			id: options.id
		}); 
		var $el = item.render(); 
		$("#inactiveCoursesAndUsersTableContainer").append($el); 
	}, 

	addInactiveCoursesTable = function() {
		makeInactiveCoursesTable({
			id: "inactiveCoursesTable"
		});
	},



	makeInactiveUsersTableItem = function(options) {
		var item = StatisticsModule.InactiveUsersTableItem().init({
			id: options.id,
			userId: options.userId, 
			firstname: options.firstname,
			lastname: options.lastname,
			email: options.email, 
			lastlogin: options.lastlogin
		}); 
		var $el = item.render(); 
		$("#inactiveUsersTableItemContainer").append($el); 
	}, 

	addInactiveUsersTableItem = function(id, firstname, lastname, email, lastlogin) {
		makeInactiveUsersTableItem({
			id: "inactiveUsersTableItem" + id, 
			userId: id, 
			firstname: firstname,
			lastname: lastname, 
			email: email, 
			lastlogin: lastlogin
		});
	},

	makeInactiveCoursesTableItem = function(options) {
		var item = StatisticsModule.InactiveCoursesTableItem().init({
			id: options.id,
			courseId: options.courseId, 
			name: options.name,
			lastActivity: options.lastActivity
		}); 
		var $el = item.render(); 
		$("#inactiveCoursesTableItemContainer").append($el); 
	}, 

	addInactiveCoursesTableItem = function(id, name, lastActivity) {
		makeInactiveCoursesTableItem({
			id: "inactiveCoursesTableItem" + id, 
			courseId: id, 
			name: name,
			lastActivity: lastActivity
		});
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

	/*showCategoryStatistics = function(all) {

	}, */

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
		   //showCategoryStatistics(all); 
		   var name = all["name"];
		   var institutes = all["subcategory"];
		   var subscriber = all["subscriber"];
		   var trainer = all["trainer"];
		   var materials = all["materials"];

		   console.log(materials, subscriber, trainer); 
		   $("#categoryMaterialsCount").html(materials); 
		   $("#categorySubscriberCount").html(subscriber); 
		   $("#categoryTrainerCount").html(trainer); 

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

		   	$("#categoryMaterialsCount").html(materials); 
		   	$("#categorySubscriberCount").html(subscriber); 
		   	$("#categoryTrainerCount").html(trainer); 

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

		   	$("#categoryMaterialsCount").html(materials); 
		   	$("#categorySubscriberCount").html(subscriber); 
		   	$("#categoryTrainerCount").html(trainer); 

		   	$("#categoryStatisticsCompareTableItem" + categoryStatisticsSelectItemCount).remove(); 
		   	addCategoryStatisticsCompareTableItem(categoryStatisticsSelectItemCount, name, trainer, subscriber, materials);
			$('#a').focus();
		});
	}; 

	that.addTagCloud = addTagCloud; 
	that.showInactiveCoursesAndUsers = showInactiveCoursesAndUsers;
	that.showInactiveCourses = showInactiveCourses; 
	that.init = init; 
	return that; 
})();