<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class StringFilter extends AbstractFilter
{
    /**
     * @param mixed $value
     * @return mixed
     */
    public function cast($value)
    {
        if (is_numeric('#' . $value)) {
            $this->stopNext = true;

            return (int) $value;
        }

        return str_replace('#', '', $value);
    }
}