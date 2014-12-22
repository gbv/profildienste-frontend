<?php

require 'vendor/autoload.php';

$app = new \Slim\Slim(array(
  'view' => new \Slim\Extras\Views\Rain(\Config\Config::$rain_config)
  ));

$app->add(new \Slim\Middleware\SessionCookie(array('secret' => 'ProfildienstGBV')));

$authenticate = function ($app) {
  return function () use ($app) {
    if (!isset($_SESSION['id'])) {
      $app->redirect('/');
    }
  };
};

$app->response->headers->set('Content-Type', 'application/javascript');

$app->group('/ajax', $authenticate($app) ,function () use ($app) {

  $app->get('/user', function () use ($app){
  
    $data=\Profildienst\DB::get(array('_id' => $_SESSION['id']),'users',array('cart' => 1, 'watchlist' => 1, 'price' => 1, '_id' => 0), true);

    $cart=sizeof($data['cart']);
    $watchlists=$data['watchlist'];
    $wl_order=\Profildienst\DB::getUserData('wl_order');

    $wl = array();
    foreach($wl_order as $index){
      $watchlists[$index]['count'] = count($watchlists[$wlo]['list']);
      $wl[] = array('id' => $watchlists[$index]['id'], 'name' => $watchlists[$index]['name'], 'count' => count($watchlists[$index]['list']));
    }

    $price=$data['price']['price'];
    $known=$data['price']['known'];
    $est=$data['price']['est'];

    $price = number_format($price, 2, '.', '');

    $data = array(
      'name' => $_SESSION['name'],
      'cart' => count($data['cart']),
      'watchlists' => $wl
    );

    printResponse(array('data' => $data));
  });

  $app->post('/confirm', function () use ($app){
    $m = new \AJAX\ConfirmOrder();
    printResponse($m -> getResponse());
  });

  $app->post('/delete', function () use ($app){
    $m = new \AJAX\Delete();
    printResponse($m -> getResponse());
  });

  $app->post('/watchlist-manage', function () use ($app){

    $id = $app->request()->post('id');
    $type = $app->request()->post('type');
    $content = $app->request()->post('content');

    $m = new \AJAX\WatchlistManager($id, $type, $content);
    printResponse($m -> getResponse());
  });

  $app->post('/watchlist-rm', function () use ($app){

    $id = $app->request()->post('id');
    $rm = $app->request()->post('rm');
    $wl = $app->request()->post('wl');

    $m = new \AJAX\RemoveWatchlist($id, $rm, $wl);
    printResponse($m -> getResponse());
  });

  $app->post('/watchlist', function () use ($app){

    $id = $app->request()->post('id');
    $rm = $app->request()->post('rm');
    $wl = $app->request()->post('wl');

    $m = new \AJAX\Watchlist($id, $rm, $wl);
    printResponse($m -> getResponse());
  });

  $app->post('/reject', function () use ($app){

    $id = $app->request()->post('id');

    $m = new \AJAX\Reject($id);
    printResponse($m -> getResponse());
  });


  $app->post('/reject-rm', function () use ($app){

    $id = $app->request()->post('id');

    $m = new \AJAX\RemoveReject($id);
    printResponse($m -> getResponse());
  });

  $app->post('/info', function () use ($app){

    $id = $app->request()->post('id');

    $m = new \AJAX\Info($id);
    printResponse($m -> getResponse());
  });

  $app->post('/change-setting', function () use ($app){

    $type = $app->request()->post('type');
    $value = $app->request()->post('value');

    $m = new \AJAX\ChangeSetting($type, $value);
    printResponse($m -> getResponse());
  });


  $app->post('/cart-rm', function () use ($app){

    $id = $app->request()->post('id');
    $rm = $app->request()->post('rm');

    $m = new \AJAX\RemoveCart($id, $rm);
    printResponse($m -> getResponse());
  });


  $app->post('/cart', function () use ($app){

    $id = $app->request()->post('id');
    $rm = $app->request()->post('rm');
    $bdg = $app->request()->post('bdg');
    $lft = $app->request()->post('lft');
    $selcode = $app->request()->post('selcode');
    $ssgnr = $app->request()->post('ssgnr');
    $comment = $app->request()->post('comment');

    $m = new \AJAX\Cart($id, $rm, $lft, $bdg, $selcode, $ssgnr, $comment);

    printResponse($m -> getResponse());
  });
});

$app -> group('/pageloader', $authenticate($app) , function () use ($app){

  $app -> get('/overview/page/:num', function($num = 0) use ($app){
    $m = new \Content\Main(validateNum($num));
    printTitles($m -> getTitles());
  });

  $app -> get('/cart/page/:num', function($num = 0) use ($app){
    $m = new \Content\Cart(validateNum($num));
    printTitles($m -> getTitles());
  });

  $app -> get('/watchlist/:id/page/:num', function($id = NULL, $num = 0) use ($app){
    $m = new \Content\Watchlist(validateNum($num), $id);
    printTitles($m -> getTitles());
  });

  $app -> get('/search/:query/page/:num', function($query, $num = 0) use ($app){
    $m = new \Special\Search($query, $num);
    printTitles($m -> getTitles());
  });


  $app -> get('/pending/page/:num', function($num = 0) use ($app){
    $m = new \Content\Pending(validateNum($num));
    printTitles($m -> getTitles());
  });

  $app -> get('/done/page/:num', function($num = 0) use ($app){
    $m = new \Content\Done(validateNum($num));
    printTitles($m -> getTitles());
  });

  $app -> get('/rejected/page/:num', function($num = 0) use ($app){
    $m = new \Content\Rejected(validateNum($num));
    printTitles($m -> getTitles());
  });
});

$app->notFound(function () use ($app) {
  $view = $app -> view();
  $app->view()->setData('version', 'Error');
  $content = $view -> render('error');

  $view -> setData(array('content' => $content));

  if(isset($_SESSION['id'])){
    echo $view ->render('main/pd');
  }else{
    echo $view ->render('main/default');
  }
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


    'status' => array(
      'rejected' => $t -> isRejected(),
      'done' => $t -> isRejected(),
      'selected' => false
      ) 
    );

  if(!$t->hasCover()){
    $r['cover_md'] = \Config\Config::$no_cover_path;
  }

  if($t->get('isbn13') !== NULL){
    $isbn=$t->get('isbn13');
  }else{
    $isbn=$t->get('isbn10');
  }
  $r['isbn'] = $isbn;

  return $r;
}

function printTitles($titles){
  $titles_out = array();
  if(!is_null($titles)){
    foreach($titles->getTitles() as $t){
      $titles_out[] = convertTitle($t);
    }
  }

  printResponse(array('more' => ($titles !== NULL), 'data' => $titles_out));
}

function printResponse($resp){
  global $app;

  $callback = $app->request()->get('callback');

  if(!is_null($callback) && trim($callback) !== ''){
    echo $callback.'('.json_encode($resp).');';
  }else{
    echo json_encode($resp);
  }
}

$app->run(); 

?>