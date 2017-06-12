<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class FloatFilter extends AbstractFilter
{
    /**
     * @param mixed $value
     * @return mixed
     */
    public function cast($value)
    {
        $value = (string) $value;
        if (is_numeric($value)) {
            $floatingPoint = explode('.', $value);
            if (1 < count($floatingPoint)) {
                $this->stopNext = true;

                return (float) $value;
            }
        }

        return $value;
    }
}