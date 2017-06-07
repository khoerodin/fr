<?php

namespace Bisnis\Controller;


class BanksController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Home',
            'title' => 'Bank',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('banks/index.twig', $data);
    }
}