<?php

namespace Bisnis\Controller;

class AdvertisingMediaController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Media',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-media/index.twig', $data);
    }
}
