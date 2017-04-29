<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:50
 */

Class AdminController extends CI_Controller {
    public $places = null;
    public $categories = Array();
    public $line = Array();
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
        $label = $_GET["label"];
        $response["result"] = $this->AdminModel->deleteCity($city_id, $label);
        $response["errors"] = Array();
        echo json_encode($response);
    }

    public function import() {
        header('Content-Type: application/json');
        $city = urldecode($_GET["city"]);
        $label = $_GET["label"];
        $level = $_GET["level"];
        $NElat = $_GET["ne_lat"];
        $NElng = $_GET["ne_lng"];
        $SWlat = $_GET["sw_lat"];
        $SWlng = $_GET["sw_lng"];
        $this->scanFoursquare($NElat, $NElng, $SWlat, $SWlng);
        $this->places = $this->AdminModel->foursquareCategoriesProjection($this->places, $level);
        $this->AdminModel->saveCSV($this->places, $label);
        $this->AdminModel->buildGraph($label);
        $this->AdminModel->addCity($city, $label, count($this->places));

        $response["success"] = true;
        $response["response"] = count($this->places);
        echo json_encode($response);

    }

    public function scanFoursquare($NElat, $NElng, $SWlat, $SWlng){
        $response = $this->AdminModel->importCityPlacesFoursquare($NElat, $NElng, $SWlat, $SWlng);
        $this->addResult($response);
        if (count($response) < 30 ){
            $this->addResult($response);
        } else {
            $this->scanFoursquare($NElat, $NElng - (($NElng - $SWlng)/2), $SWlat, $SWlng);
            $this->scanFoursquare($NElat, $NElng, $SWlat, $SWlng + (($NElng - $SWlng)/2));
        }
    }

    public function addResult($result){
        foreach ($result as $fsPlace){
            if(isset($fsPlace->categories[0])){
                $place = null;
                $place[] = $fsPlace->id;
                $place[] = $fsPlace->location->lat;
                $place[] = $fsPlace->location->lng;
                $place[] = $fsPlace->categories[0]->name;
                $this->places[$fsPlace->id] = $place;
            }
        }
    }
}

?>