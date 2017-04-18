<?php

namespace Bisnis\EventListener;

use Ihsan\Client\Platform\Event\FilterResponse;
use Symfony\Component\HttpFoundation\Response;

class TestListener
{
    public function test(FilterResponse $filterResponse)
    {
        $filterResponse->setResponse(new Response('Stop'));
    }
}
