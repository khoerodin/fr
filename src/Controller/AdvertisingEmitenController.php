<?php

namespace Bisnis\Controller;


class AdvertisingEmitenController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Emiten',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-emiten/index.twig', $data);
    }
}