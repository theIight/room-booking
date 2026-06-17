<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $payload = JWTAuth::parseToken()->getPayload();
        } catch (JWTException $exception) {
            return new JsonResponse(['message' => 'Unauthenticated.'], 401);
        }

        $username = $payload->get('username');
        $phoneNumber = $payload->get('phone_number');

        if (! is_string($username) || ! is_string($phoneNumber)) {
            return new JsonResponse(['message' => 'Invalid token payload.'], 401);
        }

        $request->attributes->set('jwt_username', $username);
        $request->attributes->set('jwt_phone_number', $phoneNumber);

        return $next($request);
    }
}
