StatisticsModule.InactiveCoursesTableItem = function() {
	var that = {}, 
	id = null, 
	courseId = null, 
	name = null, 
	lastActivity = null

	init = function(options) {
		id = options.id; 
		courseId = options.courseId;
		name = options.name;
		lastActivity = options.lastActivity;

		template = $('#inactiveCoursesTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			courseId: courseId, 
			name: name, 
			lastActivity: lastActivity
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};