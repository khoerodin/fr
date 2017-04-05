<?php

namespace Bisnis\Application\Controller;

use Bisnis\Controller\AbstractController;

class HomeController extends AbstractController
{
    public function indexAction()
    {
        return $this->renderResponse('index.html.twig');
    }
}
