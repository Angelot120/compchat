<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CheckOtpCodeRequest extends FormRequest
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
            "email" => "required|string|max:64|min:4|unique:users",
            "otpCode" => "required|string|max:6|min:6",
        ];
    }

    public function messages()
    {
        return [
            'otpCode.required' => 'Le code OTP est requis',
            'otpCode.min' => 'Le code OTP ne doit contenir que 6 characters',
            'otpCode.max' => 'Le code OTP ne doit contenir que 6 characters maximum',
            'name.unique' => 'Cet nom d\'utilisateur existe déjà !',
            'email.required' => 'Email est requise',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Echec de validation.',
            'data'      => $validator->errors()
        ]));
    }
}
