<?php

namespace Src\Domain\Exceptions;

use RuntimeException;

final class BookingAlreadyStartedException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Không thể xóa lịch đặt đã bắt đầu hoặc đã qua.');
    }
}
