<?php

require 'vendor/autoload.php';

$app = new \Slim\Slim(array(
    'view' => new \Slim\Extras\Views\Rain(\Config\Config::$rain_config)
    ));

$app->add(new \Slim\Middleware\SessionCookie(array('secret' => 'ProfildienstGBV')));

$authenticate = function ($app) {
    return function () use ($app) {
        if (!isset($_SESSION['id'])) {
            $app->redirect('/login');
        }
    };
};

$app->group('/ajax', $authenticate($app) ,function () use ($app) { 

    $app->post('/confirm', function () use ($app){

        $m = new \AJAX\ConfirmOrder();

        echo json_encode($m -> getResponse());

    });

    $app->post('/delete', function () use ($app){

        $m = new \AJAX\Delete();

        echo json_encode($m -> getResponse());

    });

    $app->post('/watchlist-manage', function () use ($app){

        $id = $app->request()->post('id');
        $type = $app->request()->post('type');
        $content = $app->request()->post('content');

        $m = new \AJAX\WatchlistManager($id, $type, $content);

        echo json_encode($m -> getResponse());

    });

    $app->post('/watchlist-rm', function () use ($app){

        $id = $app->request()->post('id');
        $rm = $app->request()->post('rm');
        $wl = $app->request()->post('wl');

        $m = new \AJAX\RemoveWatchlist($id, $rm, $wl);

        echo json_encode($m -> getResponse());

    });

    $app->post('/watchlist', function () use ($app){

        $id = $app->request()->post('id');
        $rm = $app->request()->post('rm');
        $wl = $app->request()->post('wl');

        $m = new \AJAX\Watchlist($id, $rm, $wl);

        echo json_encode($m -> getResponse());

    });

    $app->post('/reject', function () use ($app){

        $id = $app->request()->post('id');

        $m = new \AJAX\Reject($id);

        echo json_encode($m -> getResponse());

    });


    $app->post('/reject-rm', function () use ($app){

        $id = $app->request()->post('id');

        $m = new \AJAX\RemoveReject($id);

        echo json_encode($m -> getResponse());

    });

    $app->post('/info', function () use ($app){

        $id = $app->request()->post('id');

        $m = new \AJAX\Info($id);

        echo json_encode($m -> getResponse());

    });

    $app->post('/change-setting', function () use ($app){

        $type = $app->request()->post('type');
        $value = $app->request()->post('value');
        
        $m = new \AJAX\ChangeSetting($type, $value);

        echo json_encode($m -> getResponse());

    });


    $app->post('/cart-rm', function () use ($app){

        $id = $app->request()->post('id');
        $rm = $app->request()->post('rm');

        $m = new \AJAX\RemoveCart($id, $rm);

        echo json_encode($m -> getResponse());

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

        echo json_encode($m -> getResponse());

    });

});

$app -> group('/pageloader', $authenticate($app) , function () use ($app){

    $app -> get('/overview/page/:num', function($num = 0) use ($app){
        $m = new \Content\Main(validateNum($num));

        $tit = $m -> getOutput() -> titleOutput();
        foreach($tit as $t){
            echo $t;
        }
    });

    $app -> get('/cart/page/:num', function($num = 0) use ($app){
        $m = new \Content\Cart(validateNum($num));

        $tit = $m -> getOutput() -> titleOutput();
        foreach($tit as $t){
            echo $t;
        }
    });

    $app -> get('/watchlist/:id/page/:num', function($id = NULL, $num = 0) use ($app){
        $m = new \Content\Watchlist(validateNum($num), $id);

        $tit = $m -> getOutput() -> titleOutput();
        foreach($tit as $t){
            echo $t;
        }
    });

    $app -> get('/search/:query/page/:num', function($query, $num = 0) use ($app){

        $m = new \Special\Search($query, $num);

        $view = $app->view(); 

        if(!is_null($m -> getOutput())){

            $tit = $m -> getOutput() -> titleOutput();
            foreach($tit as $t){
                echo $t;
            }
        }
        
    });


    $app -> get('/pending/page/:num', function($num = 0) use ($app){
        $m = new \Content\Pending(validateNum($num));

        $tit = $m -> getOutput() -> titleOutput();
        foreach($tit as $t){
            echo $t;
        }
    });

    $app -> get('/done/page/:num', function($num = 0) use ($app){
        $m = new \Content\Done(validateNum($num));

        $tit = $m -> getOutput() -> titleOutput();
        foreach($tit as $t){
            echo $t;
        }
    });

    $app -> get('/rejected/page/:num', function($num = 0) use ($app){
        $m = new \Content\Rejected(validateNum($num));

        $tit = $m -> getOutput() -> titleOutput();
        foreach($tit as $t){
            echo $t;
        }
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

$app->run(); 

?>