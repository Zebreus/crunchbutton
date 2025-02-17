var App = {
	currentPage: null,
	slogans: ['order food in 5 seconds'],
	service: '/api/',
	cached: {},
	cart: {},
	community: null,
	page: {},
	config: null,
	order: {
		cardChanged: false,
		pay_type: 'card',
		delivery_type: 'delivery',
		tip: '10'
	},
	_init: false,
	_pageInit: false,
	deletedDishes : [],
	selectedCategory : false
};

function _deleteCategoryDialog(){
	$('body').on('click', '.jqui-button.button-delete', function(){
		var category_id = $(this).parent('.ui-accordion-content').prev('h3').data().id_category;
		var categories  = App.restaurantObject.categories();
		var catOptions  = '';
		for(var i = 0; i < categories.length; i++) {
			var disabled = false
			if (categories[i].id_category == category_id) {
				disabled = ' disabled="disabled" ';
			}
			catOptions += '<option value="' + categories[i].id_category + '" ' + disabled + '>' + categories[i].name + '</option>';
		}

		var html = '<div id="dialog-delete-category" title="Delete category" class="labeled-fields"> ' +
			'<p>You are about to delete this category. Existing dishes in the category will be moved to another category.<p>' +
			'<br />' +
			'<label><span class="label">Move dishes to:</span><select>' + catOptions + '</select><label>'
			'<p>Are you sure you want to delete the category?</p>' +
		'</div>';
		$(html).dialog({
			resizable: false,
			height:    200,
			width:     400,
			modal:     true,
			open: function() {
				var $this=$(this);
				$this.keypress(function(e){
					if(e.keyCode==13) {
						$this.parent().find('.ui-dialog-buttonpane button:first').click();
						return false;
					}
				});
			},
			buttons: {
				Delete: function() {
					var to_id = $('select', this).val();
					deleteCategory(category_id, to_id);
					$(this).dialog('close');
					$(this).remove();
				},
				Cancel: function() {
					$(this).dialog('close');
					$(this).remove();
				}
			}
		});
	});
}


/**
 * Populates notifications types with empty fields to be inserted
 *
 * @return void
 */
function _loadEmptyNotifications() {
	var types = ['sms', 'email', 'phone', 'url', 'fax'];
	for(var i in types) {
		var notification = {
				id_notification: '',
				type: types[i],
				value: '',
				active: false,

		}
		_loadNotification(notification);
	}
}

/**
 * Sets the notifications in the restaurant form
 *
 * @param notifications
 */
function _loadNotification(notification) {
		var $wrapper = 'div.check-content.' + notification.type;
			// console.log($wrapper);
			$wrapper = $($wrapper);
		var active   = parseInt(notification.active) ? 'checked="checked"' : '';
		var id       = parseInt(notification.id) ? notification.id : '';

		html = '<div data-id_notification="' + id +'" class="notification-wrap">' +
					'<input type="checkbox" '+ active    +
					' name="notification-active" class="dataset-notification"' +
					' />' +
					'<input value="' + notification.value+ '" '  +
					' name="notification-value" class="dataset-notification notification" ' +
					' />'+
				'</div>';
		$wrapper.append(html);
}


/**
 * Load the restaurant
 *
 * @return void
 */
function _loadRestaurant() {

	var restaurant = this;
	var checkswap = {
		'delivery_fee_check' : 'delivery_fee',
		'delivery_min_check': 'delivery_min',
		'fee_restaurant_check': 'fee_restaurant',
		'fee_customer_check': 'fee_customer',
		'id_community_check': 'id_community'
	};

	$('.admin-restaurant-form input, .admin-restaurant-form select, .admin-restaurant-form textarea').each(function() {
		if ($(this).attr('type') == 'checkbox') {
			if (restaurant[$(this).attr('name')] == 1 && $(this).attr('value') == '1') {
				$(this).click();
			}
			if (restaurant[$(this).attr('name')] == 0 && $(this).attr('value') == '0') {
				$(this).click();
			}

		} else {
			$(this).val(restaurant[$(this).attr('name')]);
		}

		for (var x in checkswap) {
			if ($(this).attr('name') == x) {
				if (restaurant[checkswap[x]] && restaurant[checkswap[x]] != '0') {
					//$('input[name="' + x + '"][value="0"]').prop('checked', false);
					//$('input[name="' + x + '"][value="1"]').prop('checked', true);
					$('input[name="' + x + '"][value="1"]').click();
				} else {
					//$('input[name="' + x + '"][value="0"]').prop('checked', true);
					//$('input[name="' + x + '"][value="1"]').prop('checked', false);
					$('input[name="' + x + '"][value="0"]').click();
				}
			}
		}
	});

	App.restaurant       = restaurant.id_restaurant; // Should be App.id_restaurant IMHO
	App.restaurantObject = restaurant;               // and this one should rellay be App.restaurant

	$('.admin-restaurant-content').html('');

	var notifications = restaurant.notifications();
	for (var i in notifications) {
		_loadNotification(notifications[i]);
	}
	_loadEmptyNotifications();
	_newNotificationFields();

	var categories = restaurant.categories();
	var isDishes = false;

	var $categoriesContainer = $('<div id="categories" class="accordion"></div>');
	$('.admin-restaurant-dishes .admin-restaurant-content').append($categoriesContainer);

	/**
	 * Swip all categories
	 *
	 * @todo Use the App.createCategory
	 * @todo Encapsulate the categories loading in a private _loadCategories() method
	 */
	for (var i in categories) {
		var dishes       = categories[i].dishes();
		var name         = categories[i].name;
		var sort         = (categories[i].sort && (categories[i].sort != 'null')) ? categories[i].sort : 0;
		var $categoryTab = $('<h3 data-id_category="'+ categories[i].id_category +'">'+ name+'</h3>' +
		'<div>' +
			'<div title="delete" class="ui-state-default ui-corner-all jqui-button button-delete"><span class="ui-icon ui-icon-trash"></span></div>'+
			'<div class="labeled-fields category">' +
				'<label><span class="label">Name</span>       <input name="name" value="' + name + '" /></label>' +
				'<label><span class="label">Sort Order</span> <input name="sort" value="' + sort + '" /></label>' +
			'</div>' +
		'</div>');
		$categoriesContainer.append($categoryTab);

		for (var x in dishes) {
			App.showDish(dishes[x]);
			isDishes = true;
		}
	}
	$('.accordion').accordion({
		collapsible: true,
		heightStyle: "content",
		activate:    function( event, ui ){
			var speed = 100;
			var accordionOptions = $('.accordion').accordion('option');
			setTimeout(function() {
				$('.accordion').accordion('destroy');
				$('.accordion').accordion(accordionOptions);
			}, 1.1 * speed);
		}
	});
	_deleteCategoryDialog();
	// end of loadingCategories;

	if (!isDishes) {
		$('input[name="dish_check"][value="0"]').prop('checked', true);
		$('input[name="dish_check"][value="1"]').prop('checked', false);
		$('.admin-restaurant-dishes').hide();

	} else {
		$('input[name="dish_check"][value="0"]').prop('checked', false);
		$('input[name="dish_check"][value="1"]').prop('checked', true);
		$('.admin-restaurant-dishes').show();
	}

	var days = {
		'sun': 'Sunday',
		'mon': 'Monday',
		'tue': 'Tuesday',
		'wed': 'Wednesday',
		'thu': 'Thursday',
		'fri': 'Friday',
		'sat': 'Saturday'
	};

	for (var d in days) {

		var day = $('<div class="hours-date"><span class="hours-date-label">' + days[d] + '</span></div>');
		var dayWrap = $('<div class="hours-date-hours"></div>').appendTo(day);
		dayWrap.after('<div class="divider"></div>');

		if (!restaurant._hours) {
			$('input[name="hours_check"][value="0"]').prop('checked', true);
			$('input[name="hours_check"][value="1"]').prop('checked', false);
			$('.admin-restaurant-hours').hide();

		} else {
			$('input[name="hours_check"][value="0"]').prop('checked', false);
			$('input[name="hours_check"][value="1"]').prop('checked', true);
			$('.admin-restaurant-hours').show();

			var dayitem = restaurant._hours[d];

			for (var x in dayitem) {
				var row = $('<div class="hours-date-hour"></div>');
				row.append('<input type="text" value="' + App.formatTime(dayitem[x][0]) + '" name="' + d + '-open[]">' +
						' TO ' +
						' <input type="text" value="' + App.formatTime(dayitem[x][1]) + '" name="' + d + '-close[]">');
				dayWrap.append(row);
			}
		}

		var row = $('<div class="hours-date-hour"></div>');
		row.append('<input type="text" name="' + d + '-open[]"> TO <input type="text" name="' + d + '-close[]">');
		dayWrap.append(row);

		$('.admin-restaurant-hours').append(day);

	}
}

/**
 * Adds a new hours range if they are all filled up
 *
 * @return void
 */
function _newNotificationFields() {
	var inputSelector = '.notification-wrap input[name="notification-value"]';
	$(document).on('keyup', inputSelector, function() {
		var $container = $(this).closest('.check-content');
		var allfull    = true;
		$container.find(inputSelector).each(function() {
			if ($(this).val() == '') {
				allfull = false;
			}
		});
		if (allfull) {
			var notification = {
				id_notification: '',
				value: '',
				active: false,
			}
			var types = ['sms', 'email', 'phone', 'url', 'fax'];
			for (var i in types) {
				if ($container.hasClass(types[i])) {
					notification.type = types[i];
				}
			}
			_loadNotification(notification);
		}
	});
}

/**
 * Reverts restaurant data
 *
 */
function loadSavedData() {
	/* special logic for the order notification methods cuz they were weird when i found them */
	var types = ['sms', 'email', 'phone', 'url', 'fax'];
	for(var i in types) { $('div.check-content.'+types[i]).html(''); }

	delete App.cached.Restaurant[App.restaurant];
	App.loadRestaurant();
}

/**
 * Method to be called to save the Dish Categories
 *
 * @param function complete What to trigger after the categories are stored
 *
 * @return void
 *
 * @todo returned elements need to be reloaded
 */
function _saveCategories(complete) {
	var selector  = 'input , select, textarea';
	var container = '#categories .labeled-fields.category';
	var elements  = [];
	$(container).each(function(){
		var inputs = $(selector, this);
		var data   = $(this).parent().prev().data();
		data       = getValues(inputs, data);
		elements[elements.length] = data;
	});
	$.post('/api/restaurant/' + App.restaurant + '/categories', {elements: elements}, function(rsp) {
		/* update html */
		for(category_id in rsp._categories) {
			category = rsp._categories[category_id];
			c_name = category.name;
			c_id   = category.id;
			h3 = $('h3[data-id_category=' + c_id + ']');
			if(h3.length > 0)
			{
				// existing category
				$('h3[data-id_category=' + c_id + ']').text(c_name);
				$('select[name=dish-id_category] > option[value=' + c_id + ']').text(c_name);
			}
			else
			{
				// new category
				h3 = $('h3[data-id_category=]').filter(function(){ return $(this).text()==c_name; })
				h3.attr('data-id_category', c_id);
				App.restaurantObject.__categories.push(App.cache('Category', c_id));
			}
		}

		if (complete) {
			complete();
		}
	});
}

/**
 * Method to be called to save all dishes
 *
 * @param function compelte What to trigger after the dishes are stored
 *
 * @return void
 */
function saveDishes (complete) {
	var selector = 'input.dataset-dish, select.dataset-dish, textarea.dataset-dish';
	var dishes = [];

	$('.admin-food-item-wrap').each(function() {
		var id = $(this).attr('data-id_dish');
		var values = getValues($(this).find(selector), {});
		var dish = {
			name:        values['dish-name'],
			description: values['dish-description'],
			price:       values['dish-price'],
			id_category: values['dish-id_category'],
			active:      values['dish-active'],
			sort:        values['dish-sort']
		};

		if (id) {
			dish.id_dish = id;
		}

		dish.optionGroups = [];
		$(this).find('.admin-dish-options .admin-dish-options-wrapper').each(function() {
			var id = $(this).attr('data-parent');
			var name = $(this).find('.admin-dish-options-title').html();
			name = name.substr(0,name.length-1);

			var optionGroup = {
				name: name,
				'default': values['dish-options-default'],
				type: $(this).attr('data-type'),
				price: $(this).attr('data-modifies_price') == 'true' ? true : false,
				options: []
			};
			if (id) {
				optionGroup.id_option = id;
			}

			$(this).find('.dish-options').each(function() {
				var id = $(this).attr('data-id_option');
				var values = getValues($(this).find('input'), {});

				if (values['dish-options-name']) {
					var option = {
						name:      values['dish-options-name'],
						price:     values['dish-options-price'] || 0.00,
						'default': $(this).find('input[type="checkbox"], input[type="radio"]').prop('checked'),
						sort:      values['dish-options-sort']
					};
					if (id) {
						option.id_option = id;
					}
					optionGroup.options[optionGroup.options.length] = option;
				}
			});
			dish.optionGroups[dish.optionGroups.length] = optionGroup;
		});
		// Just to make sure that the name was typed and the user don't clicked at 'Add another dish?' by mistake.
		if( dish.name && dish.name != 'null' && dish.name != '' ){
			$.post('/api/restaurant/' + App.restaurant + '/save-dish', {dish: dish}, function() {});
		}
	});

	if( App.deletedDishes.length > 0 ){
		$.each( App.deletedDishes, function( i, value ) {
			$.post('/api/restaurant/' + App.restaurant + '/delete-dish', {id_dish: value}, function() {
				if (complete && i == App.deletedDishes.length - 1 ) {
					complete();
				}
			});
		});
	} else {
		complete?complete():0;
	}
}

/**
 * Method to be called to save notifications
 *
 * @param function compelte What to trigger after the dishes are stored
 *
 * @return void
 *
 * @todo wasn't able to take the function out becaues of the getValue() method which needs to be refactorized and moved out
 * @todo returned elements need to be reloaded
 */
function _saveNotifications(complete) {
	var selector = 'input.dataset-notification, select.dataset-notification, textarea.dataset-notification';
	var elements = [];

	$('.notification-wrap').each(function() {
		var id      = $(this).attr('data-id_notification');
		var values  = getValues($(this).find(selector), {});
		var element = {
			active: values['notification-active'],
			value:  values['notification-value']
		};

		var types = ['sms', 'email', 'phone', 'url', 'fax'];
		for (var i in types) {
			var $container = $(this).closest('.check-content');
			if ($container.hasClass(types[i])) {
				element.type = types[i];
			}
		}

		if (id) {
			element.id_notification = id;
		}

		elements[elements.length] = element;

	});
	$.post('/api/restaurant/' + App.restaurant + '/notifications', {elements: elements}, function() {
		if (complete) {
			complete();
		}
	});
}

/**
 *
 */
function saveRestaurant () {
	var html = '<div id="dialog-add-dish" title="Please wait while saving..."> ' +
		'<div style="text-align:center; margin-top: 2em;">' +
			'<p>Please wait while saving...</p>' +
			'<img src="/assets/images/admin/ajax-loader-bar.gif" />' +
		'</div>' +
	'</div>';
	$(html).dialog({
		resizable:     false,
		height:        160,
		width:         315,
		modal:         true,
		closeOnEscape: false,
		open:          function(event, ui) { $(".ui-dialog-titlebar-close, .ui-icon-closethick", ui.dialog || ui).hide(); }
	});
	$(".ui-dialog-titlebar-close, .ui-icon-closethick").hide();
	var selector = 'input.dataset-restaurant, select.dataset-restaurant, textarea.dataset-restaurant';
	var id = App.restaurant;

	if (id) {
		App.cache('Restaurant', id, function() {
			var restaurant = getValues(selector, this);
			restaurant.save(function() {
				saveHours(function() {
					_saveCategories(function() {
						saveDishes(function() {
							_saveNotifications(function() {
								$('.ui-dialog-titlebar-close').trigger('click');
							});
						});
					});
				});
			});
		});
	} else {
		var restaurant = getValues(selector, {});
		restaurant = new Restaurant(restaurant);
		restaurant.save(function(r) {

			App.cache('Restaurant', r.id_restaurant, function() {
				App.restaurant = this.id_restaurant;
				saveHours(function() {
					_saveCategories(function(){
						saveDishes(function() {
							_saveNotifications(function() {
								$('.ui-dialog-titlebar-close').trigger('click');
							});
						});
					});
				});
			});
		});
	}

};


function saveHours (complete) {
	var selector = '.hours-date-hour input';
	var id = App.restaurant;

	if (id) {
		App.cache('Restaurant', id, function() {
			var h = getValues(selector, {});

			var hours = {'sun': [],'mon': [],'tue': [],'wed': [],'thu': [],'fri': [],'sat': []};
			var vals = getValues('input.dataset-restaurant', {});

			if (vals.hours_check) {
				for (var d in hours) {
					for (var x in h[d + '-open']) {
						if (!h[d + '-open'][x]) continue;
						hours[d][hours[d].length] = [App.unFormatTime(h[d + '-open'][x]), App.unFormatTime(h[d + '-close'][x])];
					}
				}
			}
			// console.log(hours);
			$.post('/api/restaurant/' + id + '/hours', {hours: hours}, function() {
				if (complete) {
					complete();
				}
			});
		});
	}
};

function deleteCategory(from_id, to_id) {
	var $toDelete = $('h3[data-id_category="'+from_id+'"]');
	var dishes    = $('.admin-food-item-wrap', $toDelete.next());
	// $('select[name="dish-id_category"]').val(to_id);
	$('h3[data-id_category="'+to_id+'"]').next().append(dishes);
	$('select[name="dish-id_category"]').each(function(){
		if( $(this).val() == from_id ){
			$(this).val( to_id );
		}
	});
	$toDelete.next().remove();
	$toDelete.remove();
}


function getValues(selector, restaurant) {
	$(selector).each(function() {
		var name, value, group = false;

		if ($(this).attr('name').match(/^.*\[\]$/)) {
			group = true;
			name = $(this).attr('name').replace(/^(.*)\[\]$/,'$1');
			if (!restaurant[name]) {
				restaurant[name] = [];
			}
		} else {
			name = $(this).attr('name');
		}

		if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
			value = $(this).prop('checked') ? true : false;
		} else {
			value = $(this).val();
		}

		if (group) {
			restaurant[name][restaurant[name].length] = value;
		} else {
			restaurant[name] = value;
		}
	});

	return restaurant;
}

App.loadRestaurant = function(id_restaurant) {
	App.cache('Restaurant', id_restaurant , _loadRestaurant);
};

/**
 * Generates HTML to show dish and it's items
 *
 * @todo Not sure if hide purges HTML or what.
 */
App.showDish = function(dishItem) {
	dishItem = $.extend({
		id_dish:     '',
		// id_category: '',
		name:        '',
		description: '',
		price:       ''
	}, dishItem);

	var dish = $('<div class="admin-food-item-wrap" data-id_dish="' + dishItem.id_dish + '"' + (dishItem.id_dish ? '' : ' style="display: none;"') + '></div>');
	dish.append('<div class="admin-food-item ' + (dishItem.id_dish ? 'admin-food-item-collapsed' : '') + '"> ' +
			'<span class="food-name">' + dishItem.name + '</span>' +
			'<span class="food-price">($<span class="food-price-num">' + dishItem.price + '</span>)</span><div class="food-drop-down"></div></div>')
	var content = $('<div class="admin-food-item-content" ' + (dishItem.id_dish ? 'style="display: none;"' : '') + '></div>');
	var padding = $('<div class="admin-food-item-content-padding labeled-fields">');
	dish.append(content);
	content.append(padding);

	var options = $('<div class="admin-dish-options"></div>');
	var basicOptions = $('<div class="input-faker"></div>');
	var basicWrapper = $('<div class="admin-dish-options-wrapper" data-parent="BASIC"><div class="admin-dish-options-title">Basic options:</div></div>')
		.append(basicOptions);

	var optGroups = [];

	if (dishItem.options) {
		var opts = dishItem.options();

		options.append(basicWrapper);

		var options_with_children = {};
		for (var x in opts) {
			var option = opts[x];
			if (option.id_option_parent) {
				options_with_children[option.id_option_parent] = true;
			}
		}

		for (var x in opts) {
			var option = opts[x];
			if (option.id_option_parent) {
				continue;
			}

			if (option.type == 'check') {
				if( !options_with_children[ option.id ] ){
					basicOptions.append(App.returnOption(option,option.type));
				} else {
					var optionAdder = $('<div class="input-faker"></div>');
					var optionWrapper = $('<div class="admin-dish-options-wrapper" data-type="' + option.type + '" data-parent="' + option.id + '"><div class="admin-dish-options-title">' + option.name + ':</div></div>')
						.append(optionAdder);

					var select = $('<select class="cart-customize-select">');
					for (var i in opts) {
						if (opts[i].id_option_parent == option.id_option) {
							optionAdder.append(App.returnOption(opts[i],option.type,option.id_option));
						}
					}
					optionAdder.append(App.returnOption({price: '',name:'',id_option:''},option.type,option.id_option));
					options.append(optionWrapper);
				}
			} else if (option.type == 'select') {

				var optionAdder = $('<div class="input-faker"></div>');
				var optionWrapper = $('<div class="admin-dish-options-wrapper" data-type="' + option.type + '" data-parent="' + option.id + '"><div class="admin-dish-options-title">' + option.name + ':</div></div>')
					.append(optionAdder);

				var select = $('<select class="cart-customize-select">');
				for (var i in opts) {
					if (opts[i].id_option_parent == option.id_option) {
						optionAdder.append(App.returnOption(opts[i],option.type,option.id_option));
					}
				}
				optionAdder.append(App.returnOption({price: '',name:'',id_option:''},option.type,option.id_option));
				options.append(optionWrapper);
			}
		}

		basicOptions.append(App.returnOption({price: '',name:'',id_option:''},'check'));

		options.append('<div class="admin-restaurant-options-controls">'
			+ '<div class="control-link">'
				+ '<a href="javascript:;" class="control-link-add-option">'
					+ '<div class="control-icon-plus control-icon"></div>'
					+ '<label class="control-label">Add another option group?</label>'
				+ '</a>'
			+ '</div>'
		+ '</div><div class="divider"></div>');
	}

	var dishDescription = dishItem.description ? dishItem.description : '';
	var categories      = App.restaurantObject.categories();
	var categoryOptions = '';
	if (!dishItem.id_category) {
		console.log('ERROR, no category for this dish');
	}
	for (var i in categories) {
		var selected     = (categories[i].id_category == dishItem.id_category) ? ' selected="selected" ' : '';
		categoryOptions += '<option value="' + categories[i].id_category+ '" ' + selected + '>' + categories[i].name+ '</option>';
	}

	var active = (parseInt(dishItem.active)) ? 'checked="checked"' : '';

	dishItem.sort = ( dishItem.sort ) ? dishItem.sort : ( $('[data-id_category="'+ dishItem.id_category +'"] + div').find('.admin-food-item').length ? ( $('[data-id_category="'+ dishItem.id_category +'"] + div').find('.admin-food-item').length + 1 ) : 1 );

	padding
		.append('<input type="text" placeholder="Name" name="dish-name" class="dataset-dish clean-input dish-name" value="' + dishItem.name + '">')
		.append('<div class="input-faker dish-price"><div class="input-faker-content">$&nbsp;</div><input type="text" placeholder="" name="dish-price" value="' + dishItem.price + '" class="dataset-dish clean-input" data-clean_type="float"><div class="divider"></div></div>')
		.append('<div class="clear"></div>')
		.append('<label><span>Move to category</span><select name="dish-id_category" class="dataset-dish clean-input">' + categoryOptions + '</select></label')
		.append('<label><span>Active</span><input type="checkbox" name="dish-active" class="dataset-dish clean-input" ' + active + ' /></label')
		.append('<label><span>Sort order</span><input name="dish-sort" class="dataset-dish clean-input" value="' + dishItem.sort + '" /></label')
		.append('<textarea placeholder="Description" name="dish-description" class="dataset-dish clean-input dish-description">' + dishDescription + '</textarea>')
		.append('<div class="divider"></div><div class="divider dots" style="margin: 10px 0 10px 0;"></div>')
		.append(options);

	content
		.append('<div class="divider dots"></div>')
		.append('<div class="admin-food-item-content-padding"><div class="action-button red action-button-small admin-food-item-delete"><span>Delete</span></div><div class="divider"></div></div>')
		.append('<div class="divider"></div>');

	$('[data-id_category="'+ dishItem.id_category +'"] + div').append(dish);

	console.log(dishItem);
	if (!dishItem.id_dish) {
		dish.fadeIn(150, function() { $(dish).find('.dish-name').focus(); });
	}
};

/**
 * Adds the new Dish Category to the DOM
 *
 * @returns void
 */
App.createCategory = function(dialog) {
	var name                 = $('[name="admin-category-name"]',dialog).val();
	var sort                 = $('.accordion h3').length +1;
	var $categoriesContainer = $('.accordion');
	var options              = $categoriesContainer.accordion('option');
	var $categoryTab         = $('<h3 data-id_category="">' + name + '</h3>' +
	'<div>' +
		'<div class="labeled-fields category">' +
			'<label><span class="label">Name</span>       <input name="name" value="' + name + '" /></label>' +
			'<label><span class="label">Sort Order</span> <input name="sort" value="' + sort + '" /></label>' +
		'</div>' +
	'</div>');

	$categoriesContainer.accordion('destroy');
	$categoriesContainer.append($categoryTab);
	$categoriesContainer.accordion(options);

};

App.createOptionGroup = function(el, source) {
	el = $(el);
	var parent = source.closest('.admin-food-item-wrap');

	var option = {
		name: el.find('[name="admin-option-name"]').val(),
		price: el.find('[name="admin-option-price"]').attr('checked') ? true : false,
		type: el.find('[name="admin-option-type"]').val(),
		id_option: '',
		id: ''
	};

	var optionAdder = $('<div class="input-faker"></div>');
	var optionWrapper = $('<div class="admin-dish-options-wrapper" data-modifies_price="' + option.price + '" data-type="' + option.type + '" data-parent="' + option.id + '"><div class="admin-dish-options-title">' + option.name + ':</div></div>')
		.append(optionAdder);

	optionAdder.append(App.returnOption({price: '',name:'',id_option:''}, option.type, option.id_option));
	parent.find('.admin-dish-options .admin-restaurant-options-controls').before(optionWrapper);
};

/*
App.addOptionGroup = function(option) {
	var optionAdder = $('<div class="input-faker"></div>');
	var optionWrapper = $('<div class="admin-dish-options-wrapper"><div class="admin-dish-options-title">' + option.name + ':</div></div>')
		.append(optionAdder);

	var select = $('<select class="cart-customize-select">');
	for (var i in opts) {
		if (opts[i].id_option_parent == option.id_option) {
			optionAdder.append(App.returnOption(opts[i],option.type,option.id_option));
		}
	}
	optionAdder.append(App.returnOption({price: '',name:'',id_option:''},option.type,option.id_option));
	options.append(optionWrapper);
};
*/

App.returnOption = function(o, type, parent) {
	var defaulted  = '';
	switch (type) {
		case 'select':
			defaulted = '<input type="radio" class="dataset-dish" name="dish-options-default-' + parent + '" value="1" ' + (o['default'] == '1' ? 'checked="checked"' : '') + '>';
			break;

		default:
		case 'check':
			defaulted = '<input type="checkbox" class="dataset-dish" name="dish-options-default" value="1" ' + (o['default'] == '1' ? 'checked="checked"' : '') + '>';
			break;
	}

	var sort = (o.sort)? o.sort : 0;

	return $('<div class="divider"></div>'
		+ '<div class="admin-food-item-option-padding" data-type="' + type + '" data-parent="' + parent + '">'
			+ '<div class="dish-options ' + (o.id_option ? 'blue' : '') + '" data-id_option="' + o.id_option + '">'
				+ '<input type="text" placeholder="0" name="dish-options-sort" value="' + sort + '" />'
				+ '<span class="sortDesc">)</span>'
				+ defaulted
				+ '<input type="text" placeholder="Name" name="dish-options-name" value="' + o.name + '">'
				+ '<div class="input-faker-content">$ </div>'
				+ '<input type="text" placeholder="" name="dish-options-price" value="' + o.price + '">'
				+ '<a class="dish-options-delete" href="javascript:;"></a>'
				+ '<div class="divider"></div>'
			+ '</div>'
		+ '</div>');
};

App.orders = {
	searchParam: '',
	params: function() {
		var dates = $('input[name="date-range-end"]').val() + ',' + $('input[name="date-range-start"]').val();
		return {
			search: $('input[name="order-search"]').val(),
			env: $('select[name="env"]').val(),
			processor: $('select[name="processor"]').val(),
			limit: $('input[name="limit"]').val(),
			dates: dates,
			restaurant: $('select[name="restaurant"]').val(),
			community: $('select[name="community"]').val()
		};
	},
	load: function() {
		//admin-orders-filter
		$('.orders-loader').show();
		$('.orders-content').html('');
		$.ajax({
			url: '/orders/content',
			data: App.orders.params(),
			complete: function(content) {
				$('.orders-content').html(content.responseText);
				$('.orders-loader').hide();
			}
		});
		App.orders.searchParam = '';
	},
	export: function() {
		var params = App.orders.params();
		params.export = 'csv';
		location.href = '/orders/content?' + jQuery.param(params);
	},

	createEvents: function(){

		$(document).on('click', '.check-refunded', function() {

			var el = $(this);

			$( '.refunded-' + el.attr('data-uuid') ).show();

			el.html(' Checking <i class="icon-spinner icon-spin"></i>');

			var fail = function( result ){
				console.log( result.responseText);
				el.html('REFUND');
				var er = result.errors ? "\n\n" + result.errors : 'See the console.log!';
				alert('Checking fail: ' + er);
			}
			$.ajax({
				url: '/api/refund/check/' + el.attr('data-uuid'),
				success: function( result ){
					console.log('result',result);
						try {
							if( result.status && result.status == 'success' ){
								alert( 'Order already refunded!' );
								$( '.was-refunded-' + el.attr('data-uuid') ).html( 'REFUNDED' );
								el.hide();
								var do_not_reimburse_driver = $( '.do_not_reimburse_driver-' + el.attr('data-uuid') );
								do_not_reimburse_driver.show();
								var do_not_reimburse_driver_value = ( do_not_reimburse_driver.attr( 'data-value' ) == 1 ? 0 : 1 );
								do_not_reimburse_driver.attr( 'data-value', do_not_reimburse_driver_value );
								if( do_not_reimburse_driver_value ){
									do_not_reimburse_driver.find( 'span' ).html( '<i class="icon-check"></i>' );
								} else {
									do_not_reimburse_driver.find( 'span' ).html( '<i class="icon-check-empty"></i>' );
								}
							} else if( result.status && result.status == 'false' ){
								alert( 'Not refunded yet!' )
								el.html('Check if it was refunded');
							} else {
								fail( result );
								el.html('Check if it was refunded');
							}
						}
						catch (err) {
							fail( result );
						}
					},
				error: function( result ){
					fail( result );
				}
			})
		});

		$(document).on('click', '.refund', function() {

			var el = $(this);
			var question = 'Are you sure you want to refund this?';
			if( parseFloat( el.attr( 'data-gift' ) ) > 0 ){
				question += "\n";
				question += 'A gift card was used at this order the refund value will be $' + el.attr( 'data-charged' ) + ' + $' + el.attr( 'data-gift' ) + ' as gift card.' ;
			}
			if (!confirm( question )) {
				return;
			}

			$( '.refunded-' + el.attr('data-uuid') ).show();

			var do_not_reimburse_driver = $( '.do_not_reimburse_driver-' + el.attr('data-uuid') );
			do_not_reimburse_driver.show();
			var do_not_reimburse_driver_value = ( do_not_reimburse_driver.attr( 'data-value' ) == 1 ? 0 : 1 );
			do_not_reimburse_driver.attr( 'data-value', do_not_reimburse_driver_value );
			if( do_not_reimburse_driver_value ){
				do_not_reimburse_driver.find( 'span' ).html( '<i class="icon-check"></i>' );
			} else {
				do_not_reimburse_driver.find( 'span' ).html( '<i class="icon-check-empty"></i>' );
			}


			el.html(' REFUNDING <i class="icon-spinner icon-spin"></i>');

			var fail = function( result ){
				console.log( result.responseText);
				el.html('REFUND');
				var er = result.errors ? "\n\n" + result.errors : 'See the console.log!';

				alert('Refunding fail! ' + er);
			}
			$.ajax({
				url: '/api/refund/' + el.attr('data-uuid'),
				success: function( result ){
					console.log('result',result);
						try {
							if( result.status && result.status == 'success' ){
								el.html('REFUNDED');
								$( '.check-was-refunded-' + el.attr('data-uuid') ).hide();
							} else {
								fail( result );
							}
						}
						catch (err) {
							fail( result );
						}
					},
				error: function( result ){
					fail( result );
				}
			})
		});

		$(document).on( 'click', '.pay_if_refunded', function() {
			var el = $( this );
			var uuid = el.attr( 'data-uuid' );
			var value = ( el.attr( 'data-value' ) == 1 ? 0 : 1 );
			el.attr( 'data-value', value );
			var url = '/api/order/' + el.attr('data-uuid') + '/pay_if_refunded/' + value;
			$.getJSON( url ,function( json ) {
				if( value ){
					el.find( 'span' ).html( '<i class="icon-check"></i>' );
				} else {
					el.find( 'span' ).html( '<i class="icon-check-empty"></i>' );
				}
			});
		});

		$(document).on( 'click', '.do_not_reimburse_driver', function() {
			var el = $( this );
			var uuid = el.attr( 'data-uuid' );
			var value = ( el.attr( 'data-value' ) == 1 ? 0 : 1 );
			el.attr( 'data-value', value );
			var url = '/api/order/' + el.attr('data-uuid') + '/do_not_reimburse_driver/' + value;
			$.getJSON( url ,function( json ) {
				if( value ){
					el.find( 'span' ).html( '<i class="icon-check"></i>' );
				} else {
					el.find( 'span' ).html( '<i class="icon-check-empty"></i>' );
				}
			});
		});


		$(document).on('click', '.resend_notification', function() {
			var el = $(this);
			var question = 'Are you sure you want to resend the notification?';
			if( parseFloat( el.attr( 'data-confirmed' ) ) > 0 ){
				question += "\n";
				question += 'This order was already confirmed!' ;
			}
			if (!confirm( question )) {
				return;
			}
			$.getJSON('/api/order/' + el.attr('data-uuid') + '/resend_notification',function( json ) {
				if( json.status == 'success' ){
					alert('Notification resent!');
				} else {
					alert('Oops, error! Please try it again.');
				}
			});
		});


		$(document).on('click', '.resend_notification_drivers', function() {
			var el = $(this);
			var question = 'Are you sure you want to resend the notification?';
			if( parseFloat( el.attr( 'data-confirmed' ) ) > 0 ){
				question += "\n";
				question += 'This order was already confirmed!' ;
			}
			if (!confirm( question )) {
				return;
			}
			$.getJSON('/api/order/' + el.attr('data-uuid') + '/resend_notification_drivers',function( json ) {
				if( json.status == 'success' ){
					alert('Notification resent!');
				} else {
					alert('Oops, error! Please try it again.');
				}
			});
		});
	}
};


App.logs = {
	searchParam: '',
	params: function() {
		var dates = $('input[name="date-range-end"]').val() + ',' + $('input[name="date-range-start"]').val();
		return {
			search: $('input[name="logs-search"]').val(),
			level: $('select[name="logs-level"]').val(),
			type: $('select[name="logs-type"]').val(),
			limit: $('input[name="limit"]').val(),
			dates: dates
		};
	},
	load: function() {
		//admin-orders-filter
		$('.logs-loader').show();
		$('.logs-content').html('');
		$.ajax({
			url: '/logs/content',
			data: App.logs.params(),
			complete: function(content) {
				$('.logs-content').html(content.responseText);
				$('.logs-loader').hide();
			}
		});
		App.orders.searchParam = '';
	},
	export: function() {
		var params = App.orders.params();
		params.export = 'csv';
		location.href = '/logs/content?' + jQuery.param(params);
	}
};

App.suggestions = {
	params: function() {
		return {
			search: $('input[name="suggestion-search"]').val(),
			type: $('select[name="type"]').val(),
			status: $('select[name="status"]').val(),
			limit: $('input[name="limit"]').val(),
			dates: $('input[name="date-range"]').val(),
			restaurant: $('select[name="restaurant"]').val(),
			community: $('select[name="community"]').val()
		};
	},
	load: function() {
		$('.suggestions-loader').show();
		$('.suggestions-content').html('');
		$.ajax({
			url: '/suggestions/content',
			data: App.suggestions.params(),
			complete: function(content) {
				$('.suggestions-content').html(content.responseText);
				$('.suggestions-loader').hide();
			}
		});
	}
};

App.supportAdmin = {
	params: function() {
		return {
			search: $('input[name="support-search"]').val(),
			type: $('select[name="type"]').val(),
			limit: $('input[name="limit"]').val(),
			dates: $('input[name="date-range"]').val()
		};
	},
	load: function() {
		$('.support-loader').show();
		$('.support-content').html('');
		$.ajax({
			url: '/support/content',
			data: App.supportAdmin.params(),
			complete: function(content) {
				$('.support-content').html(content.responseText);
				$('.support-loader').hide();
			}
		});
	}
};

App.credits = {
	params: function() {
		return {
			id_order: $('input[name="id_order"]').val(),
			id_user: $('input[name="id_user"]').val(),
			type: $('select[name="type"]').val(),
			limit: $('input[name="limit"]').val(),
			dates: $('input[name="date-range"]').val(),
			restaurant: $('select[name="restaurant"]').val()
		};
	},
	load: function() {
		$('.credits-loader').show();
		$('.credits-content').html('');
		$.ajax({
			url: '/credits/content',
			data: App.credits.params(),
			complete: function(content) {
				$('.credits-content').html(content.responseText);
				$('.credits-loader').hide();
			}
		});
	},
	prepareForm: function( id_suggetion ){
		$(document).on('click', '.admin-credit-save', function() {

			var value = $.trim( $( '#value' ).val() );
			var id_restaurant = $( '#id_restaurant' ).val();
			var id_user = $( '#id_user' ).val();
			var note = $( '#note' ).val();
			var id_order_reference = $( '#id_order_reference' ).val();
			var paid_by = $( '#paid_by' ).val();
			var id_restaurant_paid_by = $( '#id_restaurant_paid_by' ).val();

			if( value == '' ){
				alert( 'Please type a value!' );
				$( '#value' ).focus();
				return;
			}

			if( id_user == '' ){
				alert( 'Please choose an user!' );
				$( '#id_user' ).focus();
				return;
			}

			if( id_restaurant == '' ){
				alert( 'Please choose a restaurant!' );
				$( '#id_restaurant' ).focus();
				return;
			}
			var data = { 'value' : value, 'id_user' : id_user, 'id_restaurant' : id_restaurant, 'note' : note, 'paid_by' : paid_by, 'id_order_reference' : id_order_reference, 'id_restaurant_paid_by' : id_restaurant_paid_by };

			var url = App.service + 'credit/new';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: data,
				url: url,
				success: function( json ) {
					if( json.error ){
						alert( 'Error at adding a new credit!' );
					} else {
						alert( 'Credit added!' );
						location.href = '/credits';
					}
				},
				error: function( ){
					alert( 'Error at adding a new credit!' );
				}
			});
		} );
	}
};

$(function() {
	$(document).on('click', '.admin-restaurant-link', function() {
		App.loadRestaurant($(this).attr('data-id_restaurant'));
	});

	/**
	 * Adds a new hours range if they are all filled up
	 *
	 * @return void
	 */
	$(document).on('keyup', '.hours-date-hour input', function() {
		var allfull = true;
		$(this).closest('.hours-date-hours').find('input').each(function() {
			if ($(this).val() == '') {
				allfull = false;
			}
		});
		if (allfull) {
			var day = $(this).attr('name').replace(/(-open|-close)(\[\])/,'');
			var row = $('<div class="hours-date-hour"></div>');
			row.append('<input type="text" name="' + day + '-open[]"> TO <input type="text" name="' + day + '-close[]">');
			$(this).closest('.hours-date-hour').append(row);
		}
	});

	$(document).on('click', '.admin-restaurant-revert', loadSavedData);

	$(document).on('click', '.admin-restaurant-save', function() {
		saveRestaurant();
	});

	$(document).on('click', '.admin-restaurant-save-hours', function() {
		saveHours();
	});

	$(document).on('click', '.admin-restaurant-save-dishes', function() {
		_saveCategories(function(){
			saveDishes();
		});
	});

	$(document).on('click', '.admin-restaurant-hours-save-all', function() {
		$('.admin-restaurant-hours-save-link').click();
	});

	$(document).on('click', '.check label', function() {
		$(this).closest('.check').find('input').click();
	});

	$(document).on('click', '.date-range-all label', function() {
		$(this).parent().find('input').click();
	});

	$(document).on('keyup', '[name="phone"]', function() {
		$(this).val( App.phone.format($(this).val()) );
	});

	var changeACheck = function() {
		var name = $(this).attr('name');
		var parent = $(this).closest('.content-sub').length ? $(this).closest('.content-sub') : $(this).closest('.content-primary');
		parent.find('input[name="' + name + '_check"][value="1"]').prop('checked', true);
		parent.find('input[name="' + name + '_check"][value="0"]').prop('checked', false);
	};

	$(document).on('change', '.change-a-check', changeACheck);
	$(document).on('keyup', '.change-a-check', changeACheck);

	/**
	 * Folds/unfolds the checkbox options
	 *
	 * @return void
	 */
	$(document).on('click', '.bind-a-check', function(e) {
		var name   = $(this).attr('name');
		var value  = $(this).attr('value');
		var parent = $(this).closest('.content-sub').length ? $(this).closest('.content-sub') : $(this).closest('.content-primary');

		$(this).prop('checked', true);
		parent.find('input[name="' + name + '"][value="' + (value == '1' ? '0' : '1') + '"]').prop('checked', false);

		if (value == '1') {
			parent.find('.check-content').fadeIn(150);
		} else {
			parent.find('.check-content').fadeOut(150);
		}
	});

	$(document).on('click', '.bind-a-check-values', function(e) {
		var name   = $(this).attr('name');
		var value  = $(this).attr('value');
		var parent = $(this).closest('.content-sub').length ? $(this).closest('.content-sub') : $(this).closest('.content-primary');

		$(this).prop('checked', true);
		parent.find('input[name="' + name + '"][value="' + (value == '1' ? '0' : '1') + '"]').prop('checked', false);

		var input_name = name.replace( '_check', '' );
		var input = parent.find('[name='+input_name+']');
		if (value == '1') {
			parent.find('.check-content').fadeIn(150);
			input.val( input.attr( 'old-value' ) || 0 );
		} else {
			parent.find('.check-content').fadeOut(150);
			input.attr( 'old-value', input.val() );
			input.val(0)
		}
	});

	if ($('.date-picker').length) {
		var d = $('.date-picker').val();
		d = d.split(',');

/*
		$('.date-picker').DatePicker({
			format: 'm/d/Y',
			date: d,
			current: d[0],
			starts: 1,
			mode: 'range',
			calendars: 2,
			position: 'r',
			onBeforeShow: function(){
				//$('.date-picker').DatePickerSetDate($('.date-picker').val(), true);
			},
			onChange: function(formated, dates){
				$('.date-picker').val(formated);
				if ($('#closeOnSelect input').attr('checked')) {
					$('.date-picker').DatePickerHide();
				}
			}
		});
		*/
	}

	$(document).on('change', 'input[name="date-range-all"]', function() {
		if ($(this).prop('checked')) {
			$('.date-picker').attr('disabled', 'disabled');
			$('.date-picker').val('');
			$('.dates').hide();
		} else {
			$('.date-picker').removeAttr('disabled');
			$('.dates').show();
		}
	});

	$(document).on('change', '.hours-date-hour input', function() {
		$(this).val(App.formatTime($(this).val()));
	});

	/**
	 * What to do when clicking a dish
	 *
	 * @todo refactorize how the accordion should be redrawn in a private method
	 */
	$(document).on('click', '.admin-food-item', function() {
		var speed = 100;
		$(this).closest('.admin-food-item-wrap').find('.admin-food-item-content').slideToggle(speed);
		$(this).toggleClass('admin-food-item-collapsed');

		// re-draws the dishes accordion after expanding/collapsing dish
		var accordionOptions = $('.accordion').accordion('option');
		setTimeout(function() {
			$('.accordion').accordion('destroy');
			$('.accordion').accordion(accordionOptions);
		}, 1.1 * speed);

	});

	var ignoreKeys = [37,38,39,40,16,9]; //,17,18,91,13,16

	var cleanInput = function(e) {
		if (ignoreKeys.indexOf(e.which) !== -1) {
			return;
		}
		var cleaned = App.cleanInput($(this).val(), $(this).attr('data-clean_type') || 'text');
		var caret = $(this).getCursorPosition();
		$(this).val(cleaned);
		if (e.type == 'keyup') {
			$(this).setCursorPosition(caret);
		}
	};

	$(document).on('keyup', '.clean-input', cleanInput);
	$(document).on('change', '.clean-input', cleanInput);

	var changeDish = function(e) {
		$(this).closest('.admin-food-item-wrap').find('.food-name').html($(this).val());
	};


	$(document).on('keyup', '.dish-name', changeDish);
	$(document).on('change', '.dish-name', changeDish);

	var changePrice = function(e) {
		$(this).closest('.admin-food-item-wrap').find('.food-price-num').html($(this).val());
	};

	$(document).on('keyup', '.dish-price input', changePrice);
	$(document).on('change', '.dish-price input', changePrice);

	/**
	 * Show the new dish dialog to set a category for it
	 *
	 * @todo Make the categories select a function to be reused
	 *
	 * @return boolean
	 */
	$(document).on('click', '.control-link-add-dish', function() {

		var categories      = App.restaurantObject.categories();
		var categoryOptions = '';
		for (var i in categories) {
			var selected     = (categories[i].id_category == $('.ui-accordion-header-active').attr('data-id_category')) ? ' selected="selected" ' : '';
			categoryOptions += '<option value="' + categories[i].id_category + '" ' + selected + '>' + categories[i].name + '</option>';
		}

		var html = '<div id="dialog-add-dish" title="Create new Dish"> ' +
			'<select name="dish-id_category">' + categoryOptions + '</select>' +
		'</div>';
		$(html).dialog({
			resizable: false,
			height:    160,
			width:     315,
			modal:     true,
			open: function() {
				var $this=$(this);
				$this.keypress(function(e){
					if(e.keyCode==13) {
						$this.parent().find('.ui-dialog-buttonpane button:first').click();
						return false;
					}
				});
			},
			buttons: {
				'Create': function() {
					var category = $('[name="dish-id_category"]', this).val();
					App.showDish({
						id_category:category
					});
					$(this).dialog('close');
					$(this).remove();
				},
				Cancel: function() {
					$(this).dialog('close');
					$(this).remove();
				}
			}
		});

		return false;
	});

	$(document).on('click', '.admin-food-item-delete', function() {

		var parent = $(this).closest('.admin-food-item-wrap');
		var id_dish = parent.attr('data-id_dish');
		var name = parent.find('.dish-name').val();

		var remove = function() {
			parent.fadeOut(150,function() {
				$(this).remove();
			});
		};

		if (!id_dish) {
			remove();
		} else {
			if (confirm('Are you sure you want to delete "' + name + '"')) {
				remove();
				App.deletedDishes.push( id_dish );
			}
		}
	});

	$(document).on('click', '.dish-options-delete', function() {
		var parent = $(this).closest('.dish-options');
		var id_option = parent.attr('data-id_option');
		var name = parent.find('input[name="dish-options-name"]').val();

		var remove = function() {
			parent.fadeOut(150,function() {
				$(this).remove();
			});
		};

		if (!id_option) {
			remove();
		} else {
			if (confirm('Are you sure you want to delete "' + name + '"')) {
				remove();
			}
		}
	});

	$(document).on('keyup', '.admin-dish-options-wrapper input[type="text"]', function() {
		var allfull = true;

		$(this).closest('.admin-dish-options-wrapper').find('.dish-options').each(function() {

			var selfComplete = true;
			$(this).find('input[type="text"]').each(function() {
				if ($(this).val() == '' || !$(this).val()) {
					allfull = selfComplete = false;
				}
			});
			if (selfComplete) {
				$(this).addClass('blue');
			}
		});

		if (allfull) {
			$(this).closest('.input-faker').append(App.returnOption({price: '', name: '', id_option: ''},$(this).closest('.admin-dish-options-wrapper').attr('data-type'),$(this).closest('.admin-dish-options-wrapper').attr('data-parent')));
		}
	});

	$(document).on('click', '.control-link-add-option', function() {
		var self = $(this);
		$('#dialog-option-group').dialog({
			resizable: false,
			height: 250,
			width: 400,
			modal: true,
			open: function() {
				var $this=$(this);
				$this.keypress(function(e){
					if(e.keyCode==13) {
						$this.parent().find('.ui-dialog-buttonpane button:first').click();
						return false;
					}
				});
			},
			buttons: {
				'Create': function() {
					if ($(this).find('[name="admin-option-name"]').val()) {
						App.createOptionGroup(this, self);
						$(this).dialog('close');
						$(this).find('[name="admin-option-name"]').val('');
						$(this).find('[name="admin-option-price"]').removeAttr('checked');
						$(this).find('[name="admin-option-type"]').val('check');
					}
				},
				Cancel: function() {
					$(this).dialog('close');
					$(this).find('[name="admin-option-name"]').val('');
					$(this).find('[name="admin-option-price"]').removeAttr('checked');
					$(this).find('[name="admin-option-type"]').val('check');
				}
			}
		});
	});

	/**
	 * Opens new Dish Category dialog
	 *
	 * @returns boolean
	 */
	$(document).on('click', '.control-link-add-category', function() {
		$('#dialog-add-menu').dialog({
			resizable: false,
			height: 160,
			width: 315,
			modal: true,
			open: function() {
				var $this=$(this);
				$this.keypress(function(e){
					if(e.keyCode==13) {
						$this.parent().find('.ui-dialog-buttonpane button:first').click();
						return false;
					}
				});
			},
			buttons: {
				'Create': function() {
					if ($(this).find('[name="admin-category-name"]').val()) {
						App.createCategory(this);
						$(this).dialog('close');
						$(this).find('[name="admin-category-name"]').val('');
					}
				},
				Cancel: function() {
					$(this).dialog('close');
					$(this).find('[name="admin-category-name"]').val('');
				}
			}
		});
		return false;
	});


});


(function($) {
	$.fn.getCursorPosition = function() {
		var input = this.get(0);
		if( $( input ).attr( 'type' ) == 'checkbox' ){return;}
		if (!input) return; // No (input) element found
		if ('selectionStart' in input) {
			// Standard-compliant browsers
			return input.selectionStart;
		} else if (document.selection) {
			// IE
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			return sel.text.length - selLen;
		}
	}

	$.fn.setCursorPosition = function(position){
		if(this.length == 0) return this;
		return $(this).setSelection(position, position);
	}

	$.fn.setSelection = function(selectionStart, selectionEnd) {
		if(this.length == 0) return this;
		input = this[0];

		if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		} else if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}

		return this;
	}

})(jQuery);



App.giftcards = {
	params: function() {
		var dates = $('input[name="date-range-end"]').val() + ',' + $('input[name="date-range-start"]').val();
		return {
			id_order: $('input[name="id_order"]').val(),
			id_user: $('input[name="id_user"]').val(),
			type: $('select[name="type"]').val(),
			limit: $('input[name="limit"]').val(),
			dates: dates,
			restaurant: $('select[name="restaurant"]').val()
		};
	},
	load: function() {
		$('.giftcards-loader').show();
		$('.giftcards-content').html('');
		$.ajax({
			url: '/giftcards/content',
			data: App.giftcards.params(),
			complete: function(content) {
				$('.giftcards-content').html(content.responseText);
				$('.giftcards-loader').hide();
			}
		});
	},

	prepareFormBunchSMS : function(){

		$(document).on('click', '[name=track]', function() {
			var checkbox = $( this );
			if( checkbox.is( ':checked' ) ){
				$( '.track-fields' ).show();
			} else {
				$( '.track-fields' ).hide();
			}
		});

		$(document).on('click', '.admin-giftcard-save', function() {

			var value = $.trim( $( '#value' ).val() );
			var id_restaurant = $( '#id_restaurant' ).val();
			var phones = $( '#phones' ).val();

			var paid_by = $( '#paid_by' ).val();
			var id_restaurant_paid_by = $( '#id_restaurant_paid_by' ).val();
			var note = $( '#note' ).val();

			var created_by = $.trim( $( '#created_by' ).val() );
			var track = ( $('#track').is(':checked') ? 1 : 0 );
			var notify_phone = $.trim( $( '#notify_phone' ).val() );
			var name = $.trim( $( '#name' ).val() );
			var how_delivery = $.trim( $( '#how_delivery' ).val() );
			var contact = $.trim( $( '#contact' ).val() );

			if( phones == '' ){
				alert( 'Please enter the phone(s) number!' );
				$( '#phones' ).focus();
				return;
			}

			if( value == '' ){
				alert( 'Please type a value!' );
				$( '#value' ).focus();
				return;
			}

			if( id_restaurant == '' ){
				alert( 'Please choose a restaurant!' );
				$( '#id_restaurant' ).focus();
				return;
			}

			if( track > 0 ){
				if( notify_phone == '' ){
					alert( 'Please type the phone number that will receive a sms!' );
					$( '#notify_phone' ).focus();
					return;
				}
			}

			var data = { 'value' : value,'id_restaurant' : id_restaurant, 'phones' : phones, 'paid_by' : paid_by, 'id_restaurant_paid_by' : id_restaurant_paid_by, 'note' : note, 'created_by' : created_by, 'track' : track, 'notify_phone' : notify_phone, 'name' : name, 'how_delivery' : how_delivery, 'contact' : contact };
			var url = App.service + 'giftcard/bunchsms';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: data,
				url: url,
				success: function( json ) {
					if( json.error ){
						alert( 'Oops, error!' );
					} else {
						alert( 'Gift card(s) created and sent!' );
						location.href = '/giftcards';
					}
				},
				error: function( ){
					alert( 'Oops, error!' );
				}
			});
		} );
	},
	prepareFormBunchEMAIL: function(){

		$(document).on('click', '[name=track]', function() {
			var checkbox = $( this );
			if( checkbox.is( ':checked' ) ){
				$( '.track-fields' ).show();
			} else {
				$( '.track-fields' ).hide();
			}
		});

		$(document).on('click', '.admin-giftcard-save', function() {

			var value = $.trim( $( '#value' ).val() );
			var id_restaurant = $( '#id_restaurant' ).val();
			var emails = $( '#emails' ).val();
			var subject = $( '#subject' ).val();
			var content = $( '#content' ).val();

			var created_by = $.trim( $( '#created_by' ).val() );
			var track = ( $('#track').is(':checked') ? 1 : 0 );
			var notify_phone = $.trim( $( '#notify_phone' ).val() );
			var name = $.trim( $( '#name' ).val() );
			var how_delivery = $.trim( $( '#how_delivery' ).val() );
			var contact = $.trim( $( '#contact' ).val() );

			var paid_by = $( '#paid_by' ).val();
			var id_restaurant_paid_by = $( '#id_restaurant_paid_by' ).val();
			var note = $( '#note' ).val();

			if( emails == '' ){
				alert( 'Please enter the email(s) number!' );
				$( '#emails' ).focus();
				return;
			}

			if( value == '' ){
				alert( 'Please type a value!' );
				$( '#value' ).focus();
				return;
			}

			if( id_restaurant == '' ){
				alert( 'Please choose a restaurant!' );
				$( '#id_restaurant' ).focus();
				return;
			}

			if( subject == '' ){
				alert( 'Please type the subject!' );
				$( '#subject' ).focus();
				return;
			}

			if( content == '' ){
				alert( 'Please type the content!' );
				$( '#content' ).focus();
				return;
			}

			if( track > 0 ){
				if( notify_phone == '' ){
					alert( 'Please type the phone number that will receive a sms!' );
					$( '#notify_phone' ).focus();
					return;
				}
			}

			var data = { 'value' : value,'id_restaurant' : id_restaurant, 'emails' : emails, 'subject':subject, 'content': content, 'paid_by' : paid_by, 'id_restaurant_paid_by' : id_restaurant_paid_by, 'note' : note, 'created_by' : created_by, 'track' : track, 'notify_phone' : notify_phone, 'name' : name, 'how_delivery' : how_delivery, 'contact' : contact };
			var url = App.service + 'giftcard/bunchemail';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: data,
				url: url,
				success: function( json ) {
					if( json.error ){
						alert( 'Oops, error!' );
					} else {
						alert( 'Gift card(s) created and sent!' );
						location.href = '/giftcards';
					}
				},
				error: function( ){
					alert( 'Oops, error!' );
				}
			});
		} );
	},
	prepareFormSendSMS : function(){
		$(document).on('click', '.admin-giftcard-sms', function() {
			var id_promo = $( '#id_promo' ).val();
			var data = { 'id_promo' : id_promo };
			var url = App.service + 'giftcard/sms';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: data,
				url: url,
				success: function( json ) {
					if( json.error ){
						alert( 'Oops, error!' );
					} else {
						alert( 'Gift card(s) sent!' );
						location.reload();
					}
				},
				error: function( ){
					alert( 'Oops, error!' );
				}
			});
		} );
	},
	prepareFormSendEMAIL: function(){
		$(document).on('click', '.admin-giftcard-email', function() {
			var id_promo = $( '#id_promo' ).val();
			var data = { 'id_promo' : id_promo };
			var url = App.service + 'giftcard/email';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: data,
				url: url,
				success: function( json ) {
					if( json.error ){
						alert( 'Oops, error!' );
					} else {
						alert( 'Gift card(s) sent!' );
						location.reload();
					}
				},
				error: function( ){
					alert( 'Oops, error!' );
				}
			});
		} );
	},
	prepareFormAddUser: function(){
		$(document).on('click', '.admin-giftcard-save', function() {
			var id_user = $( '#id_user' ).val();
			var id_promo = $( '#id_promo' ).val();
			if( id_user == '' ){
				alert( 'Please choose an user!' );
				$( '#id_user' ).focus();
				return;
			}
			var data = { 'id_promo' : id_promo, 'id_user' : id_user };
			var url = App.service + 'giftcard/relateuser';
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: data,
				url: url,
				success: function( json ) {
					if( json.error ){
						alert( 'Oops, error!' );
					} else {
						alert( 'Gift card(s) saved!' );
						location.reload();
					}
				},
				error: function( ){
					alert( 'Oops, error!' );
				}
			});
		} );
	}
};

function create_support_from_order(id_order) {
	full_post(
		'/support/new',
		{
			'action' : 'new',
			'id_order' : id_order,
		});
}

function full_post(url, data){

		$('body').append($('<form/>', {
			id: 'jQueryPostItForm',
			method: 'POST',
			action: url
		}));

		for(var i in data){
			$('#jQueryPostItForm').append($('<input/>', {
				type: 'hidden',
				name: i,
				value: data[i]
			}));
		}

		$('#jQueryPostItForm').submit();
}

App.giftcardsGroup = {
	params: function() {
		return {
			name: $('input[name="name"]').val()
		};
	},
	load: function() {
		$('.giftcards-group-loader').show();
		$('.giftcards-group-content').html('');
		$.ajax({
			url: '/giftcards/groups/content',
			data: App.giftcardsGroup.params(),
			complete: function(content) {
				$('.giftcards-group-content').html(content.responseText);
				$('.giftcards-group-loader').hide();
			}
		});
	},
	remove: function( id_promo_group ){
		$.ajax({
			url: '/giftcards/groups/remove',
			type: 'POST',
			data: { 'id_promo_group': id_promo_group } ,
			complete: function() {
				App.giftcardsGroup.load();
			}
		});
	},
}


App.permissions = {};

App.permissions.admin = {
	params: function() {
		return {
			name: $('input[name="name"]').val()
		};
	},
	load: function() {
		$('.permissions-loader').show();
		$('.permissions-content').html('');
		$.ajax({
			url: '/permissions/users/content',
			data: App.permissions.admin.params(),
			complete: function(content) {
				$('.permissions-content').html(content.responseText);
				$('.permissions-loader').hide();
			}
		});
	},
	remove: function( id_admin ){
		return;
	},
	inactive: function( id_admin ){
		var url = App.service + 'permissions/users/' + id_admin + '/inactive';
		$.ajax({
			url: url,
			type: 'POST',
			data: { 'id_admin': id_admin } ,
			complete: function() {
				App.permissions.admin.load();
			}
		});
	},
	active: function( id_admin ){
		var url = App.service + 'permissions/users/' + id_admin + '/active';
		$.ajax({
			url: url,
			type: 'POST',
			data: { 'id_admin': id_admin } ,
			complete: function() {
				App.permissions.admin.load();
			}
		});
	},
}

App.permissions.group = {
	params: function() {
		return {
			name: $('input[name="name"]').val()
		};
	},
	load: function() {
		$('.permissions-loader').show();
		$('.permissions-content').html('');
		$.ajax({
			url: '/permissions/groups/content',
			data: App.permissions.group.params(),
			complete: function(content) {
				$('.permissions-content').html(content.responseText);
				$('.permissions-loader').hide();
			}
		});
	},
	remove: function( id_group ){
		$.ajax({
			url: '/permissions/groups/remove',
			type: 'POST',
			data: { 'id_group': id_group } ,
			complete: function() {
				App.permissions.group.load();
			}
		});
	},
}



var hour_override = { callback : false };

hour_override.setCallback = function( callback ){
	hour_override.callback = callback;
}

hour_override.load = function(){
	var url = '/restaurants/' + _id_restaurant + '/hour_override';
	$.get( url, function( data ) {
		$( '.modal-hour_override-body' ).html( data );
	} );
}

hour_override.remove = function( id_restaurant_hour_override ){

	if( !confirm( 'Confirm remove?' ) ){
		return;
	}

	var url = App.service + 'houroverride/remove';
	$.ajax({
		type: 'POST',
		dataType: 'json',
		data: { 'id_restaurant_hour_override' : id_restaurant_hour_override },
		url: url,
		success: function( json ) {
			if( json.error ){
				alert( 'Error removing!' );
			} else {
				alert( 'Removed!' );
				if( hour_override.callback ){
					hour_override.callback();
				}
				hour_override.load();
			}
		},
		error: function( ){
			alert( 'Error removing!' );
		}
	});
}

hour_override.save = function(){

	var date_start = $( '#hour_override_date_start' ).val();
	var date_start_hour = $( '#hour_override_date_start_hour' ).val();
	var hour_override_date_start_ampm = $( '#hour_override_date_start_ampm' ).val();
	var date_end = $( '#hour_override_date_end' ).val();
	var date_end_hour = $( '#hour_override_date_end_hour' ).val();
	var hour_override_date_end_ampm = $( '#hour_override_date_end_ampm' ).val();
	var type = $( '#hour_override_type' ).val();
	var notes = $( '#hour_override_notes' ).val();

	if( $.trim( date_start ) == '' ){
		alert( 'Please type the start date.' );
		$( '#hour_override_date_start' ).focus();
		return;
	}

	 if( !/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test( date_start_hour ) ){
			alert( 'Please type a valid start hour! \nFormat hh:mm!' );
			$( '#hour_override_date_start_hour' ).focus();
			return;
	 }

	if( $.trim( date_end ) == '' ){
		alert( 'Please type the end date.' );
		$( '#hour_override_date_end' ).focus();
		return;
	}

 if( !/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test( date_end_hour ) ){
			alert( 'Please type a valid end hour! \nFormat hh:mm!' );
			$( '#hour_override_date_end_hour' ).focus();
			return;
	 }


	if( $.trim( notes ) == '' ){
		alert( 'Please type the notes.' );
		$( '#hour_override_notes' ).focus();
		return;
	}

	var data = {
			'id_restaurant' : _id_restaurant,
			'date_start' : date_start,
			'date_start_hour' : date_start_hour,
			'hour_override_date_start_ampm' : hour_override_date_start_ampm,
			'date_end' : date_end,
			'date_end_hour' : date_end_hour,
			'hour_override_date_end_ampm' : hour_override_date_end_ampm,
			'type' : type,
			'notes' : notes
		}

	var url = App.service + 'houroverride/add';
	$.ajax({
		type: 'POST',
		dataType: 'json',
		data: data,
		url: url,
		success: function( json ) {
			if( json.error ){
				var error = ( json.error != 'error' ) ? json.error : '';
				alert( 'Error adding!' + '\n' + error );
			} else {
				alert( 'Added!' );
				hour_override.load();
				if( hour_override.callback ){
					hour_override.callback();
				}
			}
		},
		error: function( ){
			alert( 'Error adding!' );
		}
	});
}

var admin_config = {};
admin_config.save = function( key, value, success, error ){
	var url = App.service + 'adminconfig';
	$.ajax({
		type: 'POST',
		dataType: 'json',
		data: { 'key' : key, 'value' : value },
		url: url,
		success: function( json ) {
			if( json.error ){
				if( error ){
					error( json );
				}
			} else {
				if( success ){
					success();
				}
			}
		},
		error: function( ){
			if( error ){
				error();
			}
		}
	});
}


App.phone = {

	/**
	 * //Add dashes to the phone number, unifying how phone number looks
	 * Not doing anything, as german phone numbers are harder to format
	 */
	format: function(num) {
		if( num != null ){
			num = num.replace(/^\+49|0/,'0');
			//num = num.replace(/[^\d]*/gi,'');
			//num = num.substr(0,10);

			//if (num.length >= 7) {
				//num = num.replace(/(\d{3})(\d{3})(.*)/, "$1-$2-$3");
			//} else if (num.length >= 4) {
				//num = num.replace(/(\d{3})(.*)/, "$1-$2");
			//}
			
		}
		return num;
	},
	validate: function(num) {

		if( !num ){
			return false;
		}

		num = num.replace( /[^0-9]/g, '' );
		
		if (!num || num.length <= 3) {
			return false;
		}

		//TODO better test
		/*
		if (!num || num.length != 10) {
			return false;
		}
		var
			nums = num.split(''),
			prev;

		for (x in nums) {
			if (!prev) {
				prev = nums[x];
				continue;
			}

			if (nums[x] != prev) {
				return true;
			}
		}
		return false;
		*/
		
		return true;
	}
};



function compareArrays(a, b) {
		var i = a.length;
		if (i != b.length) return false;
		while (i--) {
				if (a[i] !== b[i]) return false;
		}
		return true;
};
