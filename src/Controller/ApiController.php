<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        //var_dump($params);die();

        if ($method == 'post' || $method == 'put') {
            $temps = [];
            foreach ($params as $param) {
                if(
                    $param['value'] == 'true' || $param['value'] == '1' ||
                    $param['value'] == 'false' || $param['value'] == '0'
                ) {
                    $value = (bool) $param['value'];
                } else {
                    $value = $param['value'];
                }
                $temps[$param['name']] = $value;
            }
        } elseif($method == 'get') {
            if(count($params) > 0) {
                $temps = array_reduce($params, 'array_merge', array());
                if(count($temps) > 0) {
                    $temps = array_filter($temps);
                } else {
                    $temps = [];
                }
            } else {
                $temps = [];
            }
        } else {
            $temps = [];
        }

        $response = $this->request($url, $method, $temps);
        return new Response($response->getContent());
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function searchAction(Request $request)
    {
        $url = $request->get('module');
        $method = $request->get('method');
        $params = $request->get('q');
        $field = $request->get('field');

        //]var_dump($params);die();

        $response = $this->request($url, $method, [$field => $params]);
        $arr = json_decode($response->getContent(), true)['hydra:member'];

        $arrData = [];
        foreach ($arr as $value) {
            $obj = [];
            foreach ($value as $key => $value) {
                if($key == 'id'){
                    $obj[$key] = $value;

                }
                if($key == $field){
                    $obj[$key] = $value;
                }
            }
            $arrData[] = $obj;
        }

        $data = $arrData;
        return new JsonResponse($data);
    }
}
