<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 13/06/17
 * Time: 15:55
 */

namespace Bisnis\Controller;


class HelpdeskCategoriesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Kategori Helpdesk',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-categories/index.twig', $data);
    }
}