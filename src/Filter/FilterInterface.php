<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
interface FilterInterface
{
    /**
     * @param mixed $value
     * @return mixed
     */
    public function cast($value);

    /**
     * @return bool
     */
    public function stopNext();

    public function reset();
}