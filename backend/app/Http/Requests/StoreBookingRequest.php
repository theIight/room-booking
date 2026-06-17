<?php

namespace App\Http\Requests;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'room_id.required' => 'Mã phòng không được để trống.',
            'room_id.integer' => 'Mã phòng phải là một số nguyên.',
            'room_id.exists' => 'Phòng họp không tồn tại.',
            'start_time.required' => 'Thời gian bắt đầu không được để trống.',
            'start_time.date' => 'Thời gian bắt đầu không hợp lệ.',
            'end_time.required' => 'Thời gian kết thúc không được để trống.',
            'end_time.date' => 'Thời gian kết thúc không hợp lệ.',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $start = CarbonImmutable::parse($this->input('start_time'))->utc();
                $end = CarbonImmutable::parse($this->input('end_time'))->utc();
                $minimumStart = CarbonImmutable::now('UTC')->subMinute();

                if ($start->lt($minimumStart)) {
                    $validator->errors()->add('start_time', 'Thời gian bắt đầu không được ở trong quá khứ.');
                }

                $durationMinutes = $start->diffInMinutes($end, false);
                if ($durationMinutes < 60) {
                    $validator->errors()->add('end_time', 'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 giờ.');
                }

                if ($durationMinutes > 480) {
                    $validator->errors()->add('end_time', 'Thời gian kết thúc chỉ được cách thời gian bắt đầu tối đa 8 giờ.');
                }
            },
        ];
    }
}
