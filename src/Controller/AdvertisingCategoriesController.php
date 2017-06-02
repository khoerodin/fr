<?php

namespace Bisnis\Controller;

class AdvertisingCategoriesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Categories',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-categories/index.twig', $data);
    }
}