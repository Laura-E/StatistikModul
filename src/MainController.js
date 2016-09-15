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
		$(statisticsView).on('timeperiodValuesChanged', onTimeperiodValuesChanged); 
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