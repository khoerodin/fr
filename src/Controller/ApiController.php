<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiController extends AbstractController
{
    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function callAction(Request $request)
    {
        $url = $request->get('module');
        $method = $request->get('method');
        $params = $request->get('params');

        if($method != 'get'){
            $temp = [];
            foreach ($params as $param) {
                if(
                    $param['value'] == 'true' || $param['value'] == '1' ||
                    $param['value'] == 'false' || $param['value'] == '0'
                ) {
                    $value = (bool) $param['value'];
                } else {
                    $value = $param['value'];
                }
                $temp[$param['name']] = $value;
            }
        } else {
            $temp = [];
        }


        $response = $this->request($url, $method, $temp);
        return new Response($response->getContent());
    }
}
