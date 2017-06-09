<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class NullFilter extends AbstractFilter
{
    /**
     * @param mixed $value
     * @return mixed
     */
    public function cast($value)
    {
        if ('' === $value) {
            return null;
        }

        return $value;
    }
}