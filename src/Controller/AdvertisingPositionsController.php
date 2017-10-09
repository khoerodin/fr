<?php

namespace Bisnis\Controller;

class AdvertisingPositionsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Posisi Iklan',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-positions/index.twig', $data);
    }
}
