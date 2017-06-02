<?php

namespace Bisnis\Controller;

class SettingsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Administration',
            'title' => 'Settings',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('settings/index.twig', $data);
    }
}