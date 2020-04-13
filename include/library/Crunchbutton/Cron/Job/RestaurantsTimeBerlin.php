<?php

class Crunchbutton_Cron_Job_RestaurantsTimeBerlin extends Crunchbutton_Cron_Log {

	public function run(){

		Crunchbutton_Restaurant_Time::store( 'Europe/Berlin' );

		$this->finished();
	}
}
