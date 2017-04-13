<?php

require __DIR__.'/../vendor/autoload.php';

use Bisnis\Bootstrap;
use Symfony\Component\HttpFoundation\Request;

$request = Request::createFromGlobals();

$app = new Bootstrap();
$app->handle($request, require __DIR__.'/../app/config/config.php');
