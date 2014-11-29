<?php

require 'vendor/autoload.php';

define('VERSION', '0.4.3');
define('MAINTENANCE', false);

/**
 * Prüfen, ob eine Konfigurationsdatei vorhanden ist
 */
if(!class_exists('\Config\Config')){
	echo 'Diese Instanz wurde noch nicht konfiguriert und kann noch nicht verwendet werden.';
	exit(0);
}

$app = new \Slim\Slim(array(
	'view' => new \Slim\Extras\Views\Rain(\Config\Config::$rain_config)
	));

$app->add(new \Slim\Middleware\SessionCookie(array('secret' => 'ProfildienstGBV')));


/**
 * Überprüfen ob der Benutzer angemeldet ist
 */

$authenticate = function ($app) {
	return function () use ($app) {
		if (!isset($_SESSION['id'])) {
			$_SESSION['urlRedirect'] = $app->request()->getPathInfo();
			$app->flash('error', 'Bitte melden Sie sich an um fortzufahren.');
			$app->redirect('/');
		}
	};
};


/**
 * Wird aufgerufen, bevor eine Seite ausgeliefert wird
 */

$app->hook('slim.before.dispatch', function() use ($app) {

	if(MAINTENANCE){
		$app->view()->setData('version', VERSION);
		echo $app -> view() ->render('maintenance');
		$app -> stop();
	}

	$user = null;
	if (isset($_SESSION['user'])) {
		$user = $_SESSION['user'];
	}

	$name = null;
	if (isset($_SESSION['name'])) {
		$name = $_SESSION['name'];
	}

	$app->view()->setData('user', $user);
	$app->view()->setData('name', $name);
	$app->view()->setData('version', VERSION);

	$flash = $app->view()->getData('flash');
	$error = '';
	if (isset($flash['error'])) {
		$error = $flash['error'];
	}

	$app->view()->setData('error', $error);
});

/**
 * Verarbeiten der Login-Informationen
 */

$app->post('/login', function () use ($app) {
	$user = $app->request()->post('user');
	$pwd = $app->request()->post('pwd');
	$isil = $app->request()->post('isil');

	$err = false;
	if($user == '' || $pwd == ''){
		$app->flash('error', 'ID und/oder Passwort dürfen nicht leer sein.');
		$err = true;
	}

	if($err){
		$app->redirect('/login/'.$isil);
	}

	$l = new \Auth\Login();
	$l -> doLogin($user,$pwd);

	if ($l -> login){
		$_SESSION['name']=preg_replace("/<(.*?)>/",'', $l -> name);
		$_SESSION['id']=$user;
	}else{
		$app->flash('error', 'Der eingegebene Benutzername und/oder das Kennwort ist ungültig.');
		$app->redirect('/login/'.$isil);
	}

	if(!\Auth\LoginChecker::check($user)){
		$_SESSION = array();
		$app->flash('error', 'Leider sind Sie nicht für den Online Profildienst freigeschaltet.');
		$app->redirect('/login/'.$isil);
	}

	if (isset($_SESSION['urlRedirect'])) {
		echo "ja";
		$tmp = $_SESSION['urlRedirect'];
		unset($_SESSION['urlRedirect']);
		$app->redirect($tmp);
	}

	$app->redirect('/');
});

/**
 * Hauptseite, d.h. entweder die Gesamtübersicht falls der Benutzer eingeloggt ist
 * oder ansonsten die Übersicht über die Bibliotheken
 */
$app->get('/', function () use ($app){

	if(isset($_SESSION['id'])){
		$app->redirect('/show');
	}

	$view = $app->view(); 

	$view->setData(array('bib' => \Config\Config::$bibliotheken));
	$content = $view->render('view/intro');

	$view->setData(array('content' => $content));
	echo $view->render('main/default');
});

/**
 * Login-Seite für die entsprechend übergebene ISIL
 */

$app->get('/login/:isil', function ($isil) use ($app) {

	$urlRedirect = '/';

	if ($app->request()->get('r') && $app->request()->get('r') != '/logout' && $app->request()->get('r') != '/login') {
		$_SESSION['urlRedirect'] = $app->request()->get('r');
	}

	if (isset($_SESSION['urlRedirect'])) {
		$urlRedirect = $_SESSION['urlRedirect'];
	}

	if(!isset(\Config\Config::$bibliotheken[$isil])){
		$app->notFound();
	}

	$view = $app->view(); 

	$view->setData(array('name' => \Config\Config::$bibliotheken[$isil]['name'], 'isil' => $isil));
	$content = $view->render('view/login');

	$view->setData(array('content' => $content));
	echo $view->render('main/default');
});

/**
 * Abmelden
 */

$app->get('/logout', $authenticate($app) ,function () use ($app) {
	$_SESSION = array();
	$app->view()->setData('user', null);

	$view = $app->view(); 
	$content = $view->render('view/logout');

	$view->setData(array('content' => $content));
	echo $view->render('main/default');
});

/*
	PROFILDIENST FUNKTIONEN
*/

$app->group('/show', $authenticate($app) ,function () use ($app) { 

	$app->get('/rejected(/page/:num)', function($num = 0) use ($app){

		$m = new \Content\Rejected(validateNum($num));

		$view = $app->view(); 

		$view->setData(array(
			'title' => 'Abgelehnt',
			'count' =>  $m -> getCount(),
			'icon' => 'fa-minus-circle',
			'list' => $m -> getOutput() -> output(),
			'btn_id' => 'btn-del-all',
			'btn_icon' => 'fa-trash-o',
			'btn_title' => 'Aus meiner Ansicht löschen'
			));

		$content = $view->render('view/actlist');

		$view->setData(array('content' => $content));
		$view->setData(mainData());
		echo $view->render('main/pd');
	});

	$app->get('/order', function() use ($app){

		$m = new \Special\Order();

		$view = $app->view(); 

		$view->setData(array(
			'title' => 'Ihre Bestellung',
			'count' =>  $m -> getCount(),
			'icon' => 'fa-flag',
			));

		$view->setData($m -> getViewData());

		$content = $view->render('view/order');

		$view->setData(array('content' => $content));
		$view->setData(mainData());
		echo $view->render('main/pd');
	});

	$app->get('/pending', function() use ($app){

		$m = new \Content\Pending(0);

		$view = $app->view(); 

		$view->setData(array(
			'title' => 'In Bearbeitung',
			'count' =>  $m -> getCount(),
			'icon' => 'fa-tasks',
			'list' => $m -> getOutput() -> output()
			));

		$content = $view->render('view/list');

		$view->setData(array('content' => $content));
		$view->setData(mainData());
		echo $view->render('main/pd');
	});

	$app->get('/done', function() use ($app){

		$m = new \Content\Done(0);

		$view = $app->view(); 

		$view->setData(array(
			'title' => 'Bearbeitet',
			'count' =>  $m -> getCount(),
			'icon' => 'fa-check',
			'list' => $m -> getOutput() -> output()
			));

		$content = $view->render('view/list');

		$view->setData(array('content' => $content));
		$view->setData(mainData());
		echo $view->render('main/pd');
	});


	$app->get('/cart', function() use ($app){

		$m = new \Content\Cart(0);

		$view = $app->view(); 

		$view->setData(array(
			'title' => 'Warenkorb',
			'count' =>  $m -> getCount(),
			'icon' => 'fa-shopping-cart',
			'list' => $m -> getOutput() -> output(),
			'btn_id' => 'btn-cont',
			'btn_icon' => 'fa-chevron-circle-right',
			'btn_title' => 'Fortfahren'
			));
		
		$content = $view->render('view/actlist');

		$view->setData(array('content' => $content));
		$view->setData(mainData());
		echo $view->render('main/pd');
	});

	$app->get('/', function() use ($app){

		$m = new \Content\Main(0);

		$view = $app->view(); 

		$view->setData(array(
			'title' => 'Gesamtübersicht Neuerscheinungen',
			'count' =>  $m -> getCount(),
			'icon' => NULL,
			'list' => $m -> getOutput() -> output()
		));

		$content = $view->render('view/list');

		$view->setData(array('content' => $content));
		$view->setData(mainData());
		echo $view->render('main/pd');

	});

    $app->get('/watchlist/:id', function($id) use ($app){

        $m = new \Content\Watchlist(0, $id);

        if(is_null($m -> getOutput())){
        	$app->notFound();
        }

        $view = $app->view(); 

        $view->setData(array(
        	'title' => $m -> getName(),
        	'count' =>  $m -> getCount(),
        	'icon' => 'fa-star',
        	'list' => $m -> getOutput() -> output()
        ));

        $content = $view->render('view/list');

        $view->setData(array('content' => $content));
        $view->setData(mainData());
        echo $view->render('main/pd');
    });

    $app->get('/manage-watchlists', function() use ($app){

        $m = new \Special\ManageWatchlists();

        $view = $app->view(); 

        $view->setData(array(
        	'wl_count' =>  $m -> getCount(),
        	'wls' => $m -> getWatchlists(),
        	'wl_def' => $m -> getDefWatchlist()
        ));

        $content = $view->render('view/manage-watchlists');

        $view->setData(array('content' => $content));
        $view->setData(mainData());
        echo $view->render('main/pd');
    });

});


$app -> get('/search/:query', function ($query) use ($app){

	$m = new \Special\Search($query,0);

	$view = $app->view(); 

	if(!is_null($m -> getOutput())){
		$list = $m -> getOutput() -> output();
	}else{
		$list = NULL;
	}

	$view->setData(array(
		'count' =>  $m -> getCount(),
		'query' => $query,
		'list' => $list,
		'error' => $m -> getError(),
		'searchval' => $query
	));

	$content = $view->render('view/search');

	$view->setData(array('content' => $content));
	$view->setData(mainData());
	echo $view->render('main/pd');
});

$app->notFound(function () use ($app) {

	if(MAINTENANCE){
		$app->view()->setData('version', VERSION);
		echo $app -> view() ->render('maintenance');
		$app -> stop();
	}

    $view = $app -> view(); 
    $app->view()->setData('version', VERSION);

    $user = null;
	if (isset($_SESSION['user'])) {
		$user = $_SESSION['user'];
	}

	$name = null;
	if (isset($_SESSION['name'])) {
		$name = $_SESSION['name'];
	}

	$app->view()->setData('user', $user);
	$app->view()->setData('name', $name);

	if(isset($_SESSION['id'])){
		$app->view()->setData(mainData());
	}

    $content = $view -> render('error');

    $view -> setData(array('content' => $content));

    if(isset($_SESSION['id'])){
		echo $view ->render('main/pd');
    }else{
    	echo $view ->render('main/default');
    }
});

$app -> run();

/*
	WEITERE FUNKTIONEN
 */


/**
 * Aufbereiten aller Hauptinformationen für die Info-Leiste
 * @return array Assoziatives Array zur Zuweisung an den View
 */
function mainData(){

	$data=\Profildienst\DB::get(array('_id' => $_SESSION['id']),'users',array('cart' => 1, 'watchlist' => 1, 'price' => 1, '_id' => 0), true);

	$cart=sizeof($data['cart']);
	$watchlists=$data['watchlist'];
	$wl_order=\Profildienst\DB::getUserData('wl_order');

	$wl = array();
	foreach($wl_order as $wlo){
		$watchlists[$wlo]['count'] = count($watchlists[$wlo]['list']);
		array_push($wl, $watchlists[$wlo]);
	}

	if (isset($_REQUEST['num']) && $_REQUEST['num'] != "" && $_REQUEST['num'] > 0 && is_numeric($_REQUEST['num'])){
		$num = $_REQUEST["num"] - 1;
	}else{
		$num = 0;
	}

	$price=$data['price']['price'];
	$known=$data['price']['known'];
	$est=$data['price']['est'];

	$price = number_format($price, 2, '.', '');

	return array('cartcount' => $cart, 'searchval' => '', 'num' => $num, 'wl' => $wl, 'price' => $price, 'known' => $known, 'est' => $est);
}

/**
 * Fehlerbehandlung
 * @param  $msg  string Fehlermeldung
 */
function err($msg){
	global $app;
	$app->flash('error', $msg);
	$app->redirect('/');
}


function validateNum($num){
	if ($num != '' && $num > 0 && is_numeric($num)){
		return $num;
	}else{
		return 0;
	}
}
?>
