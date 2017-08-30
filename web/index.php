<?php

$arr = [
    [
        'id' => 1,
        'name' => 'A',
        'parent' => [
            'id' => 0,
        ],
    ],
    [
        'id' => 2,
        'name' => 'A',
        'parent' => [
            'id' => 1,
        ],
    ],
    [
        'id' => 3,
        'name' => 'A',
        'parent' => [
            'id' => 2,
        ],
    ],
    [
        'id' => 4,
        'name' => 'A',
        'parent' => [
            'id' => 3,
        ],
    ],
    [
        'id' => 5,
        'name' => 'A',
        'parent' => [
            'id' => 0,
        ],
    ],
];

$new = [];
foreach ($arr as $key => $value) {
    if (null === $value['parent']) {
        $new[$key]['id'] = $value['id'];
        $new[$key]['name'] = $value['name'];
        $new[$key]['parent'] = 0;
    } else {
        $new[$key]['id'] = $value['id'];
        $new[$key]['name'] = $value['name'];
        $new[$key]['parent'] = $value['parent']['id'];
    }
}

function buildTree(array &$arr, $parentId = 0) {
    $branch = [];
    foreach ($arr as $element) {
        if ($element['parent'] === $parentId) {
            $children = buildTree($arr, $element['id']);

            if ($children) {
                $element['children'] = $children;
            }

            $branch[$element['id']] = $element;
            unset($arr[$element['id']]);
        }
    }

    return $branch;
}

var_dump(buildTree($new));

exit();

//for development only
ini_set('display_errors', 1);
error_reporting(E_ERROR | E_PARSE);
//end for development only

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$request = Request::createFromGlobals();

$app = new Bootstrap();
$app->handle($request);