<?php

namespace Middleware;

class AuthToken extends \Slim\Middleware{

  private $valid = false;
  private $name = NULL;
  private $id = NULL;

  public function call(){

    $app = $this->app;

    if($app->request->headers->get('Authorization')){

      $tok = explode(' ', $app->request->headers->get('Authorization'));

      if(count($tok) === 2 && $tok[0] === 'Bearer'){
        try{
          
          $decoded = \JWT::decode($tok[1], \Config\Config::$token_key);
          $token = (array) $decoded;
          $this->valid = true;
          $this->name = $token['sub'];
          $this->id = $token['pd_id'];

        }catch(\Exception $e){
          $this->valid = false;
        }
      }
    }

    $this->next->call();
  }

  public function getName(){
    return $this->name;
  }

  public function getID(){
    return $this->id;
  }

  public function isValid(){
    return $this->valid;
  }
}

?>