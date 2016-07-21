StatisticsModule.CategoryStatisticsTableItem = function() {
	var that = {}, 
	id = null, 
	category = null, 
	courseCount = null, 

	init = function(options) {
		id = options.id; 
		category = options.category;
		courseCount = options.courseCount;

		template = $('#categoryStatisticsTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			category: category, 
			courseCount: courseCount
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};