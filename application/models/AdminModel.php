<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:48
 */
class AdminModel extends CI_Model {
    public $categories = Array();
    function getAllCities(){
        $this->load->database();
        $query = $this->db->query('SELECT * FROM cities');
        return $query->result();
    }

    function deleteCity($id, $label){

        $this->load->database();
        $query = $this->db->query('delete from cities where id='.$id);
        $this->deleteDirectory("data/cities/" . $label);
        return true;
    }


    public function importCityPlacesFoursquare($NElat, $NElng, $SWlat, $SWlng)
    {
        $v = "v=20161016";
        $client_id = "client_id=E03NT2KLEKZACDFNQBSI435V2WMKW3OXAYA2U4DYDBWSWOIB";
        $client_secret = "client_secret=RZJ2FNKEMC4BF5BSBQZCLY4OL1MGIDR1U4XOONRCZCQX022W";
        $url = "https://api.foursquare.com/v2/venues/search?intent=browse&ne=" .$NElat. ",". $NElng. "&sw=".$SWlat.",".$SWlng."&$v&$client_id&$client_secret";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = json_decode(curl_exec($ch));
        return $response->response->venues;
    }


    public function importCityPlacesGoogle($lat, $lng, $radius)
    {
        $key = "key=AIzaSyBE6ia5uKlMLjvUfh7hZwtAODnw_wreQ_M";
        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$lat,$lng&radius=$radius&$key";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = json_decode(curl_exec($ch));
        return $response->results;
    }

    public function saveCSV($places, $label){
        $fp = fopen('data/algorithms/graphMaker/' . $label . '.csv', 'w');
        fputs($fp, "placeId,latitude,longitude,category\n");
        foreach($places as $place){
            fputs($fp, implode($place, ',')."\n");
        }
        fclose($fp);
    }

    public function buildGraph($label){
        chdir("data/algorithms/graphMaker/");
        exec("java -jar graphMaker.jar 400 " . $label . ".csv", $k , $j );
        unlink("$label.csv");
        $oldmask = umask(0);
        if (!file_exists('../../cities/'.$label)) {
            mkdir('../../cities/'.$label, 0777, true);
        }
        umask($oldmask);
        copy("FoursquareGraph.json", '../../cities/'.$label.'/'.'FoursquareGraph.json');
        copy("FoursquareVerticesCoordinates.json", '../../cities/'.$label.'/'.'FoursquareVerticesCoordinates.json');
        unlink("FoursquareGraph.json");
        unlink("FoursquareVerticesCoordinates.json");
        unlink("metaData.txt");

    }

    public function addCity($city, $label, $nbPlaces){
        $this->load->database();
        $query = $this->db->query("insert into cities values(null, '$city', '$label', $nbPlaces)");
    }

    public function getFoursquarecategories(){
        $v = "v=20161016";
        $client_id = "client_id=E03NT2KLEKZACDFNQBSI435V2WMKW3OXAYA2U4DYDBWSWOIB";
        $client_secret = "client_secret=RZJ2FNKEMC4BF5BSBQZCLY4OL1MGIDR1U4XOONRCZCQX022W";
        $url = "https://api.foursquare.com/v2/venues/categories?$v&$client_id&$client_secret";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = json_decode(curl_exec($ch));
        $d = Array();
        $this->buildCategories(0, $response->response, $d);
    }
    public function buildCategories($level, $cat, $data)
    {
        $d = $data;
        $d[$level] = "";
        if(property_exists($cat, "name")){
            $d[$level] = $cat->name;
        }
        if ($level > 1) {
            $this->categories[$cat->name] = $d;
        }
        foreach ($cat->categories as $c) {
            $this->buildCategories($level + 1, $c, $d);
        }
    }

    public function foursquareCategoriesProjection($places, $level)
    {
        $this->getFoursquarecategories();
        foreach($places as &$place){
            if(array_key_exists($place[3], $this->categories)){
                $place[3] = $this->categories[$place[3]][$level];
            } else{
                unset($place);
            }

        }
        return $places;
    }

    function deleteDirectory($dir) {
        if (!file_exists($dir)) {
            return true;
        }

        if (!is_dir($dir)) {
            return unlink($dir);
        }

        foreach (scandir($dir) as $item) {
            if (!($item == '.' || $item == '..')) {
                unlink($dir . '/' . $item);
            }
        }
        return rmdir($dir);
    }
}