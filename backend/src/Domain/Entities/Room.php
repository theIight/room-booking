<?php

namespace Src\Domain\Entities;

final readonly class Room
{
    public function __construct(
        public ?int $id,
        public string $name,
        public int $capacity,
    ) {}
}
