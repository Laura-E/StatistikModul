StatisticsModule.MainController = (function() {
	var that = {},
	statisticsView = null; 
	categoryStatisticsView = null;

	init = function() {
		mainModel = StatisticsModule.MainModel; 
		mainModel.init(); 

		statisticsView = StatisticsModule.StatisticsView.init(); 
		categoryStatisticsView = StatisticsModule.CategoryStatisticsView.init(); 

		$(mainModel).on('initTimePeriod', onInitTimePeriod); 
		$(mainModel).on('drawChart', onDrawChart); 
		$(mainModel).on('addTagCloud', onAddTagCloud); 
		$(mainModel).on('changeCountValues', onChangeCountValues); 
		$(mainModel).on('showInactiveCoursesAndUsers', onShowInactiveCoursesAndUsers); 
		$(mainModel).on('showInactiveCourses', onShowInactiveCourses);
		$(statisticsView).on('timeperiodValuesChanged', onTimeperiodValuesChanged); 
		$(categoryStatisticsView).on('getInactiveCoursesAndUsers', onGetInactiveCoursesAndUsers); 
	}, 

	onGetInactiveCoursesAndUsers = function(event, kind, count, dateType) {
		mainModel.getInactiveCoursesAndUsers(kind, count, dateType); 
	};

	onShowInactiveCourses = function(event, object) {
		categoryStatisticsView.showInactiveCourses(object); 
	}, 

	onShowInactiveCoursesAndUsers = function(event, object) {
		categoryStatisticsView.showInactiveCoursesAndUsers(object); 
	}, 

	onInitTimePeriod = function(event, object) {
		statisticsView.initTimePeriod(object); 
	}, 

	onChangeCountValues = function(event, object) {
		statisticsView.changeCountValues(object); 
	}, 

	onTimeperiodValuesChanged = function(event, start, end) {
		mainModel.getCounts(start, end); 
	}, 

	onAddTagCloud = function(event, object) {
		categoryStatisticsView.addTagCloud(object); 
	}, 

	onDrawChart = function(event, object, option) {
		statisticsView.drawChart(object, option); 
	}; 

	that.init = init; 
	return that; 
})();