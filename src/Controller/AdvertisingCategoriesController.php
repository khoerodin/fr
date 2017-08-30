<?php

namespace Bisnis\Controller;

class AdvertisingCategoriesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Kategori Iklan',
        ];

        $categories = $this->request('advertising/categories', 'get');
        $categories = json_decode($categories->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'categories' => $this->getCategory(NULL, $categories)
        ];

        return $this->view('advertising-categories/index.twig', $data);
    }

    private function getCategory($parentCategoryId, $data) {
        $str = '';
        foreach ($data as $row) {
            if ($row['parent']['id'] == $parentCategoryId) {
                $str .= '<li><span data-id="' . $row['id'] . '" data-name="' . $row['name'] . '">' . $row['name'] . '</span>';
                $res = $this->getCategory($row['id'], $data);
                if ($res) {
                    $str .= '<ul>' . $res . '</ul>';
                }
                $str .= '</li>';
            }
        }
        return $str;

    }

}