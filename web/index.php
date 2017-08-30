<?php

//for development only
ini_set('display_errors', 1);
error_reporting(E_ERROR | E_PARSE);
//end for development only

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$request = Request::createFromGlobals();

$app = new Bootstrap();
$app->handle($request);