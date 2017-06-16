<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 14/06/17
 * Time: 9:42
 */

namespace Bisnis\Controller;


class HelpdeskStaffsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Staff Helpdesk',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-staffs/index.twig', $data);
    }
}