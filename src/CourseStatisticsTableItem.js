StatisticsModule.CourseStatisticsTableItem = function() {
	var that = {}, 
	id = null, 
	date = null, 
	courseCount = null, 
	activities = null,

	init = function(options) {
		id = options.id; 
		date = options.date;
		courseCount = options.courseCount;
		activities = options.activities;

		template = $('#courseStatisticsTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			date: date, 
			courseCount: courseCount,
			activities: activities
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};