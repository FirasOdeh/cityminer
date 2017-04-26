<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:48
 */
class AdminModel extends CI_Model {

    function getAllCities(){
        $this->load->database();
        $query = $this->db->query('SELECT * FROM cities');
        return $query->result();
    }

    function deleteCity($id){

        $this->load->database();
        $query = $this->db->query('delete from cities where id='.$id);
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

    public function saveCSV($places, $label){
        $fp = fopen('data/algorithms/graphMaker/' . $label . '.csv', 'w');
        foreach($places as $place){
            fputcsv($fp, $place);
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
}