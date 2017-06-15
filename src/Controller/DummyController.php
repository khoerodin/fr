<?php

namespace Bisnis\Controller;

class DummyController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Dummy',
            'title' => 'Dummy',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('dummy/index.twig', $data);
    }
}