<?php

require __DIR__.'/../vendor/autoload.php';

use Bisnis\Application;
use Ihsan\Client\Platform\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpFoundation\Request;

$configDir = __DIR__.'/../app/config';
$configFiles = ['loader.yml'];

$request = Request::createFromGlobals();

$container = ContainerBuilder::build($configDir, $configFiles);
$app = new Application();
$app->handle($request, $container);
