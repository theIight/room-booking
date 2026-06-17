<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TokenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:2', 'max:255'],
            'phone_number' => ['required', 'string', 'regex:/^0[0-9]{9}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Tên không được để trống.',
            'username.string' => 'Tên phải là một chuỗi ký tự.',
            'username.min' => 'Tên phải có tối thiểu 2 ký tự.',
            'username.max' => 'Tên không được vượt quá 255 ký tự.',
            'phone_number.required' => 'Số điện thoại không được để trống.',
            'phone_number.regex' => 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0.',
        ];
    }
}
