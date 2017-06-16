<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;

class AdminController extends AbstractController
{
    protected function view($view, array $variables = array())
    {
        $autoLoad = [
            'me' => json_decode($this->fetch('me')),
            'menus' => $this->fetch('menus'),
        ];

        return $this->renderResponse($view, array_merge($autoLoad, $variables));
    }
}