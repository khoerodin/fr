<?php

return array(
    'routes' => array(
        array(
            'path' => '/',
            'controller' => 'Bisnis:Application:HomeController@index',
            'filter' => array(
                'event' => \Bisnis\Http\KernelEvents::FILTER_REQUEST,
                'listener' => function (\Bisnis\Event\FilterResponse $filterResponse) {
                    $filterResponse->setResponse(new \Symfony\Component\HttpFoundation\Response('Stop here.'));
                },
            ),
        ),
    ),
    'template' => array(
        'views' => __DIR__.'/../../var/views',
        'cache' => __DIR__.'/../../var/cache',
    ),
    'middlewares' => array(
        \Bisnis\Template\TemplateMiddleware::class,
    ),
);
