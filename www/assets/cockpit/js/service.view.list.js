
NGApp.factory('ViewListService', function($location, $timeout, $interval) {

	var service = {};

	service.view = function(params) {
		var scope = params.scope;
		var query = $location.search();
		var defaultLimit = query.limit || (App.isMobile() ? 5 : 20);

		scope.query = {
			limit: defaultLimit,
			page: query.page || 1
		};
		scope.query.page = parseInt(scope.query.page);

		var timer = undefined;
		var last_search = null;

		var watch = function() {
			var new_search = JSON.stringify( scope.query );
			if( new_search == last_search ){
				return;
			}
			last_search = new_search;
			$location.search(scope.query);
			if( angular.isDefined( timer ) ) {
				$interval.cancel( timer );
				timer = undefined;
			}
			timer = $interval(function(){
				$interval.cancel( timer );
				timer = undefined;
				update();
			}, 1000 );
		};

		// @todo: this breaks linking to pages
		var inputWatch = function() {
			if (scope.query.page != 1) {
				scope.query.page = 1;
			} else {
				watch();
			}
		};

		scope.watch = function(vars) {
			for (var x in vars) {
				scope.query[x] = query[x] || vars[x];
				if( x ){
					scope.$watch('query.' + x, inputWatch);
				}
			}
		};

		scope.count = 0;
		scope.pages = 0;

		scope.allowAll = params.allowAll ? true : false;

		scope.$watch('query.limit', inputWatch);
		scope.$watch('query.page', watch);

		scope.setPage = function(page) {
			scope.query.page = page;
			App.scrollTop(0);
		};

		scope.viewAll = function() {
			if (!scope.allowAll) {
				return;
			}
			scope.query.page = 1;
			scope.query.limit = 'none';
		};

		scope.viewLess = function() {
			if (!scope.allowAll) {
				return;
			}
			scope.query.page = 1;
			scope.query.limit = defaultLimit;
		};

		scope.sort = function(by) {
			if (scope.query.sort == by) {
				scope.query.sort = '-' + by;
			} else {
				scope.query.sort = by;
			}
		};

		var updater = function(){};

		scope.update = function(fn) {
			if (fn) {
				updater = fn;
			} else {
				update();
			}
		};


		scope.loader = false;

		scope.complete = function(d) {
			scope.count = d.count;
			scope.pages = d.pages;

			if (scope.loader) {
				clearTimeout(scope.loader);
				scope.loader = setTimeout(function() {
					scope.scope.$apply(function() {
						scope.loading = false;
					});
				},100);
			} else {
				scope.loading = false;
			}
		};

		var update = function() {
			timer = undefined;
			scope.loading = true;
			updater();
		};

		if (!App.isPhoneGap) {
			scope.focus('#search');
		}

		scope.watch(params.watch);
		scope.update(params.update);
	}

	return service;
});
