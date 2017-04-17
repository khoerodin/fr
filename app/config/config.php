<?php

return array(
    'routes' => array(
        array(
            'path' => '/{a}/{b}',
            'controller' => 'Bisnis:HomeController@index',
        ),
    ),
    'template' => array(
        'path' => __DIR__.'/../../var/views',
        'cache' => __DIR__.'/../../var/cache',
    ),
//    'event_listeners' => array(
//        array(
//            'event' => \Ihsan\Client\Platform\Http\KernelEvents::FILTER_REQUEST,
//            'listener' => function (\Ihsan\Client\Platform\Event\FilterResponse $filterResponse) {
//                $filterResponse->setResponse(new \Symfony\Component\HttpFoundation\Response('Stop here.'));
//            },
//        ),
//    ),
);
