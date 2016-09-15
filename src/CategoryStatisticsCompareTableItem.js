StatisticsModule.CategoryStatisticsCompareTableItem = function() {
	var that = {}, 
	id = null,  
	title = null, 
	trainerCount = null, 
	subscriberCount = null, 
	materialsCount = null, 

	init = function(options) {
		id = options.id; 
		title = options.title;
		trainerCount = options.trainerCount;
		subscriberCount = options.subscriberCount;
		materialsCount = options.materialsCount;

		template = $('#categoryStatisticsCompareTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			title: title, 
			trainerCount: trainerCount, 
			subscriberCount: subscriberCount, 
			materialsCount: materialsCount
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};