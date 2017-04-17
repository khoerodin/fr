<?php

require __DIR__.'/../vendor/autoload.php';

use Ihsan\Client\Platform\Bootstrap;
use Pimple\Container;
use Symfony\Component\HttpFoundation\Request;

$request = Request::createFromGlobals();

$app = new Bootstrap(new Container());
$app->handle($request, require __DIR__.'/../app/config/config.php');
