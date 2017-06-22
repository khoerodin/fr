<?php

namespace Bisnis\Filter;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class FilterFactory
{
    /**
     * @var FilterInterface[]
     */
    private $filters;

    /**
     * @param FilterInterface[] $filters
     */
    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * @param mixed $value
     * @return mixed
     */
    public function cast($value)
    {
        foreach ($this->filters as $filter) {
            $value = $filter->cast($value);

            if ($filter->stopNext()) {
                $filter->reset();

                return $value;
            }
        }

        return $value;
    }
}
