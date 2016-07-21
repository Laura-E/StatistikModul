StatisticsModule.MainController = (function() {
	var that = {},
	statisticsView = null; 

	init = function() {
		mainModel = StatisticsModule.MainModel; 
		mainModel.init(); 

		statisticsView = StatisticsModule.StatisticsView.init(); 

		$(mainModel).on('drawChart', onDrawChart); 
		$(mainModel).on('addTagCloud', onAddTagCloud); 
	}, 

	onAddTagCloud = function(event, object) {
		console.log(object); 
		statisticsView.addTagCloud(object); 
	}, 

	onDrawChart = function(event, object, option) {
		console.log(option); 
		statisticsView.drawChart(object, option); 
	}; 

	that.init = init; 
	return that; 
})();