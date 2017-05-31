<?php

namespace Bisnis\Controller;

class SettingsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Settings',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('settings/index.twig', $data);
    }
}