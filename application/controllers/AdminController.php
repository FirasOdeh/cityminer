<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:50
 */

Class AdminController extends CI_Controller {
    public $places = null;

    public function __construct() {
        parent::__construct();

        // Load Template
        $this->load->library('template');
        $this->load->library("Aauth");
        $this->load->model('AdminModel');

    }

    public function deleteCity() {
        header('Content-Type: application/json');
        $city_id = $_GET["city_id"];
        $response["result"] = $this->AdminModel->deleteCity($city_id);
        $response["errors"] = Array();
        echo json_encode($response);
    }

    public function import() {
        //header('Content-Type: application/json');
        $city = $_GET["city"];
        $lat = $_GET["lat"];
        $lng = $_GET["lng"];
        $scope = $_GET["scope"];
        $NElat = $lat + (111.7 * $scope);
        $NElng = $lng + (85.26 * $scope);
        $SWlat = $lat - (111.7 * $scope);
        $SWlng = $lng - (85.26 * $scope);
        scanFoursquare($NElat, $NElng, $SWlat, $SWlng);


    }

    public function scanFoursquare($NElat, $NElng, $SWlat, $SWlng){
        $response = $this->DataModel->importCityPlacesGoogle($NElat, $NElng, $SWlat, $SWlng);
        if (count($response < 50 )){
            addResult($response);
        } else {
            scanFoursquare($NElat, $NElng - (($NElng - $SWlng)/2), $SWlat, $SWlng);
            scanFoursquare($NElat, $NElng, $SWlat, $SWlng + (($NElng - $SWlng)/2));
        }

    }

    public function addResult($result){
        var_dump($result);
    }

}

?>