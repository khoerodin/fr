<?php

require __DIR__.'/../vendor/autoload.php';

use Bisnis\Application;
use Symfony\Component\HttpFoundation\Request;

$configDir = __DIR__.'/../app/config';
$configFiles = ['loader.yml'];

$request = Request::createFromGlobals();

$app = new Application();
$app->boot($configDir, $configFiles);
$app->handle($request);
