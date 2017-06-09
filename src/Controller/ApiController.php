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

        echo "<pre>";
        var_dump($params);
        echo "<pre>";die();

        if ($method == 'post' || $method == 'put') {
            $temps = [];
            foreach ($params as $param) {
                if($param['value'] != '' AND $param['value'] != null AND $param['name'] != 'creditLimit') {
                    if(
                        $param['value'] == 'true' ||
                        $param['value'] == 'false' ||
                        $param['value'] == '1' ||
                        $param['value'] == '0'
                    ) {
                        if ('true' === $param['value'] || 1 === (int) $param['value']) {
                            $value = true;
                        } else {
                            $value = false;
                        }
                    } else {
                        $value = $param['value'];
                    }

                    $temps[$param['name']] = $value;

                } elseif ($param['name'] == 'creditLimit') {
                    $temps[$param['name']] = (float) $param['value'];
                }

                if($param['name'] == 'fullname' && $url == 'users') {
                    $fullname = $value;
                }
            }

            if ($url == 'users') {
                $temps['username'] = $this->generateUsername($fullname);
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

            $temps = array_merge($temps, array('order[id]' => 'DESC'));
        } else {
            $temps = [];
        }

        //var_dump($fullname);die();

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
        $q = $request->get('q');
        $field = $request->get('field');

        $params = [];
        foreach ($field as $column) {
            $params[$column] = $q;
        }

        $response = $this->request($url, $method, $params);
        $arr = json_decode($response->getContent(), true);

        if (array_key_exists('hydra:member', $arr)) {
            if(count($arr) > 0 ) {
                $arr = $arr['hydra:member'];
            } else {
                return new JsonResponse(array());
            }
        } else {
            return new JsonResponse(array());
        }


        $arrData = [];
        foreach ($arr as $value) {
            $obj = [];
            foreach ($value as $key => $value) {
                if($key == 'id'){
                    $obj[$key] = $value;

                }

                //var_dump($field[0]);die();
                if($key == $field[0]){
                    $obj[$key] = $value;
                }
            }
            $arrData[] = $obj;
        }

        $data = $arrData;
        return new JsonResponse($data);
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getRoleAction(Request $request)
    {
        $url = $request->get('module');
        $method = $request->get('method');
        $params = $request->get('params');

        $rolesResponse = $this->request($url, $method, $params); // get roles by user
        $rolesResponse = json_decode($rolesResponse->getContent(), true)['hydra:member'];

        $modulesResponse = $this->request('modules', $method, []); // get all module
        $modulesResponse = json_decode($modulesResponse->getContent(), true)['hydra:member'];

        $modules = [];
        $modName = [];
        foreach ($modulesResponse as $module) {

            foreach ($rolesResponse as $role) {
                if ($module['id'] == $role['module']['id']) {

                    $modules[] = [
                        'id' => $role['id'],
                        'module' => $role['module']['name'],
                        'module_id' => $role['module']['id'],
                        'addable' => $role['addable'],
                        'editable' => $role['editable'],
                        'viewable' => $role['viewable'],
                        'deletable' => $role['deletable']
                    ];

                    $modName[] = $role['module']['id'];

                }
            }

        }

        $allModules = [];
        foreach ($modulesResponse as $module) {
            $allModules[] = $module['id'];
        }

        $notInUserModules = array_diff($allModules, $modName);

        if (count($notInUserModules) > 0) {

            foreach ($modulesResponse as $module) {

                foreach ($notInUserModules as $mod) {
                    if ($mod == $module['id']) {

                        $data = [
                            'module' => '/api/modules/' . $module['id'],
                            'user' => '/api/users/' . $params['user.id'],
                            'addable' => false,
                            'editable' => false,
                            'viewable' => false,
                            'deletable' => false
                        ];

                        $this->request('roles', 'post', $data);
                    }
                }

            }

        }

        $response = $this->request('roles', 'get', $params);
        return new Response($response->getContent());
    }

    private function menusCategoryAction($key)
    {
        $array = [
            'administration' => [
                ['module' => 'modules'],
                ['module' => 'users'],
                ['module' => 'user-activities'],
                ['module' => 'clients'],
                ['module' => 'settings'],
                ['module' => 'cities'],
                ['module' => 'banks'],
                ['module' => 'representatives'],
            ],
            'advertising' => [
                ['module' => 'advertising/ads'],
                ['module' => 'advertising/categories'],
                ['module' => 'advertising/customers'],
                ['module' => 'advertising/layouts'],
                ['module' => 'advertising/payment-methods'],
                ['module' => 'advertising/positions'],
                ['module' => 'advertising/specifications'],
                ['module' => 'advertising/types'],
                ['module' => 'advertising/specification-details']
            ],
            'billing' => [
                ['module' => 'billing/areas'],
                ['module' => 'billing/identities'],
                ['module' => 'billing/groups'],
            ],
        ];

        return $array[$key];
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function menusAction(Request $request)
    {
        $category = $request->get('category');
        $response = json_decode($this->fetch('menus'),true)['hydra:member'];

        $modules = array();
        foreach ($response as $key => $value) {

            $path = str_replace('/api/', '', $value['module']['path']);

            foreach ($this->menusCategoryAction($category) as $module) {
                if($module['module'] == $path && $value['viewable'] != false) {
                    $modules[] = [
                        'name' => $value['module']['name'],
                        'path' => str_replace('/api/', '', $value['module']['path']),
                        'iconCls' => $value['module']['iconCls'],
                    ];
                }
            }

        }

        return new JsonResponse($modules);
    }

    public function callImage($path)
    {
        $this->request('files/'.$path, 'get');

        $filename = basename($path);
        $file_extension = strtolower(substr(strrchr($filename,"."),1));

        switch( $file_extension ) {
            case "gif": $ctype="image/gif"; break;
            case "png": $ctype="image/png"; break;
            case "jpeg":
            case "jpg": $ctype="image/jpeg"; break;
            default:
        }

        header('Content-type: ' . $ctype);
        readfile($path);
    }

    private function generateUsername($fullname)
    {
        $username = $this->request('username/generate/'.$fullname, 'get');
        return json_decode($username->getContent(), true)['username'];
    }
}
