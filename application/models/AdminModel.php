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
        $url = "https://api.foursquare.com/v2/venues/search?&ne=" .$NElat. ",". $NElng. "&sw=".$SWlat.",".$SWlng."&$v&$client_id&$client_secret";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = json_decode(curl_exec($ch));
        return $response->response->venues;
    }
}