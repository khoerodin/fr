<?php

namespace Bisnis\Controller;

class AdvertisingAdCopiesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Ad Copies',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-ad-copies/index.twig', $data);
    }
}