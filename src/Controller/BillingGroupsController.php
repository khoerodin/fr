<?php

namespace Bisnis\Controller;

class BillingGroupsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Tagihan',
            'title' => 'Grup Tagihan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('billing-groups/index.twig', $data);
    }
}