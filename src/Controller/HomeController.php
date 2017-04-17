<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends AbstractController
{
    public function indexAction($a, $b, $c)
    {
        return new Response(sprintf('%s%s', $a, $b));
    }
}
