<?php

namespace Bisnis\Controller;

use Bisnis\Api\ApiClientAwareInterface;
use Bisnis\Api\ApiClientAwareTrait;
use Bisnis\Template\TemplatingAwareInterface;
use Bisnis\Template\TemplatingAwareTrait;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
abstract class AbstractController implements ControllerInterface, TemplatingAwareInterface, ApiClientAwareInterface
{
    use TemplatingAwareTrait;
    use ApiClientAwareTrait;
}
