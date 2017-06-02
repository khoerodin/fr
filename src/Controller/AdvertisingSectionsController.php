<?php

namespace Bisnis\Controller;

class AdvertisingSectionsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Sections',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-sections/index.twig', $data);
    }
}