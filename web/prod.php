<?php

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Cache\Adapter\ApcuAdapter;

$request = Request::createFromGlobals();

$app = new Bootstrap('configs', new ApcuAdapter());
$app->handle($request);