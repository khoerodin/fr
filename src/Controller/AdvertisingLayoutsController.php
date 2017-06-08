<?php

namespace Bisnis\Controller;

class AdvertisingLayoutsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Layout Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-layouts/index.twig', $data);
    }
}