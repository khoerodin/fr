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
            //var_dump($params);die();
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
                ['id' => '1', 'module' => 'clients', 'name' => 'CLIENTS'],
                ['id' => '2', 'module' => 'modules', 'name' => 'MODULES'],
                ['id' => '3', 'module' => 'users', 'name' => 'USERS'],
                ['id' => '4', 'module' => 'activity_loggers', 'name' => 'ACTIVITY LOGGERS']
            ],
            'account_management' => [
                ['id' => '1', 'module' => 'accounts', 'name' => 'ACCOUNTS'],
                ['id' => '2', 'module' => 'transaction_mappings', 'name' => 'TRANSACTION MAPPINGS']
            ],
            'customer_client' => [
                ['id' => '1', 'module' => 'customers', 'name' => 'CUSTOMERS']
            ],
            'organization' => [
                ['id' => '1', 'module' => 'companies', 'name' => 'COMPANIES'],
                ['id' => '2', 'module' => 'departments', 'name' => 'DEPARTMENTS'],
                ['id' => '3', 'module' => 'job_titles', 'name' => 'JOB TITLES'],
            ],
            'utility' => [
                ['id' => '1', 'module' => 'units', 'name' => 'UNITS']
            ],
        ];

        return json_encode($array[$key], true);
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function menusAction(Request $request)
    {
        $category = $request->get('category');
        return new Response($this->menusCategoryAction($category));
    }
}
