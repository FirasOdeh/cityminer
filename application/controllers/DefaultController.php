<?php


Class DefaultController extends CI_Controller {

    public function __construct() {
        parent::__construct();

        // Load Template
        $this->load->library('template');
        $this->load->library("Aauth");
        $this->load->Model('AdminModel');

    }

    // Show index page
    public function index() {
        if($this->aauth->is_loggedin()){
            $this->template->load('default', 'dashboard', null);

        }else{
            $data = array(
                'not_logged' => '1'
            );
            $this->template->load('default', 'index', $data);
        }
    }

    public function dashboard() {

        $this->template->load('default', 'dashboard', null);
    }

    public function admin() {
        $data['username'] = "toto";
        $data['cities'] = $this->AdminModel->getAllCities();
        $this->template->load('admin', 'admin', $data);
    }



}

?>