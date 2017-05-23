<?php

namespace Bisnis\Controller;

class JobTitlesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Job Titles',
        ];

        $jobTitles = $this->get('job_titles');
        $jobTitles = json_decode($jobTitles->getContent(),true);

        $data = [
            'meta' => $meta,
            'job_titles' => $jobTitles
        ];

        return $this->view('job_titles/index.twig', $data);
    }
}