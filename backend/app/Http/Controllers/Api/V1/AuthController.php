<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function token(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'min:2', 'max:255'],
            'phone_number' => ['required', 'string', 'regex:/^0[0-9]{9}$/'],
        ], [
            'username.required' => 'Tên không được để trống.',
            'username.string' => 'Tên phải là một chuỗi ký tự.',
            'username.min' => 'Tên phải có tối thiểu 2 ký tự.',
            'username.max' => 'Tên không được vượt quá 255 ký tự.',
            'phone_number.required' => 'Số điện thoại không được để trống.',
            'phone_number.regex' => 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0.',
        ]);

        $ttl = (int) config('jwt.ttl', 1440);
        $expiresAt = Carbon::now('UTC')->addMinutes($ttl);

        $token = JWTAuth::customClaims([
            'username' => $validated['username'],
            'phone_number' => $validated['phone_number'],
        ])->fromUser(new class($validated['username']) implements \Tymon\JWTAuth\Contracts\JWTSubject {
            public function __construct(private string $username) {}

            public function getJWTIdentifier(): string
            {
                return $this->username;
            }

            public function getJWTCustomClaims(): array
            {
                return [];
            }
        });

        return response()->json([
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }
}
