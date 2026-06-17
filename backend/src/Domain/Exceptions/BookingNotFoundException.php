<?php

namespace Src\Domain\Exceptions;

use RuntimeException;

final class BookingNotFoundException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Không tìm thấy lịch đặt.');
    }
}
