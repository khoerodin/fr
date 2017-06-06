<?php

namespace Bisnis\Controller;

class AdvertisingCategoriesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Kategori Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-categories/index.twig', $data);
    }
}