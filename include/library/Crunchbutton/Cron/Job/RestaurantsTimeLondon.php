<?php

class Crunchbutton_Cron_Job_RestaurantsTimeLondon extends Crunchbutton_Cron_Log {

	public function run(){

		Crunchbutton_Restaurant_Time::store( 'Europe/London' );

		$this->finished();
	}
}
