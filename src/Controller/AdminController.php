<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;

class AdminController extends AbstractController
{
    protected function view($view, array $variables = array())
    {
        $autoLoad = [
            'me' => json_decode($this->fetch('me')),
            'menus' => json_decode($this->fetch('menus'),true),
        ];

        //var_dump($autoLoad);die();

        return $this->renderResponse($view, array_merge($autoLoad, $variables));
    }
}