<?php

namespace Bisnis\Controller;

class AdvertisingAdBrandsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Ad Brands',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-ad-brands/index.twig', $data);
    }
}