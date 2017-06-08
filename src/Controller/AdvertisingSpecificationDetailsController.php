<?php

namespace Bisnis\Controller;

class AdvertisingSpecificationDetailsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Detail Jenis Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-specification-details/index.twig', $data);
    }
}