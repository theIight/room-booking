<?php

namespace App\Adapters\Security;

use Illuminate\Support\Facades\Hash;
use Src\Application\Ports\HashServiceInterface;

final class LaravelHashService implements HashServiceInterface
{
    public function make(string $value): string
    {
        return Hash::make($value);
    }

    public function check(string $plainValue, string $hashedValue): bool
    {
        return Hash::check($plainValue, $hashedValue);
    }
}
