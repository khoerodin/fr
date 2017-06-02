<?php

namespace Bisnis\Controller;

class AdvertisingClassificationsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Classification',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-classifications/index.twig', $data);
    }
}