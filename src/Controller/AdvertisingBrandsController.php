<?php

namespace Bisnis\Controller;

class AdvertisingBrandsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Brands',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-brands/index.twig', $data);
    }
}