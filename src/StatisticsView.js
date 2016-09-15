StatisticsModule.StatisticsView = (function() {
	var that = {}, 
	timeperiodSlider, 
	loginStatisticsChart, 
	accessStatisticsChart, 
	courseStatisticsChart, 
	enlargementLoginChart, 
	enlargementReadWriteChart,
	enlargementCourseChart, 
	accessStatisticsTableItemCount = 0, 
	loginStatisticsTableItemCount = 0, 
	courseStatisticsTableItemCount = 0, 
	/*categoryStatisticsTableItemCount = 0, 
	categoryStatisticsCompareTableItemCount = 0, 
	categoryStatisticsSelectItemCount = 0, */

	started = 0, 

	init = function() {
		/*$("#facultySelect").selectpicker();
		$("#instituteSelect").selectpicker(); 
		$("#courseOfStudiesSelect").selectpicker(); */

		$("#loginStatisticsMoreButton").on('click', onLoginStatisticsMoreButtonClick); 
		$("#accessStatisticsMoreButton").on('click', onAccessStatisticsMoreButtonClick); 
		$("#courseStatisticsMoreButton").on('click', onCourseStatisticsMoreButtonClick); 
		$("#categoryStatisticsMoreButton").on('click', onCategoryStatisticsMoreButtonClick); 

		$("#courseStatisticsModalPrint").on('click', onCourseStatisticsModalPrintClick);
		$("#categoryStatisticsModalPrint").on('click', onCategoryStatisticsModalPrintClick);
		$("#accessStatisticsModalPrint").on('click', onAccessStatisticsModalPrintClick);
		$("#loginStatisticsModalPrint").on('click', onLoginStatisticsModalPrintClick);
		$("#chartEnlargementModalPrint").on('click', onChartEnlargementModalPrintClick);

		$("#lineChartButton").on('click', onLineChartButtonClick); 
		$("#barChartButton").on('click', onBarChartButtonClick); 
		
		//initCategoryStatisticsChart(); 
		return that; 
	}, 

	initTimePeriod = function(object) {
		var min = parseInt(object["min"]);
		var max = parseInt(object["max"]);
		initSlider(min, max); 
     	initDatePicker(min, max); 
	}, 

	onLineChartButtonClick = function(event) {
		var option = $("#enlargementChart").attr("data-id");
		var chart = getChartByString(option);
		setChartType(chart, "line");
	}, 

	onBarChartButtonClick = function(event) {
		var option = $("#enlargementChart").attr("data-id");
		var chart = getChartByString(option);
		setChartType(chart, "column");
	},

	getChartByString = function(option) {
		var chart; 
		if (option == "loginEnlargement") {
			chart = enlargementLoginChart; 
		} else if (option == "readWriteEnlargement") {
			chart = enlargementReadWriteChart;
		} else if (option == "courseEnlargement") {
			chart = enlargementCourseChart;
		}
		return chart; 
	}, 

	onEnlargementButtonClick = function(event) {
		$("#chartEnlargementModal").modal('show');
		var option = event.data.option;
		initChart(event.data.chartObject, option); 
		var chart = getChartByString(option); 
		changeZoomDates(chart);
		$("#enlargementChart").attr("data-id", option); 
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

	onCourseStatisticsModalPrintClick = function(event){
		
		printElement("courseStatisticsModal");		

	},

	onCategoryStatisticsModalPrintClick = function(event){
		
		printElement("categoryStatisticsModal");
			
	},

	onAccessStatisticsModalPrintClick = function(event){
		
		printElement("accessStatisticsModal");		

	},

	onLoginStatisticsModalPrintClick = function(event){
		
		printElement("loginStatisticsModal");		

	},

	onChartEnlargementModalPrintClick = function(event){		
		
		printElement("chartEnlargementModal");	

	}, 

	printElement = function(el){

		var content = document.getElementById(el);
		var pri = document.getElementById("ifmcontentstoprint").contentWindow;
		pri.document.open();
		pri.document.write('<html><head>');
        pri.document.write('<link rel="stylesheet" href="res/css/print.css" type="text/css" />');
        pri.document.write('</head><body>');
		pri.document.write(content.innerHTML);
		pri.document.write('</body></html>');
		

		var piechart = pri.document.getElementById("coursePie");
		if(piechart != null){
			piechart.parentNode.removeChild(piechart);
		}
		
		pri.document.close(); // necessary for IE >= 10
        pri.focus(); 
		pri.print();
		pri.close();
		window.focus();
	},

	printElement = function(el){

		var content = document.getElementById(el);
		var pri = document.getElementById("ifmcontentstoprint").contentWindow;
		pri.document.open();
		pri.document.write('<html><head>');
        pri.document.write('<link rel="stylesheet" href="res/css/print.css" type="text/css" />');
        pri.document.write('</head><body>');
		pri.document.write(content.innerHTML);
		pri.document.write('</body></html>');
		

		var piechart = pri.document.getElementById("coursePie");
		if(piechart != null){
			piechart.parentNode.removeChild(piechart);
		}
		
		pri.document.close(); // necessary for IE >= 10
        pri.focus(); 
		pri.print();
		pri.close();
		window.focus();
	},

	/*addTagCloud = function(object) {
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
		    	var text = data[i]["text"];
		    	var color = data[i]["color"];
		        $("#" + data[i]["attr"]["id"]).css("color", color);
		        $("#facultySelect").append("<option>" + text + "</option>");
		        $("#facultySelect").val("-").selectpicker('refresh');
		        //addCategoryListItem(color, text);
		        //addCourseOfStudiesListItem("test", text);
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
	}, */

	initDatePicker = function(min, max) {
		$('.date-picker').datepicker( {
			showOn: "button",
      		buttonImage: "res/images/calendar.png",
      		buttonImageOnly: true,
	        changeMonth: true,
	        changeYear: true,
	        minDate: new Date(min*1000),
        	maxDate: new Date(max*1000),
	        /*minDate: new Date('2008/01'),
        	maxDate: new Date('2016/08'),*/
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
					changeZoomDates(courseStatisticsChart); 
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

	initSlider = function(min, max) {
		timeperiodSlider = $("#slider-range");
		timeperiodSlider.dateRangeSlider({
			bounds: {
		      /*min: new Date(2008, 0, 1),
		      max: new Date(2016, 7, 1)  */
		      min: new Date(min*1000),
		      max: new Date(max*1000) 
		    },
		    defaultValues:{
		    	min: new Date(min*1000),
		      	max: new Date(max*1000) 
			    /*min: new Date(2008, 0, 1),
		      	max: new Date(2016, 7, 1)*/  
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
			var unixStart = start.getTime()/1000; 
			var unixEnd = end.getTime()/1000; 
			var startMonth = start.getMonth() + 1; 
			var startYear = start.getFullYear(); 
			var endMonth = end.getMonth() + 1;
			var endYear = end.getFullYear(); 

			$("#startDate").datepicker("setDate", new Date(startYear + "/" + startMonth));
    		$("#startDate").datepicker("refresh");
    		$("#endDate").datepicker("setDate", new Date(endYear + "/" + endMonth));
    		$("#endDate").datepicker("refresh");
    		console.log(started); 
    		if(started != 0) {
    			changeZoomDates(loginStatisticsChart);
				changeZoomDates(accessStatisticsChart); 
				changeZoomDates(courseStatisticsChart); 
    		}
    		$(that).trigger("timeperiodValuesChanged", [unixStart, unixEnd]);
    		started = 1;
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


	/*makeCategoryStatisticsTableItem = function(options) {
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
			subscriberCount: options.subscriberCount
		}); 
		var $el = item.render(); 
		$("#categoryStatisticsSelectCompareTableItemContainer").append($el); 
	}, 

	addCategoryStatisticsCompareTableItem = function(title, trainerCount, subscriberCount) {
		makeCategoryStatisticsCompareTableItem({
			id: "categoryStatisticsCompareTableItem" + categoryStatisticsCompareTableItemCount, 
			title: title, 
			trainerCount: trainerCount, 
			subscriberCount: subscriberCount
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
	},*/

	

	initCategoryStatisticsChart = function() {
			var chartData = generateChartData();

var chart = AmCharts.makeChart("categoryStatisticsChart", {
    "type": "serial",
    "theme": "light",    "legend": {
        "useGraphSettings": true
    },
    "dataProvider": chartData,
    "synchronizeGrid":true,
    "graphs": [{
        "valueAxis": "v1",
        "lineColor": "#FF6600",
        "bullet": "round",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Kurse",
        "valueField": "visits",
		"fillAlphas": 0
    }, {
        "valueAxis": "v2",
        "lineColor": "#FCD202",
        "bullet": "square",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Materialien",
        "valueField": "hits",
		"fillAlphas": 0
    }, {
        "valueAxis": "v3",
        "lineColor": "#B0DE09",
        "bullet": "triangleUp",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Teilnehmer",
        "valueField": "views",
		"fillAlphas": 0
    }],
    "chartScrollbar": {},
    "chartCursor": {
        "cursorPosition": "mouse"
    },
    "categoryField": "date",
    "categoryAxis": {
        "parseDates": true,
        "axisColor": "#DADADA",
        "minorGridEnabled": true
    },
    "export": {
    	"enabled": true,
        "position": "bottom-right"
     }
});

chart.addListener("dataUpdated", zoomChart);
zoomChart();


// generate some random data, quite different range
function generateChartData() {
    var chartData = [];
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 100);

    for (var i = 0; i < 100; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        var visits = Math.round(Math.sin(i * 5) * i);
        var hits = Math.round(Math.random() * 80) + 500 + i * 3;
        var views = Math.round(Math.random() * 6000) + i * 4;

        chartData.push({
            date: newDate,
            visits: visits,
            hits: hits,
            views: views
        });
    }
    console.log(chartData); 
    return chartData;
}

function zoomChart(){
    chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
}
	}, 

	initChart = function(object, option) {
		var chartContainer;
		if (option == "login") {
			chartContainer = "loginStatisticsChart";
		} if (option == "readWrite") {
			chartContainer = "accessStatisticsChart";
		} if (option == "course") {
			chartContainer = "courseStatisticsChart";
		} if (option == "loginEnlargement" || option == "readWriteEnlargement" || option == "courseEnlargement") {
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
		} if (option == "course") {
			courseStatisticsChart = chart;
		} if (option == "loginEnlargement") {
			enlargementLoginChart = chart;
		} if (option == "readWriteEnlargement") {
			enlargementReadWriteChart = chart;
		} if (option == "courseEnlargement") {
			enlargementCourseChart = chart;
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
		    } else if (option == "course" || option == "courseEnlargement") {
		    	count = 0; 
		    	for (key in object) {
		    		var visits = object[key]["anzahl"];
		    		var activities = object[key]["aktivitaeten"]; 
		    		addCourseStatisticsTableItem(object[key]["date_formatted"], visits, activities);
		    		var newDate = new Date(parseInt(object[key]["timeend"])*1000);
			    	chartData.push({
				        date: newDate,
				        visits: visits
				    });
			    }
		    }
			return chartData;
		}, 

		changeZoomDates = function(chart) {
		    var startDate = $("#startDate").datepicker('getDate');
		    var endDate = $("#endDate").datepicker('getDate');
		    chart.zoomToDates(startDate, endDate);
		}, 

		stringToDate = function(str) {
		    var dArr = str.split("/");
		    var date = new Date(Number(dArr[2]), Number(dArr[1]) - 1, dArr[0]);
		    return date;
		}, 

		changeCountValues = function(object) {
			var loginCount = object["loginCount"]; 
			var readWriteCount = object["readWriteCount"];
			var courseCount = object["courseCount"];
			$("#loginCount").text(loginCount); 
			$("#readWriteCount").text(readWriteCount);
			$("#courseCount").text(courseCount); 
		}; 

	that.drawChart = drawChart; 
	that.changeCountValues = changeCountValues; 
	that.initTimePeriod = initTimePeriod; 
	that.init = init; 
	return that; 
})();