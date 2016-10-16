StatisticsModule.CategoryStatisticsView = (function() {
	var that = {}, 
	categoryStatisticsTableItemCount = 0, 
	categoryStatisticsCompareTableItemCount = 0, 
	categoryStatisticsSelectItemCount = 0, 

	init = function() {
		addCategoryStatisticsSelectItem();  
		$("#searchInactiveUsersButton").on('click', onSearchInactiveUsersButtonClick); 

		return that; 
	}, 

	/*
 	plotting a chart with horizontal bars
 	*/
	initCategoryPlot = function(plot, chartData, title) {
		setTimeout(function () {
			plot1 = $.jqplot(plot, [chartData], {
	            captureRightClick: true,
	            title: title, 
	            seriesDefaults:{
	                renderer:$.jqplot.BarRenderer,
	                shadowAngle: 135,
	                rendererOptions: {
	                    barDirection: 'horizontal', 
	                    color: "teal", 
	                    fillToZero: true, 
	                    shadowOffset: 0
	                },
	                pointLabels: {show: true, location: 'e', edgeTolerance: -15, formatString: '%d'}
	            },
	            axes: {
	                yaxis: {
	                    renderer: $.jqplot.CategoryAxisRenderer
	                }, 
	                xaxis: {
	                	tickOptions: {
					        show: false
					    },
					    rendererOptions: {
					        drawBaseline: false
					    }
	                }
	            },
	            grid: {drawGridlines: false, background: 'transparent', borderColor: 'transparent', shadow: false, drawBorder: true},
		    });
	    }, 100);
		
	}, 

	/*
 	triggers the search for inactive users on button clicked
 	*/
	onSearchInactiveUsersButtonClick = function(event) {
		var kind = $("#inactivityKindSelect").val(); 
		var count = $("#inactiveUsersPeriodSelect").val(); 
		var dateType = $("#inactiveUsersPeriodYearMonthSelect").val(); 
		dateType = ((dateType == "Jahr/e") ? "year" : "month");
		$(that).trigger("getInactiveCoursesAndUsers", [kind, count, dateType]);
	}, 

	/*
 	momentarily unused methode; additionally if more categories should be compared
 	*/
	onCategoryStatisticsOptionsAddButtonClick = function(event) {
		$(".selectSeparator:last").show(); 
		addCategoryStatisticsSelectItem(); 
	}, 

	/*
 	generates a tag cloud;
 	is given a json object
 	*/
	addTagCloud = function(object) {
		//categoryData = object;
		var words = [];
		for (var key in object) {
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
		$("#instituteSelect").hide();
		$("#courseOfStudiesSelect").hide();
		$("#categoryStatsTab").on("click", {"words": words}, onCategoryStatsTabClick);
	}, 

	/*
 	needs to call the method seperatily to be loaded on tab click
 	*/
	onCategoryStatsTabClick = function(event) {
		initCloud(event.data.words);
	}, 

	/*
 	initializes the tag cloud 
 	*/
	initCloud = function(words) {
		var level = 1;
		var value = 0;
		$(that).trigger("getCategoriesForParent", [value, level]);

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
		}, 100);
		$("#categoryStatisticsModal").on('shown.bs.modal', {'words': words}, onCategoryStatisticsModalShow); 
	},  

	/*
 	handles event and draw pie chart when more button is clicked
 	*/
	onCategoryStatisticsModalShow = function(event) {
		drawPieChart(event.data.words);
	},

	/*
 	initializes the view of the inactive users; not the courses!!
 	*/
	showInactiveCoursesAndUsers = function(inactiveUsers) {
		$("#inactiveCoursesAndUsersTableContainer").empty(); 
		addInactiveUsersTable(); 
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

	/*
 	views the inactive courses
 	*/
	showInactiveCourses = function(inactiveCourses) {
		$("#inactiveCoursesAndUsersTableContainer").empty(); 
		addInactiveCoursesTable(); 
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

	/*
 	initializes the pie chart
 	*/
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

	/*
 	sets up the table rows underneath the dropdown menu for selecting the categories
 	*/
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

	/*
 	adds the rows to the table
 	*/
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

	/*
 	initializes the inactive user table, and added to the container
 	*/
	makeInactiveUsersTable = function(options) {
		var item = StatisticsModule.InactiveUsersTable().init({
			id: options.id
		}); 
		var $el = item.render(); 
		$("#inactiveCoursesAndUsersTableContainer").append($el); 
	}, 

	/*
 	adds the whole inactive user table
 	*/
	addInactiveUsersTable = function() {
		makeInactiveUsersTable({
			id: "inactiveUsersTable"
		});
	},

	/*
 	initializes the inactive courses table, added to the container
 	*/
	makeInactiveCoursesTable = function(options) {
		var item = StatisticsModule.InactiveCoursesTable().init({
			id: options.id
		}); 
		var $el = item.render(); 
		$("#inactiveCoursesAndUsersTableContainer").append($el); 
	}, 

	/*
 	adds the whole inactive courses table
 	*/
	addInactiveCoursesTable = function() {
		makeInactiveCoursesTable({
			id: "inactiveCoursesTable"
		});
	},

	/*
 	initializes a row of the inactive users table
 	*/
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

	/*
 	adds an item of the inactive user table
 	*/
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

	/*
 	initializes an item of the inactive courses table
 	*/
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

	/*
 	adds an item of the inactive courses table
 	*/
	addInactiveCoursesTableItem = function(id, name, lastActivity) {
		makeInactiveCoursesTableItem({
			id: "inactiveCoursesTableItem" + id, 
			courseId: id, 
			name: name,
			lastActivity: lastActivity
		});
	},

	/*
 	initializes a row of the table beneath the category selection
 	*/
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

	/*
 	adds a row to the table beneath the category selection
 	*/
	addCategoryStatisticsCompareTableItem = function(title, trainerCount, subscriberCount, materialsCount) {
		makeCategoryStatisticsCompareTableItem({
			id: "categoryStatisticsCompareTableItem" + categoryStatisticsCompareTableItemCount, 
			title: title, 
			trainerCount: trainerCount, 
			subscriberCount: subscriberCount, 
			materialsCount: materialsCount
		});
		categoryStatisticsCompareTableItemCount++;
	},

	/*
 	initialices the drop down items for the category selection
 	*/
	makeCategoryStatisticsSelectItem = function(options) {
		var item = StatisticsModule.CategoryStatisticsSelectItem().init({
			id: options.id
		}); 
		var $el = item.render(); 
		$("#categoryStatisticsSelectItemContainer").append($el); 
	}, 

	/*
 	clears the existing charts when a new category, or a under-category is selected and adds new charts
 	*/
	addCategorySelectItem = function(top, children, level) {
		$("#categorySubscriberCount").html(top["subscriber"]);  
		$("#categoryTrainerCount").html(top["trainer"]); 
		$("#categoryMaterialsCount").html(top["materials"]); 


		$("#categoryStatisticsCompareTable").show(); 
		if(children != false) {
			if ($("#categoryStatisticsSelectItem0 select").length < level) {
				$("#categoryStatisticsSelectItem0").append('<select></select>');
			}
			$("#categoryStatisticsSelectItem0 select:nth-child(" + level + ")").empty();
			$("#categoryStatisticsSelectItem0 select:nth-child(" + level + ")").append('<option value="-1">-</option>');
			$("#categoryStatisticsSelectItem0 select:nth-child(" + level + ") option[value='-1']").prop("selected", true);
			$("#categoryStatisticsCompareTableItemContainer").empty(); 
			var materialsChartData = []; 
			var trainerChartData = []; 
			var subscriberChartData = []; 
			for (var i in children) {
			    var name = children[i]["name"];
			    var id = children[i]["id"];

			    if('materials' in children[i]) {
			    	var subscriber = parseInt(children[i]["subscriber"]);
			    	var trainer = parseInt(children[i]["trainer"]);
			    	var materials = parseInt(children[i]["materials"]);

			    	addCategoryStatisticsCompareTableItem(name, trainer, subscriber, materials);

			    	subscriberChartData = addPlotValue(subscriberChartData, name, subscriber); 
			    	trainerChartData = addPlotValue(trainerChartData, name, trainer); 
			    	materialsChartData = addPlotValue(materialsChartData, name, materials); 
			    }

			    $("#categoryStatisticsSelectItem0 select:nth-child(" + level + ")").append("<option value='"+ id + "'>" + name + "</option>");
			    
			}
			if($("#categoryStatisticsCompareTableItemContainer tr").length == 0) {
				$("#categoryStatisticsCompareTable").hide(); 
			}
		}
		
		$("#categoriesSubscriberChart").empty().height("0px"); 
		$("#categoriesTrainerChart").empty().height("0px"); 
		$("#categoriesMaterialsChart").empty().height("0px"); 

		if(subscriberChartData != undefined && subscriberChartData.length != 0) {
			subscriberChartData.sort(function(a, b) {
		    	return a[0] - b[0];
			});
			initCategoryPlot('categoriesSubscriberChart', subscriberChartData, "Teilnehmer"); 
		}
		if(trainerChartData != undefined && trainerChartData.length != 0) {
			trainerChartData.sort(function(a, b) {
		    	return a[0] - b[0];
			});
			initCategoryPlot('categoriesTrainerChart', trainerChartData, "Dozenten"); 
		}
		if(materialsChartData != undefined && materialsChartData.length != 0) {
			materialsChartData.sort(function(a, b) {
		    	return a[0] - b[0];
			});
			initCategoryPlot('categoriesMaterialsChart', materialsChartData, "Materialien"); 
		}
	},

	/*
 	adds a value to the given chartData; neglectes the values if they're zero, NaN or undefined
 	*/
	addPlotValue = function(chartData, name, value) {
		var chartDataOne = [];
		if (!isNaN(value) && value != 0) {
			chartDataOne[1] = name; 
			chartDataOne[0] = value; 
			chartData.push(chartDataOne); 
		}
		return chartData; 
	},

	/*
 	adds a new dropdown menu, when the category selection has changed or the parent category was selected new.
 	*/
	addCategoryStatisticsSelectItem = function() {
		makeCategoryStatisticsSelectItem({
			id: "categoryStatisticsSelectItem" + categoryStatisticsSelectItemCount
		});

		$("#categoryStatisticsSelectItem" + categoryStatisticsSelectItemCount).on('change', "select", function(){
			var level = $(this).index()+1;
			var value = parseInt($(this)[0].value); 
			$("#categoryStatisticsSelectItem0 select:nth-child(n+" + (level+1 ) + ")").remove(); 
		   	++level;
		   	$(that).trigger("getCategoriesForParent", [value, level]);
		});

		categoryStatisticsSelectItemCount++;
	}; 

	that.addTagCloud = addTagCloud; 
	that.showInactiveCoursesAndUsers = showInactiveCoursesAndUsers;
	that.showInactiveCourses = showInactiveCourses; 
	that.addCategorySelectItem = addCategorySelectItem; 
	that.init = init; 
	return that; 
})();