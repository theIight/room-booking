<?php

namespace Src\Domain\Exceptions;

use RuntimeException;

final class OverlapException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Khung giờ được chọn trùng với một lịch đặt đã có.');
    }
}
