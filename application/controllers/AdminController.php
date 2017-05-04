<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:50
 */

Class AdminController extends CI_Controller {
    public $places = Array();
    public $categories = Array();
    public $line = Array();
    public $NElat;
    public $NElng;
    public $SWlat;
    public $SWlng;
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

        $source = $_POST["source"];
        $city = $_POST["city"];
        $label = $_POST["label"];
        $response["success"] = true;
        if($source == "foursquare"){
            $level = $_POST["level"];
            $NElat = $_POST["ne_lat"];
            $NElng = $_POST["ne_lng"];
            $SWlat = $_POST["sw_lat"];
            $SWlng = $_POST["sw_lng"];
            $this->scanFoursquare($NElat, $NElng, $SWlat, $SWlng);
            $this->places = $this->AdminModel->foursquareCategoriesProjection($this->places, $level);
            $this->AdminModel->saveCSV($this->places, $label);
        } else if( $source == "google"){

            $this->NElat = $_POST["ne_lat"];
            $this->NElng = $_POST["ne_lng"];
            $this->SWlat = $_POST["sw_lat"];
            $this->SWlng = $_POST["sw_lng"];
            $this->scanGoogle($this->NElat, $this->NElng, $this->SWlat, $this->SWlng);
            $this->AdminModel->saveCSV($this->places, $label);

        } else if($source == "csv"){
            if(move_uploaded_file($_FILES[0]['tmp_name'], 'data/algorithms/graphMaker/' . $label . '.csv'))
            {
                $response["success"] = true;
            }
            else
            {
                $response["success"] = false;
            }
        }
        $this->AdminModel->buildGraph($label);
        $this->AdminModel->addCity($city, $label, count($this->places));

        $response["response"] = count($this->places);
        echo json_encode($response);

    }

    public function scanFoursquare($NElat, $NElng, $SWlat, $SWlng){
        $response = $this->AdminModel->importCityPlacesFoursquare($NElat, $NElng, $SWlat, $SWlng);
        if (count($response) < 30 ){
            $this->addResultFoursquare($response);
        } else {
            $this->scanFoursquare($NElat, $SWlng + (($NElng - $SWlng)/2), $SWlat+(($NElat - $SWlat)/2), $SWlng);
            $this->scanFoursquare($NElat, $NElng, $SWlat+(($NElat - $SWlat)/2), $SWlng + (($NElng - $SWlng)/2));
            $this->scanFoursquare($SWlat+(($NElat - $SWlat)/2), $SWlng + (($NElng - $SWlng)/2), $SWlat, $SWlng);
            $this->scanFoursquare($SWlat+(($NElat - $SWlat)/2), $NElng, $SWlat, $SWlng + (($NElng - $SWlng)/2));
        }
    }
    public function scanGoogle($NElat, $NElng, $SWlat, $SWlng){
        $centerLat = ($NElat + $SWlat)/2 ;
        $centerLng = ($NElng + $SWlng)/2 ;

        $theta = $NElng - $SWlng;
        $dist = sin(deg2rad($NElat)) * sin(deg2rad($SWlat)) +  cos(deg2rad($NElat)) * cos(deg2rad($SWlat)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $radius = ($miles * 1609.344)/2;

        $response = $this->AdminModel->importCityPlacesGoogle($centerLat, $centerLng, $radius);
        if (count($response) < 20 ){
            $this->addResultGoogle($response);
        } else {
            $this->scanGoogle($NElat, $SWlng + (($NElng - $SWlng)/2), $SWlat+(($NElat - $SWlat)/2), $SWlng);
            $this->scanGoogle($NElat, $NElng, $SWlat+(($NElat - $SWlat)/2), $SWlng + (($NElng - $SWlng)/2));
            $this->scanGoogle($SWlat+(($NElat - $SWlat)/2), $SWlng + (($NElng - $SWlng)/2), $SWlat, $SWlng);
            $this->scanGoogle($SWlat+(($NElat - $SWlat)/2), $NElng, $SWlat, $SWlng + (($NElng - $SWlng)/2));
        }
    }

    public function addResultGoogle($result){
        foreach ($result as $glPlace){
            if(isset($glPlace->types[0])){
                $place = null;
                $place[] = $glPlace->place_id;
                $place[] = $glPlace->geometry->location->lat;
                $place[] = $glPlace->geometry->location->lng;
                $place[] = $glPlace->types[0];
                $this->places[$glPlace->place_id] = $place;
            }
        }
    }
    public function addResultFoursquare($result){
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