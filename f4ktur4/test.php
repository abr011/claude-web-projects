<?php
//echo "ahoj";

class invoice {
	
	public $number;

	public function __construct($i){
		$this->number=$i;
	}
	public function print (){

		echo "faktura ".$this->number;
	}
}

$my_invoice = new invoice(23);
//$my_invoice->number=12;
$my_invoice->print();