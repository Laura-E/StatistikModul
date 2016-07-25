StatisticsModule.CategoryStatisticsTableItem = function() {
	var that = {}, 
	id = null, 
	category = null, 
	courseCount = null, 
	materialsCount = null, 
	subscriberCount = null, 
	trainerCount = null, 

	init = function(options) {
		id = options.id; 
		category = options.category;
		courseCount = options.courseCount;
		materialsCount = options.materialsCount;
		subscriberCount = options.subscriberCount;
		trainerCount = options.trainerCount;

		template = $('#categoryStatisticsTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			category: category, 
			courseCount: courseCount, 
			materialsCount: materialsCount, 
			subscriberCount: subscriberCount, 
			trainerCount: trainerCount
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};