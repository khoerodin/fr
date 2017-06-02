<?php

namespace Bisnis\Controller;


class UserActivitiesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Administration',
            'title' => 'User Activities',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('user-activities/index.twig', $data);
    }
}