<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends AbstractController
{
    public function indexAction($a, $b, $c)
    {
        return $this->renderResponse('layout.html.twig', [
            'title' => 'Test',
            'content' => 'Test',
        ]);
    }
}
