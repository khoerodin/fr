<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
abstract class AbstractFilter implements FilterInterface
{
    /**
     * @var bool
     */
    protected $stopNext = false;

    /**
     * @return bool
     */
    public function stopNext()
    {
        return $this->stopNext;
    }
}