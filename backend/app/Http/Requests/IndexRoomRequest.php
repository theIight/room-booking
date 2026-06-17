<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexRoomRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'page.integer' => 'Số trang phải là một số nguyên.',
            'page.min' => 'Số trang phải tối thiểu là 1.',
            'per_page.integer' => 'Số lượng mỗi trang phải là một số nguyên.',
            'per_page.min' => 'Số lượng mỗi trang phải tối thiểu là 1.',
            'per_page.max' => 'Số lượng mỗi trang không được vượt quá 100.',
        ];
    }
}
