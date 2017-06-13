<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class IntFilter extends AbstractFilter
{
    /**
     * @param mixed $value
     * @return mixed
     */
    public function cast($value)
    {
        $value = (string) $value;
        if (is_numeric($value)) {
            $this->stopNext = true;

            return (integer) $value;
        }

        return $value;
    }
}