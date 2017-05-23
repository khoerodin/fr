<?php

namespace Bisnis\Controller;

class JobTitlesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Job Titles',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('job_titles/index.twig', $data);
    }
}