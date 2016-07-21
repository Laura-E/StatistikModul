StatisticsModule.LoginStatisticsTableItem = function() {
	var that = {}, 
	id = null, 
	date = null, 
	logins = null, 
	singleLogins = null, 
	allLogins = null, 

	init = function(options) {
		id = options.id; 
		date = options.date;
		logins = options.logins;
		singleLogins = options.singleLogins;
		allLogins = options.allLogins;

		template = $('#loginStatisticsTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			date: date,
			logins: logins,
			singleLogins: singleLogins, 
			allLogins: allLogins
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};