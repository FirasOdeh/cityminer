<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:50
 */

Class DataController extends CI_Controller {

    public function __construct() {
        parent::__construct();

        // Load Template
        $this->load->library('template');
        $this->load->library("Aauth");
        $this->load->model('DataModel');

    }

    // Show index page
    public function areas() {
        header('Content-Type: application/json');
        $city = $_GET["city"];
        $response = $this->DataModel->getCityAreas($city);
        echo $response;
    }

    public function execute(){
        header('Content-Type: application/json');
        $city = $_GET["city"];
        $sigma = $_GET["sigma"];
        $delta = $_GET["delta"];
        $algorithm = $_GET["algo"];
        if($algorithm == "express"){
            $time = $_GET["time"];
            $response = $this->DataModel->executeExpress($city, $sigma, $delta, $time);
        } else{

        }
        echo $response;
    }

    public function express() {
        header('Content-Type: application/json');
        $city = $_GET["city"];
        $response = $this->DataModel->algoExpress($city);
        echo $response;


    }
}

?>