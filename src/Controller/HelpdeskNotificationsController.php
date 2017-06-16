<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 14/06/17
 * Time: 9:38
 */

namespace Bisnis\Controller;


class HelpdeskNotificationsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Notifikasi Helpdesk',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-notifications/index.twig', $data);
    }
}