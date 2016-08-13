StatisticsModule.CategoryListItem = function() {
	var that = {}, 
	id = null, 
	backgroundColor = null, 
	title = null, 
	collapseId = null, 

	init = function(options) {
		id = options.id; 
		backgroundColor = options.backgroundColor;
		title = options.title;
		collapseId = options.collapseId;

		template = $('#categoryListItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			backgroundColor: backgroundColor, 
			title: title, 
			collapseId: collapseId
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};