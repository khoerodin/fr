<?php

namespace Bisnis\Controller;

class AdvertisingBudgetsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Budgets',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-budgets/index.twig', $data);
    }
}