<?php

namespace Bisnis\Controller;


class AdvertisingSubSektorController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Sub Sektor',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-sub-sektor/index.twig', $data);
    }
}