<?php

namespace Bisnis\Controller;

class CustomersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Customers',
        ];

        $customers = $this->get('customers');
        $customers = json_decode($customers->getContent(),true);

        $data = [
            'meta' => $meta,
            'customers' => $customers
        ];

        return $this->view('customers/index.twig', $data);
    }
}