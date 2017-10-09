<?php

namespace Bisnis\Controller;

class AdvertisingTeamWorksController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Home',
            'title' => 'TIM KERJA',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-team-works/index.twig', $data);
    }
}
