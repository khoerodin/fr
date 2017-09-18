<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 11/09/17
 * Time: 9:02
 */

namespace Bisnis\Controller;


class HelpdeskTicketStatsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Statistik Helpdesk',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-ticket-stats/index.twig', $data);
    }

}