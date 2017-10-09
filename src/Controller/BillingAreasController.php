<?php

namespace Bisnis\Controller;

class BillingAreasController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Tagihan',
            'title' => 'Area Tagihan',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('billing-areas/index.twig', $data);
    }
}
