<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:48
 */
class DataModel extends CI_Model {

    public function getCityAreas($city)
    {
        $response = file_get_contents('./data/'.$city.'VerticesCoordinates.json');
        return $response;
    }


}