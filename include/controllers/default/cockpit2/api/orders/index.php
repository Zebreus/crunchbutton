<?php

class Controller_api_orders extends Crunchbutton_Controller_RestAccount {

	public function init() {
		if ($this->method() != 'get') {
			exit;
		}

		// manual query is faster than using the Order->exports

		// @todo: merge this with Order::find when we get rid of old cockpit/orders

		$limit = $this->request()['limit'] ? c::db()->escape($this->request()['limit']) : 20;
		$search = $this->request()['search'] ? c::db()->escape($this->request()['search']) : '';
		$page = $this->request()['page'] ? c::db()->escape($this->request()['page']) : 1;
		$user = $this->request()['user'] ? c::db()->escape($this->request()['user']) : null;
		$phone = $this->request()['phone'] ? c::db()->escape($this->request()['phone']) : null;
		$restaurant = $this->request()['restaurant'] ? c::db()->escape($this->request()['restaurant']) : null;
		$community = $this->request()['community'] ? c::db()->escape($this->request()['community']) : null;

		if ($page == 1) {
			$offset = '0';
		} else {
			$offset = ($page-1) * $limit;
		}


		/*
		$q = '
			SELECT
				`order`.*,
				restaurant.name as _restaurant_name,
				restaurant.community as _community_name,
				admin.name as _driver_name,
				admin.id_admin as _driver_id
			FROM `order`
			LEFT JOIN order_action ON order_action.id_order=`order`.id_order
			LEFT JOIN restaurant ON restaurant.id_restaurant=`order`.id_restaurant
			LEFT JOIN admin ON admin.id_admin=order_action.id_admin
			WHERE order_action.type != "delivery-rejected"
		';
		*/

		$q = '
			SELECT
				-WILD-
			FROM `order`
			LEFT JOIN order_action ON order_action.id_order=`order`.id_order
			LEFT JOIN restaurant ON restaurant.id_restaurant=`order`.id_restaurant
			LEFT JOIN admin ON admin.id_admin=order_action.id_admin
			LEFT JOIN restaurant_community ON restaurant_community.id_restaurant=restaurant.id_restaurant
			LEFT JOIN community ON community.id_community=restaurant_community.id_community
			LEFT JOIN ( SELECT MAX( id_support ) AS id_support, id_order FROM support WHERE id_order IS NOT NULL GROUP BY id_order ) support ON support.id_order = `order`.id_order
			WHERE `order`.id_restaurant IS NOT NULL
		';

		if (!c::admin()->permission()->check(['global', 'orders-all', 'orders-list-page'])) {
			// Order::deliveryOrders( $lastHours );
			$q .= '
				AND order_admin.id_admin = "'.c::admin()->id_admin.'"
			';
		}

		if ($user) {
			$q .= '
				AND `order`.id_user="'.$user.'"
			';
		}

		if ($phone) {
			$q .= '
				AND `order`.phone="'.$phone.'"
			';
		}

		if ($community) {
			$q .= '
				AND community.id_community="'.$community.'"
			';
		}

		if ($restaurant) {
			$q .= '
				AND restaurant.id_restaurant="'.$restaurant.'"
			';
		}

		if ($search) {

			// Keys
			switch ( true ) {

				// Keys
				case ( strpos( $search, 'phone:' ) !== false ):
					$phone = str_replace( 'phone:' , '', $search );
					$phone = str_replace( '-' , '', $phone );
					$q .= 'AND order.phone = "' . $phone . '"';
					break;

				case ( strpos( $search, 'customer:' ) !== false ):
					$id_user = str_replace( 'customer:' , '', $search );
					$q .= 'AND order.id_user = "' . $id_user . '"';
					break;

				default:
					$q .= Crunchbutton_Query::search([
						'search' => stripslashes($search),
						'fields' => [
							'restaurant.name' => 'like',
							'admin.name' => 'like',
							'order.phone' => 'like',
							'order.name' => 'like',
							'order.address' => 'like',
							'order.notes' => 'like',
							'order.id_order' => 'liker'
						]
					]);
					break;
			}
		}

		$q .= '
			GROUP BY `order`.id_order
		';

		// get the count
		$count = 0;
		$r = c::db()->query(str_replace('-WILD-','COUNT(*) c', $q));
		while ($c = $r->fetch()) {
			$count++;
		}

		$q .= '
			ORDER BY `order`.id_order DESC
			LIMIT '.$offset.', '.$limit.'
		';

		// do the query
		$data = [];
		$r = c::db()->query(str_replace('-WILD-','
			`order`.*,
			support.id_support,
			restaurant.name as _restaurant_name,
			restaurant.permalink as _restaurant_permalink,
			community.name as _community_name,
			community.permalink as _community_permalink,
			community.id_community as _community_id,
			admin.name as _driver_name,
			admin.id_admin as _driver_id
		', $q));

		while ($o = $r->fetch()) {
			$o->status = Order::o( $o->id_order )->status()->last();
			$data[] = $o;
		}

		echo json_encode([
			'count' => intval($count),
			'pages' => ceil($count / $limit),
			'page' => $page,
			'results' => $data
		]);

	}
}