<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class BooleanFilter extends AbstractFilter
{
    /**
     * @param mixed $value
     * @return mixed
     */
    public function cast($value)
    {
        if ('true' === $value) {
            $this->stopNext = true;

            return true;
        }

        if ('false' === $value) {
            $this->stopNext = true;

            return false;
        }

        return $value;
    }
}