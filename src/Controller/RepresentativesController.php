<?php

namespace Bisnis\Controller;


class RepresentativesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Representatives',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('representatives/index.twig', $data);
    }
}