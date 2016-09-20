StatisticsModule.InactiveUsersTableItem = function() {
	var that = {}, 
	id = null, 
	userId = null, 
	firstname = null, 
	lastname = null, 
	email = null, 
	lastlogin = null

	init = function(options) {
		id = options.id; 
		userId = options.userId;
		firstname = options.firstname;
		lastname = options.lastname;
		email = options.email;
		lastlogin = options.lastlogin;

		template = $('#inactiveUsersTableItem-tpl').html();

		return that; 
	}, 

	render = function() {
		var tpl = _.template(template, {
			id: id, 
			userId: userId, 
			firstname: firstname, 
			lastname: lastname, 
			email: email, 
			lastlogin: lastlogin
		});
		return $(tpl); 
	};

	that.init = init; 
	that.render = render; 

	return that; 
};