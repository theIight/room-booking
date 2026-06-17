<?php

namespace Src\Domain\Exceptions;

use RuntimeException;

final class ForbiddenBookingDeletionException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Bạn không có quyền xóa lịch đặt này.');
    }
}
