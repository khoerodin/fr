<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;

class HomeController extends AbstractController
{
    public function indexAction($a, $b, $c)
    {
        return $this->renderResponse('index.html.twig');
    }
}
