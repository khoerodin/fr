<?php

namespace Bisnis\Controller;

class AdvertisingSpecificationsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Specifications',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-specifications/index.twig', $data);
    }
}