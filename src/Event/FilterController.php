<?php

namespace Bisnis\Event;

use Symfony\Component\EventDispatcher\Event;
use Symfony\Component\HttpFoundation\Request;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class FilterController extends Event
{
    /**
     * @var Request
     */
    private $request;

    /**
     * @var array
     */
    private $attributes;

    /**
     * @param Request $request
     * @param array   $attributes
     */
    public function __construct(Request $request, array $attributes)
    {
        $this->request = $request;
        $this->attributes = $attributes;
    }

    /**
     * @return Request
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * @return array
     */
    public function getAttributes()
    {
        return $this->attributes;
    }
}
