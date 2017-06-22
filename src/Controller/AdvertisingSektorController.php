<?php

namespace Bisnis\Controller;


class AdvertisingSektorController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Sektor',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-sektor/index.twig', $data);
    }
}