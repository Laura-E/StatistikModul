StatisticsModule.CategoryStatisticsView = (function() {
	var that = {}, 
	categoryStatisticsTableItemCount = 0, 
	categoryStatisticsCompareTableItemCount = 0, 
	categoryStatisticsSelectItemCount = 0, 
	categoryData = {}, 

	init = function() {
		addCategoryStatisticsSelectItem(); 
		$("#categoryStatisticsOptionsAddButton").on('click', onCategoryStatisticsOptionsAddButtonClick); 
		$("#searchInactiveUsersButton").on('click', onSearchInactiveUsersButtonClick); 


		return that; 
	}, 

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
			if(key != "all" && key != "parents" && key != "courses") {
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
		    var level = 1;
		    addCategorySelectItem(level); 
		}, 100);
		$("#categoryStatisticsModal").on('shown.bs.modal', {'words': words}, onCategoryStatisticsModalShow); 
	},  

	onCategoryStatisticsModalShow = function(event) {
		drawPieChart(event.data.words);
	},

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

	makeCategoryStatisticsSelectItem = function(options) {
		var item = StatisticsModule.CategoryStatisticsSelectItem().init({
			id: options.id
		}); 
		var $el = item.render(); 
		$("#categoryStatisticsSelectItemContainer").append($el); 
	}, 

	getData = function() {
		var data = categoryData["all"]; 
		var allSelects = $("#categoryStatisticsSelectItem0 select"); 
		var length = allSelects.length; 
		allSelects.each(function(index) {
		  	var selected = $(this).find("option:selected").val();

		   	if(index == length-1) {
		   		
		   		var subscriber = ('subscriber' in data[selected]) ? data[selected]["subscriber"] : ""; 
		   		$("#categorySubscriberCount").html(subscriber);  
			  	var trainer = ('trainer' in data[selected]) ? data[selected]["trainer"] : ""; 
			  	$("#categoryTrainerCount").html(trainer); 
			  	var materials = ('materials' in data[selected]) ? data[selected]["materials"] : ""; 
			  	$("#categoryMaterialsCount").html(materials); 
		   	}

		  	if('subcategory' in data[selected]) {
		  		data = data[selected]["subcategory"];
		  	} else {
		  		data = false; 
		  	}
		});
		return data; 
	}, 

	addCategorySelectItem = function(level) {
		var data = getData(); 
		$("#categoryStatisticsCompareTable").show(); 
		if(data != false) {
			if ($("#categoryStatisticsSelectItem0 select").length < level) {
				$("#categoryStatisticsSelectItem0").append("<select></select>");
			}
			$("#categoryStatisticsSelectItem0 select:nth-child(" + level + ")").empty();
			$("#categoryStatisticsSelectItem0 select:nth-child(" + level + ")").append("<option>-</option>");
			$("#categoryStatisticsCompareTableItemContainer").empty(); 
			var materialsChartData = []; 
			var trainerChartData = []; 
			var subscriberChartData = []; 
			for (var i in data) {
			    var name = data[i]["name"];
			    //var color = data[i]["color"];
			    var id = data[i]["id"];

			    if('materials' in data[i]) {
			    	var subscriber = parseInt(data[i]["subscriber"]);
			    	var trainer = parseInt(data[i]["trainer"]);
			    	var materials = parseInt(data[i]["materials"]);

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
		/*if(subscriberChartData.length != 0) initCategoryPlot('categoriesSubscriberChart', subscriberChartData, "Teilnehmer"); 
		if(trainerChartData.length != 0) initCategoryPlot('categoriesTrainerChart', trainerChartData, "Dozenten"); 
		if(materialsChartData.length != 0) initCategoryPlot('categoriesMaterialsChart', materialsChartData, "Materialien"); */

		/*$("#categoryStatisticsSelectItem0 select:nth-child(" + level + ")").on('change', function(){
			console.log($("#categoryStatisticsSelectItem0 select:nth-child(n+" + level + ")"));
			$("#categoryStatisticsSelectItem0 select:nth-child(n+" + (level+1) + ")").remove(); 
			var selected = $(this).find("option:selected").val();
		   	console.log("selected", selected, 'subcategory' in data[selected]); 
		   	if('subcategory' in data[selected]) {
		   		data = data[selected]["subcategory"];
		   		++level; 
				addCategorySelectItem(data, level);
		   	}
		});*/
	},

	addPlotValue = function(chartData, name, value) {
		var chartDataOne = [];
		if (!isNaN(value) && value != 0) {
			chartDataOne[1] = name; 
			chartDataOne[0] = value; 
			chartData.push(chartDataOne); 
		}
		return chartData; 
	},
	
	dynamicSort = function(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }
	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}, 

	addCategoryStatisticsSelectItem = function() {
		makeCategoryStatisticsSelectItem({
			id: "categoryStatisticsSelectItem" + categoryStatisticsSelectItemCount
		});

		$("#categoryStatisticsSelectItem" + categoryStatisticsSelectItemCount).on('change', "select", function(){
			console.log($(this), $(this).index());
			level = $(this).index()+1;
			$("#categoryStatisticsSelectItem0 select:nth-child(n+" + (level+1 ) + ")").remove(); 
		   	++level;
		   	addCategorySelectItem(level);
		});

		categoryStatisticsSelectItemCount++;
	}; 

	that.addTagCloud = addTagCloud; 
	that.showInactiveCoursesAndUsers = showInactiveCoursesAndUsers;
	that.showInactiveCourses = showInactiveCourses; 
	that.init = init; 
	return that; 
})();