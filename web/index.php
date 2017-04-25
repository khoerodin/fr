<?php

require __DIR__.'/../vendor/autoload.php';

use Bisnis\Application;
use Symfony\Component\HttpFoundation\Request;

$configDir = __DIR__.'/../app/config';

$request = Request::createFromGlobals();

$app = new Application($configDir);
$app->handle($request);
