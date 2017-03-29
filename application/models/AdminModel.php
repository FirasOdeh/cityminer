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
}