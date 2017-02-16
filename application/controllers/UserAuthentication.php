<?php

//session_start(); //we need to start session in order to access it through CI

Class UserAuthentication extends CI_Controller {

    public function __construct() {
        parent::__construct();

        // Load form helper library
        $this->load->helper('form');

        // Load form validation library
        $this->load->library('form_validation');

        // Load session library
        $this->load->library('session');

        // Load Template
        $this->load->library('template');

        $this->load->library("Aauth");

    }


    // Validate and store registration data in database
    public function register() {
        // Check validation for user input in SignUp form
        $this->form_validation->set_rules('username', 'Username', 'trim|required|xss_clean');
        $this->form_validation->set_rules('email_value', 'Email', 'trim|required|xss_clean');
        $this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean');
        if ($this->form_validation->run() == FALSE) {
            if($this->aauth->is_loggedin()){
                //redirect(base_url().'defaultcontroller/dashboard', 'refresh');
                redirect(base_url(), 'refresh');
            }else{
                $data['not_logged'] = '1';
                $this->template->load('default', 'register', $data);
            }
        } else {
            $result = $this->aauth->create_user($this->input->post('email_value'),$this->input->post('password'),$this->input->post('username'));
            if ($result == TRUE) {
                $this->aauth->login_fast($result);
                $data['message_display'] = 'Registration Successfully !';
                //$this->template->load('default', 'login', $data);
                redirect(base_url(), 'refresh');
            } else {
                $data['message_display'] = 'Username already exist!';
                $this->template->load('default', 'register', $data);
            }
        }
    }

    // Check for user login process
    public function login() {

        $this->form_validation->set_rules('username', 'Username', 'trim|required|xss_clean');
        $this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean');

        if ($this->form_validation->run() == FALSE) {
            if($this->aauth->is_loggedin()){
                redirect(base_url(), 'refresh');
            }else{
                $data['not_logged'] = '1';
                $this->template->load('default', 'login', $data);
            }
        } else {
//			$data = array(
//			'username' => $this->input->post('username'),
//			'password' => $this->input->post('password')
//			);
            //$result = $this->login_database->login($data);
            $result = $this->aauth->login($this->input->post('username'), $this->input->post('password'), $this->input->post('remember'));
            if ($result == TRUE) {
                if(isset($this->session->get_userdata()['last_page'])&&$this->session->get_userdata()['last_page']){
                    redirect(base_url().$this->session->get_userdata()['last_page'], 'refresh');
                }else{
                    redirect(base_url(), 'refresh');
                }
                //$username = $this->input->post('username');
                //$result = $this->login_database->read_user_information($username);
            } else {
                $data = array(
                    'error_message' => 'Invalid Username or Password',
                    'not_logged' => '1'
                );
                $this->template->load('default', 'login', $data);
            }
        }
    }

    // Logout from admin page
    public function logout() {
        $data = array(
            'message_displayusername' => 'Successfully Logout',
            'not_logged' => '1'
        );
        $this->aauth->logout();
        $this->template->load('default', 'login', $data);
    }

}

?>