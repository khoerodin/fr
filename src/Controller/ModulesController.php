<?php

namespace Bisnis\Controller;

class ModulesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Modul',
        ];

        $services = $this->request('services', 'get');
        $services = json_decode($services->getContent(), true)['hydra:member'];

        // sorting ASC
        usort($services, function ($a, $b) {
            return $a['name'] <=> $b['name'];
        });

        $data = [
            'meta' => $meta,
            'services' => $services,
        ];

        return $this->view('modules/index.twig', $data);
    }
}
