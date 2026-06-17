<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;

final readonly class AnonymousUser implements JWTSubject
{
    public function __construct(private string $username) {}

    public function getJWTIdentifier(): string
    {
        return $this->username;
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
