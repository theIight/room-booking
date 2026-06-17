<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\TokenRequest;
use App\Http\Controllers\Controller;
use App\Models\AnonymousUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function token(TokenRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $ttl = (int) config('jwt.ttl', 1440);
        $expiresAt = Carbon::now('UTC')->addMinutes($ttl);

        $token = JWTAuth::customClaims([
            'username' => $validated['username'],
            'phone_number' => $validated['phone_number'],
        ])->fromUser(new AnonymousUser($validated['username']));

        return response()->json([
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }
}
