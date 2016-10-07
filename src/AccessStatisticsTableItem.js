StatisticsModule.AccessStatisticsTableItem = function() {
	var that = {}, 
	id = null, 
	date = null, 
	loginLecturers = null, 
	loginOthers = null, 
	contributionLecturers = null, 
	contributionOthers = null, 

	init = function(options) {
		id = options.id; 
		date = options.date;
		loginLecturers = options.loginLecturers;
		loginOthers = options.loginOthers;
		contributionLecturers = options.contributionLecturers;
		contributionOthers = options.contributionOthers;

		template = $('#accessStatisticsTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			date: date,
			loginLecturers: loginLecturers,
			loginOthers: loginOthers, 
			contributionLecturers: contributionLecturers, 
			contributionOthers: contributionOthers
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};