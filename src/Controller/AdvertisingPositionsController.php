<?php

namespace Bisnis\Controller;

class AdvertisingPositionsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Positions',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-positions/index.twig', $data);
    }
}