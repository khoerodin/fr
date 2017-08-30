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
        if ('#' === substr($value, 0, 1)) {
            if ($_string = is_numeric(substr($value, 1))) {
                $this->stopNext = true;

                return (string) $_string;
            }
        }

        return $value;
    }
}