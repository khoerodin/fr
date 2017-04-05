<?php

require __DIR__.'/../vendor/autoload.php';

use Bisnis\Application;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;

$request = Request::createFromGlobals();

$app = new Application(new RouteCollection(), new EventDispatcher());
$app->registerConfigPath(__DIR__ . '/../app/config/config.php');
$app->run();

$response = $app->handle($request);
$response->send();
