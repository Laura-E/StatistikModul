StatisticsModule.StatisticsView = (function() {
	var that = {}, 
	timeperiodSlider, 
	loginStatisticsChart, 
	accessStatisticsChart, 
	enlargementLoginChart, 
	enlargementReadWriteChart,
	accessStatisticsTableItemCount = 0, 
	loginStatisticsTableItemCount = 0, 
	courseStatisticsTableItemCount = 0, 
	categoryStatisticsTableItemCount = 0, 
	
	init = function() {
     	initSlider(); 
     	initDatePicker(); 
		addCourseStatisticsTableItem(23, "234", "54");
		$("#loginStatisticsMoreButton").on('click', onLoginStatisticsMoreButtonClick); 
		$("#accessStatisticsMoreButton").on('click', onAccessStatisticsMoreButtonClick); 
		$("#courseStatisticsMoreButton").on('click', onCourseStatisticsMoreButtonClick); 
		$("#categoryStatisticsMoreButton").on('click', onCategoryStatisticsMoreButtonClick); 
		$("#lineChartButton").on('click', onLineChartButtonClick); 
		$("#barChartButton").on('click', onBarChartButtonClick); 
		return that; 
	}, 

	onLineChartButtonClick = function(event) {
		setChartType(enlargementReadWriteChart, "line");
	}, 

	onBarChartButtonClick = function(event) {
		setChartType(enlargementReadWriteChart, "column");
	},

	onEnlargementButtonClick = function(event) {
		$("#chartEnlargementModal").modal('show');
		var option = event.data.option;
		initChart(event.data.chartObject, option); 
		if (option == "loginEnlargement") {
			changeZoomDates(enlargementLoginChart); 
		} else if (option == "readWriteEnlargement") {
			changeZoomDates(enlargementReadWriteChart);
		}
	}, 

	onCategoryStatisticsMoreButtonClick = function(event) {
		$("#categoryStatisticsModal").modal('show');
	}, 

	onCategoryStatisticsModalShow = function(event) {
		drawPieChart(event.data.words);
	}, 

	onCourseStatisticsMoreButtonClick = function(event) {
		$("#courseStatisticsModal").modal('show');
	}, 

	onAccessStatisticsMoreButtonClick = function(event) {
		$("#accessStatisticsModal").modal('show');
	}, 

	onLoginStatisticsMoreButtonClick = function(event) {
		$("#loginStatisticsModal").modal('show'); 
	}, 

	addTagCloud = function(object) {
		var words = [];
		for (var key in object) {
			var faculty = object[key];
			var text = faculty["name"];
			var weight = faculty["courses"];
			var color = faculty["color"];
			var materials = faculty["materials"];
			var subscriber = faculty["subscriber"];
			var trainer = faculty["trainer"];
			var word = {};
			word['text'] = text;
			word['weight'] = weight;
			word['color'] = color;
			word['materials'] = materials;
			word['subscriber'] = subscriber;
			word['trainer'] = trainer;
			words.push(word); 
		}
		$("#categoryStatsTab").on("click", {"words": words}, onCategoryStatsTabClick);
		//initCloud(words); 
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
		    for (var i in data) {
		        $("#" + data[i]["attr"]["id"]).css("color", data[i]["color"]);
		    }
		}, 100);
		$("#categoryStatisticsModal").on('shown.bs.modal', {'words': words}, onCategoryStatisticsModalShow); 
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

	initDatePicker = function() {
		$('.date-picker').datepicker( {
			showOn: "button",
      		buttonImage: "res/images/calendar.png",
      		buttonImageOnly: true,
	        changeMonth: true,
	        changeYear: true,
	        minDate: new Date('2008/01'),
        	maxDate: new Date('2016/08'),
	        showButtonPanel: true,
	        monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
	        //dateFormat: 'MM yy',
	        onClose: function(dateText, inst) { 
	            $(this).datepicker('setDate', new Date(inst.selectedYear + "/" + (inst.selectedMonth+1)));
	            var oldValue = $(this).data('oldValue') || "";
        		if (dateText !== oldValue) {
            		$(this).data('oldValue',dateText);
					changeZoomDates(loginStatisticsChart);
					changeZoomDates(accessStatisticsChart); 
					var startDate = $("#startDate").datepicker('getDate');
		    		var endDate = $("#endDate").datepicker('getDate');
					timeperiodSlider.dateRangeSlider("values", startDate, endDate);
        		}
	        }
    	});
    	$("#startDate").datepicker("setDate", new Date('2008/01'));
    	$("#startDate").datepicker("refresh");
    	$("#endDate").datepicker("setDate", new Date('2016/08'));
    	$("#endDate").datepicker("refresh");
	}, 

	initSlider = function() {
		timeperiodSlider = $("#slider-range");
		timeperiodSlider.dateRangeSlider({
			bounds: {
		      min: new Date(2008, 0, 1),
		      max: new Date(2016, 7, 1)  
		    },
		    defaultValues:{
			    min: new Date(2008, 0, 1),
		      	max: new Date(2016, 7, 1)  
  			},
		    step:{
			    months: 1
			}, 
			arrows:false, 
			valueLabels: "change", 
			formatter:function(val){
		        var month = val.getMonth() + 1,
		        year = val.getFullYear();
		        return month + "/" + year;
		    }
		});
		timeperiodSlider.bind("valuesChanged", function(e, data){
			var start = data.values.min;
			var end = data.values.max;
			var startMonth = start.getMonth() + 1; 
			var startYear = start.getFullYear(); 
			var endMonth = end.getMonth() + 1;
			var endYear = end.getFullYear(); 

			$("#startDate").datepicker("setDate", new Date(startYear + "/" + startMonth));
    		$("#startDate").datepicker("refresh");
    		$("#endDate").datepicker("setDate", new Date(endYear + "/" + endMonth));
    		$("#endDate").datepicker("refresh");
    		changeZoomDates(loginStatisticsChart);
			changeZoomDates(accessStatisticsChart); 
		});
	}, 

	makeLoginStatisticsTableItem = function(options) {
		var item = StatisticsModule.LoginStatisticsTableItem().init({
			id: options.id,
			date: options.date,
			logins: options.logins,
			singleLogins: options.singleLogins,
			allLogins: options.allLogins
		}); 
		var $el = item.render(); 
		$("#loginStatisticsTableItemContainer").append($el); 
	}, 

	addLoginStatisticsTableItem = function(id, date, logins, singleLogins, allLogins) {
		makeLoginStatisticsTableItem({
			id: "loginStatisticsTableItem" + loginStatisticsTableItemCount,  
			date: date,
			logins: logins,
			singleLogins: singleLogins,
			allLogins: allLogins
		});
	}, 

	makeCourseStatisticsTableItem = function(options) {
		var item = StatisticsModule.CourseStatisticsTableItem().init({
			id: options.id,
			date: options.date,
			courseCount: options.courseCount,
			activities: options.activities
		}); 
		var $el = item.render(); 
		$("#courseStatisticsTableItemContainer").append($el); 
	}, 

	addCourseStatisticsTableItem = function(date, courseCount, activities) {
		makeCourseStatisticsTableItem({
			id: "courseStatisticsTableItem" + courseStatisticsTableItemCount, 
			date: date,
			courseCount: courseCount,
			activities: activities
		});
	},

	makeAccessStatisticsTableItem = function(options) {
		var item = StatisticsModule.AccessStatisticsTableItem().init({
			id: options.id,
			date: options.date,
			loginLecturers: options.loginLecturers,
			loginOthers: options.loginOthers,
			contributionLecturers: options.contributionLecturers,
			contributionOthers: options.contributionOthers
		}); 
		var $el = item.render(); 
		$("#accessStatisticsTableItemContainer").append($el); 
	}, 

	addAccessStatisticsTableItem = function(date, loginLecturers, loginOthers, contributionLecturers, contributionOthers) {
		makeAccessStatisticsTableItem({
			id: "accessStatisticsTableItem" + accessStatisticsTableItemCount, 
			date: date,
			loginLecturers: loginLecturers,
			loginOthers: loginOthers,
			contributionLecturers: contributionLecturers, 
			contributionOthers: contributionOthers
		});
		accessStatisticsTableItemCount++;
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
	},

	initChart = function(object, option) {
		var chartContainer;
		if (option == "login") {
			chartContainer = "loginStatisticsChart";
		} if (option == "readWrite") {
			chartContainer = "accessStatisticsChart";
		} if (option == "loginEnlargement" || option == "readWriteEnlargement") {
			chartContainer = "enlargementChart";
		} 
		var chartData = generateChartData(object, option);
		var chart = AmCharts.makeChart(chartContainer, {
		    "type": "serial",
		    "theme": "light",
		    "marginRight": 80,
		    "autoMarginOffset": 20,
		    "marginTop": 7,
		    "dataProvider": chartData,
		    "valueAxes": [{
		        "axisAlpha": 0.2,
		        "dashLength": 1,
		        "position": "left"
		    }],
		    "mouseWheelZoomEnabled": true,
		    "graphs": [{
		        "id": "g1",
		        "balloonText": "[[value]]",
		        "bullet": "round",
		        "bulletBorderAlpha": 1,
		        "bulletColor": "#FFFFFF",
		        "lineColor": "teal", 
		        "hideBulletsCount": 50,
		        "title": "red line",
		        "valueField": "visits",
		        "useLineColorForBulletBorder": true,
		        "balloon":{
		            "drop":true
		        }
		    }],
		    "chartScrollbar": {
		        "autoGridCount": true,
		        "graph": "g1",
		        "scrollbarHeight": 40
		    },
		    "chartCursor": {
		       //"limitToGraph":"g1"
		    },
		    "categoryField": "date",
		    "categoryAxis": {
		        "parseDates": true,
		        "axisColor": "#DADADA",
		        "dashLength": 1,
		        "minorGridEnabled": true
		    },
		    "export": {
		        "enabled": true
		    }
		});
		chart.chartCursor.addListener("zoomed", function (event) {
		        console.log("zoom");
		});


		if (option == "login") {
			loginStatisticsChart = chart;
		} if (option == "readWrite") {
			accessStatisticsChart = chart; 
		} if (option == "loginEnlargement") {
			enlargementLoginChart = chart;
		} if (option == "readWriteEnlargement") {
			enlargementReadWriteChart = chart;
		}
	},

	setChartType = function(chart, type) {
	    switch(type) {
	        case 'line':
	            chart.graphs[0].type = 'line';
	            chart.graphs[0].lineAlpha = 1;
	            chart.graphs[0].fillAlphas = 0;
	            chart.validateNow();
	            break;
	        /*case 'area':
	            chart.graphs[0].type = 'line';
	            chart.graphs[0].lineAlpha = 1;
	            chart.graphs[0].fillAlphas = 0.3;
	            chart.validateNow();
	            break;*/
	        case 'column':
	            chart.graphs[0].type = 'column';
	            chart.graphs[0].lineAlpha = 0;
	            chart.graphs[0].fillAlphas = 0.5;
	            chart.validateNow();
	            break;
	    }
	},

	drawChart = function(object, option) {
		initChart(object, option); 
		$("#" + option + "ChartEnlargementButton").on('click', {'chartObject': object, 'option': option + "Enlargement"}, onEnlargementButtonClick); 
	}, 

	generateChartData = function(object, option) {
		    var chartData = [];
		    var count;
		    if (option == "login" || option == "loginEnlargement") {
		    	count = 0; 
		    	for (key in object) {
			    	var visits = object[key]["gesamt"];
			    	addLoginStatisticsTableItem("loginStatisticsTableItem" + count, object[key]["date_formatted"], object[key]["logins"], object[key]["singlelogins"], visits);
			    	//var newDate = Date.parse(object[key]["date_formatted"].replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
			    	var newDate = new Date(parseInt(object[key]["timeend"])*1000);
			    	chartData.push({
				        date: newDate,
				        visits: visits
				    });
			    }
		    } else if (option == "readWrite" || option == "readWriteEnlargement") {
		    	count = 0; 
		    	var dozent = object["dozent"]; 
		    	var student = object["student"];
		    	for (key in dozent) {
			    	var visitsDozent = dozent[key]["zugriff"];
			    	var visitsStudent = student[key]["zugriff"];
			    	addAccessStatisticsTableItem(dozent[key]["date_formatted"], dozent[key]["zugriff"], student[key]["zugriff"], dozent[key]["beitrag"], student[key]["beitrag"]);
			    	//var newDate = Date.parse(object[key]["date_formatted"].replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
			    	var newDate = new Date(parseInt(dozent[key]["timeend"])*1000);
			    	chartData.push({
				        date: newDate,
				        visits: (parseInt(visitsDozent) + parseInt(visitsStudent))
				    });
			    }
		    }
			return chartData;
		}, 

		changeZoomDates = function(chart) {
		    var startDate = $("#startDate").datepicker('getDate');
		    var endDate = $("#endDate").datepicker('getDate');
		    console.log(startDate, endDate); 
		    chart.zoomToDates(startDate, endDate);
		}, 

		stringToDate = function(str) {
		    var dArr = str.split("/");
		    var date = new Date(Number(dArr[2]), Number(dArr[1]) - 1, dArr[0]);
		    return date;
		}; 

	that.drawChart = drawChart; 
	that.addTagCloud = addTagCloud; 
	that.init = init; 
	return that; 
})();