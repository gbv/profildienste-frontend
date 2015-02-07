<?php

require 'vendor/autoload.php';

$app = new \Slim\Slim();

$auth = new \Middleware\AuthToken();
$app->add($auth);

$authenticate = function ($app, $auth) {
  return function () use ($app, $auth) {
    if (!$auth->isValid()){
      $app->halt(401);
    }
  };
};

$app -> post('/auth', function() use ($app){
  $user = $app->request()->post('user');
  $pass = $app->request()->post('pass');

  if(is_null($user) || is_null($pass) || trim($user) === '' || trim($pass) === ''){
    printResponse(NULL, true, 'ID und/oder Passwort dürfen nicht leer sein.');
    $app->stop();
  }

  $l = new \Auth\Login();
  $l->doLogin($user,$pass);

  if ($l -> login){
    $pd_name = preg_replace("/<(.*?)>/",'', $l -> name);
    $pd_id = $user;
  }else{
    printResponse(NULL, true, 'Der eingegebene Benutzername und/oder das Kennwort ist ungültig.');
    $app->stop();
  }

  if(!\Auth\LoginChecker::check($user)){
    printResponse(NULL, true, 'Leider sind Sie nicht für den Online Profildienst freigeschaltet.');
    $app->stop();
  }

  $token = array(
    'iss' => 'http://online-profildienst.gbv.de',
    'aud' => 'http://online-profildienst.gbv.de',
    'sub' => $pd_name,
    'pd_id' => $user,
    'iat' => time(),
    'exp' => time() + (24*60*60) // Tokens should be valid for a day
  );

  $jwt = JWT::encode($token, \Config\BackendConfig::$token_key);


  printResponse(array('token' => $jwt));
});

$app -> get('/libraries', function() use ($app){

  $data = array();
  foreach (\Config\BackendConfig::$bibliotheken as $isil => $bib) {
    $data[] = array('isil' => $isil, 'name' => $bib['name']);
  }

  printResponse(array('data' => $data));
});


/**
 * Watchlists
 */
$app -> group('/watchlist', $authenticate($app, $auth), function() use ($app, $auth){

  $app->post('/remove', function () use ($app, $auth){

    $id = $app->request()->post('id');
    $wl = $app->request()->post('wl');

    $m = new \AJAX\RemoveWatchlist($id, $wl, $auth);
    printResponse($m -> getResponse());
  });

  $app->post('/add', function () use ($app, $auth){

    $id = $app->request()->post('id');
    $wl = $app->request()->post('wl');

    $m = new \AJAX\Watchlist($id, $wl, $auth);
    printResponse($m -> getResponse());
  });

  $app->post('/manage', function () use ($app, $auth){

    $id = $app->request()->post('id');
    $type = $app->request()->post('type');
    $content = $app->request()->post('content');

    $m = new \AJAX\WatchlistManager($id, $type, $content, $auth);
    printResponse($m -> getResponse());
  });

});

/**
 * Cart
 */
$app -> group('/cart', $authenticate($app, $auth), function() use ($app, $auth){

  $app->post('/remove', function () use ($app, $auth){

    $id = $app->request()->post('id');

    $m = new \AJAX\RemoveCart($id, $auth);
    printResponse($m -> getResponse());
  });


  $app->post('/add', function () use ($app, $auth){

    $id = $app->request()->post('id');
    $bdg = $app->request()->post('bdg');
    $lft = $app->request()->post('lft');
    $selcode = $app->request()->post('selcode');
    $ssgnr = $app->request()->post('ssgnr');
    $comment = $app->request()->post('comment');

    $m = new \AJAX\Cart($id, $lft, $bdg, $selcode, $ssgnr, $comment, $auth);

    printResponse($m -> getResponse());
  });

});

/**
 * Reject
 */
$app -> group('/reject',  $authenticate($app, $auth), function() use ($app, $auth){

  $app->post('/remove', function () use ($app, $auth){
    $id = $app->request()->post('id');

    $m = new \AJAX\RemoveReject($id, $auth);
    printResponse($m -> getResponse());
  });


  $app->post('/add', function () use ($app, $auth){
    $id = $app->request()->post('id');

    $m = new \AJAX\Reject($id, $auth);
    printResponse($m -> getResponse());
  });

});

/**
 * User related information
 */
$app -> group('/user', $authenticate($app, $auth), function() use ($app, $auth){

  $app -> get('/', function() use ($app, $auth){

    $d = \Profildienst\DB::get(array('_id' => $auth->getID()),'users',array(), true);

    $budgets = array();
    foreach ($d['budgets'] as $budget) {
      $budgets[] = array('key' => $budget['0'], 'value' => $budget['c'], 'default' => ($budget['0'] === $d['defaults']['budget']));
    }

    $data = array(
      'name' => $auth->getName(),
      'def_lft' => $d['defaults']['lieft'],
      'budgets' => $budgets
    );

    printResponse(array('data' => $data));

  });

  $app -> get('/watchlists', function() use ($app, $auth){

    $d = \Profildienst\DB::get(array('_id' => $auth->getID()),'users',array(), true);

    $watchlists=$d['watchlist'];
    $wl_order=\Profildienst\DB::getUserData('wl_order', $auth);

    $wl = array();
    foreach($wl_order as $index){
      $watchlists[$index]['count'] = count($watchlists[$wlo]['list']);
      $wl[] = array('id' => $watchlists[$index]['id'], 'name' => $watchlists[$index]['name'], 'count' => count($watchlists[$index]['list']));
    }

    $data = array(
      'watchlists' => $wl,
      'def_wl' => $d['wl_default']
    );

    printResponse(array('data' => $data));

  });

  $app -> get('/cart', function() use ($app, $auth){
    $d = \Profildienst\DB::get(array('_id' => $auth->getID()),'users',array(), true);

    $data = array(
      'cart' => count($d['cart']),
      'price' => $d['price'],
    );

    printResponse(array('data' => $data));
  });

  $app -> get('/settings', function() use ($app, $auth){
    $data = array(
      'settings' => \Profildienst\DB::getUserData('settings', $auth)
    );

    printResponse(array('data' => $data));
  });

  $app -> get('/orderlist', function() use ($app, $auth){
    try{
      $m = new \Special\Orderlist($auth);

      printResponse(array('data' => array('orderlist' => $m->getOrderlist())));
    }catch(\Exception $e){
      printResponse(NULL, true, $e->getMessage());
    }
    
  });

}); 

/**
 * Settings
 */
$app -> get('/settings',  $authenticate($app, $auth), function() use ($app, $auth){
  $sortby = array();
  foreach (\Config\BackendConfig::$sortby_name as $val => $desc) {
    $sortby[] = array('key' => $val, 'value' => $desc);
  }

  $order = array();
  foreach (\Config\BackendConfig::$order_name as $val => $desc) {
    $order[] = array('key' => $val, 'value' => $desc);
  }

  $data = array(
    'sortby' => $sortby,
    'order' => $order
  );

  printResponse(array('data' => $data));
  
});

/**
 * Delete titles
 */
$app->post('/delete',  $authenticate($app, $auth), function () use ($app, $auth){
  $m = new \AJAX\Delete($auth);
  printResponse($m -> getResponse());
});

/**
 * Order
 */
$app->post('/order',  $authenticate($app, $auth), function () use ($app, $auth){
  $m = new \Special\Order($auth);
  printResponse($m -> getResponse());
});

/**
 * Verlagsmeldung
 */
$app->post('/info',  $authenticate($app, $auth), function () use ($app, $auth){

  $id = $app->request()->post('id');

  $m = new \AJAX\Info($id, $auth);
  printResponse($m -> getResponse());
});

/**
 * OPAC Abfrage
 */
$app->post('/opac',  $authenticate($app, $auth), function () use ($app, $auth){

  $titel = $app->request()->post('titel');
  $verfasser = $app->request()->post('verfasser');

  $query = $titel.' '.$verfasser;

  $isil = \Profildienst\DB::getUserData('isil', $auth);

  $opac_url=\Config\BackendConfig::$bibliotheken[$isil]['opac'];

  $url = preg_replace('/%SEARCH_TERM%/', urlencode($query), $opac_url);
  
  printResponse(array('data' => array('url' => $url)));

});

/**
 * Settings
 */
$app->post('/settings',  $authenticate($app, $auth), function () use ($app, $auth){

  $type = $app->request()->post('type');
  $value = $app->request()->post('value');

  $m = new \AJAX\ChangeSetting($type, $value, $auth);
  printResponse($m -> getResponse());
});


/**
 * Loader
 */
$app -> group('/get',  $authenticate($app, $auth), function () use ($app, $auth){

  $app -> get('/overview/page/:num', function($num = 0) use ($app, $auth){
    $m = new \Content\Main(validateNum($num), $auth);
    printTitles($m -> getTitles(), $m -> getTotalCount());
  });

  $app -> get('/cart/page/:num', function($num = 0) use ($app, $auth){
    $m = new \Content\Cart(validateNum($num), $auth);
    printTitles($m -> getTitles(), $m -> getTotalCount());
  });

  $app -> get('/watchlist/:id/page/:num', function($id = NULL, $num = 0) use ($app, $auth){
    $m = new \Content\Watchlist(validateNum($num), $id, $auth);
    if(is_null($m -> getTotalCount())){
      printResponse(NULL, true, 'Es existiert keine Merkliste mit dieser ID.');
    }else{
      printTitles($m -> getTitles(), $m -> getTotalCount());
    }
  });

  $app -> get('/search/:query/page/:num', function($query, $num = 0) use ($app, $auth){
    try{
      $m = new \Special\Search($query, $num, $auth);
      printTitles($m -> getTitles(), $m -> getTotalCount());
    }catch(\Exception $e){
      printResponse(NULL, true, $e->getMessage());
    }
    
  });


  $app -> get('/pending/page/:num', function($num = 0) use ($app, $auth){
    $m = new \Content\Pending(validateNum($num), $auth);
    printTitles($m -> getTitles(), $m -> getTotalCount());
  });

  $app -> get('/done/page/:num', function($num = 0) use ($app, $auth){
    $m = new \Content\Done(validateNum($num), $auth);
    printTitles($m -> getTitles(), $m -> getTotalCount());
  });

  $app -> get('/rejected/page/:num', function($num = 0) use ($app, $auth){
    $m = new \Content\Rejected(validateNum($num), $auth);
    printTitles($m -> getTitles(), $m -> getTotalCount());
  });
});

$app->notFound(function () use ($app) {
  $app->halt(404);
});

function validateNum($num){
  if ($num != '' && $num > 0 && is_numeric($num)){
    return $num;
  }else{
    return 0;
  }
}

function convertTitle(\Profildienst\Title $t){
  $r = array(
    'id' => $t->getDirectly('_id'),

    'hasCover' => $t->hasCover(),
    'cover_md' => $t->getMediumCover(),
    'cover_lg' => $t->getLargeCover(),

    'titel' => $t -> get('titel'),
    'untertitel' => $t -> get('untertitel'),
    'verfasser' => $t -> get('verfasser'),
    'ersch_termin' => $t -> get('voraus_ersch_termin'),
    'verlag' => $t -> get('verlag'),
    'umfang' => $t->get('umfang'),
    'format' => $t->get('format'),

    'preis' => $t->get('lieferbedingungen_preis'),
    'preis_kom' => $t -> get('kommentar_lieferbedingungen_preis'),

    'mak' => $t -> getMAK(),
    'ilns' => $t -> getILNS(),
    'ppn' => $t -> get('gvkt_ppn'),

    'ersch_jahr' => $t -> get('erscheinungsjahr'),
    'gattung' => $t -> get('gattung'),
    'dnbnum' => $t -> get('dnb_nummer'),
    'wvdnb' => $t -> get('wv_dnb'),
    'sachgruppe' => $t -> get('sachgruppe'),
    'zugeordnet' => $t -> getAssigned(),

    'addInfURL' => $t->get('addr_erg_ang_url'),

    'lft' => $t -> getLft(),
    'budget' => $t -> getBdg(),
    'selcode' => $t -> getSelcode(),
    'ssgnr' => $t -> getSSGNr(),
    'comment' => $t -> getComment(),

    'status' => array(
      'rejected' => $t -> isRejected(),
      'done' => $t -> isDone(),
      'cart' => $t -> isInCart(),
      'selected' => false,
      'watchlist' => array('watched' => $t -> isInWatchlist(), 'id' => $t -> getWlID(), 'name' => $t -> getWlName())
      ) 
    );

  if(!$t->hasCover()){
    $r['cover_md'] = \Config\BackendConfig::$no_cover_path;
  }

  if($t->get('isbn13') !== NULL){
    $isbn=$t->get('isbn13');
  }else{
    $isbn=$t->get('isbn10');
  }
  $r['isbn'] = $isbn;

  return $r;
}

function printTitles($titles, $total){
  $titles_out = array();
  if(!is_null($titles)){
    foreach($titles->getTitles() as $t){
      $titles_out[] = convertTitle($t);
    }
  }

  printResponse(array('more' => ($titles !== NULL), 'total' => $total,'data' => $titles_out));
}

function printResponse($resp, $error = false, $message = ''){
  global $app;

  if(!isset($resp['success'])){
    if($error){
      $resp = array('success' => false, 'message' => $message);
    }else{
      $resp['success'] = true;
    }
  }

  $app->response->headers->set('Content-Type', 'application/javascript');
  $callback = $app->request()->get('callback');

  if(!is_null($callback) && trim($callback) !== ''){
    echo $callback.'('.json_encode($resp).');';
  }else{
    echo json_encode($resp);
  }
}

$app->run(); 

?>