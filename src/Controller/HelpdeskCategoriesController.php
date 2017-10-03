<?php

namespace Bisnis\Controller;


class HelpdeskCategoriesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Kategori Helpdesk',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-categories/index.twig', $data);
    }
}