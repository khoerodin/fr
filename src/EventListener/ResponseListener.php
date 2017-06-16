<?php

namespace Bisnis\EventListener;

use Ihsan\Client\Platform\Event\FilterResponse;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class ResponseListener
{
    /**
     * @param FilterResponse $filterResponse
     */
    public function signingResponse(FilterResponse $filterResponse)
    {
        $response = $filterResponse->getResponse();
        if ($response) {
            $response->headers->set('X-Backend', gethostbyname(php_uname('n')));
        }
    }
}
