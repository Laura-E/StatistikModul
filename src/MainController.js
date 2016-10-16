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
		$(mainModel).on('showCategoriesForParent', onShowCategoriesForParent); 
		$(statisticsView).on('timeperiodValuesChanged', onTimeperiodValuesChanged); 
		$(categoryStatisticsView).on('getInactiveCoursesAndUsers', onGetInactiveCoursesAndUsers); 
		$(categoryStatisticsView).on('getCategoriesForParent', onGetCategoriesForParent); 
	}, 

	onShowCategoriesForParent = function(event, top, children, level) {
		if(top.length != 0 && children.length != 0) {
			categoryStatisticsView.addCategorySelectItem(top, children, level); 
		}
	}, 

	onGetCategoriesForParent = function(event, value, level) {
		console.log(value, level);
		mainModel.getCategoriesForParent(value, level); 
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