<?php

/**
 * Created by PhpStorm.
 * User: zekri
 * Date: 17/02/17
 * Time: 01:50
 */

Class AdminController extends CI_Controller {

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
}

?>