<?php

namespace Src\Application\Ports;

interface HashServiceInterface
{
    public function make(string $value): string;

    public function check(string $plainValue, string $hashedValue): bool;
}
