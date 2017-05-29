<?php

namespace Bisnis\Controller;

class CustomersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Customers',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('customers/index.twig', $data);
    }
}