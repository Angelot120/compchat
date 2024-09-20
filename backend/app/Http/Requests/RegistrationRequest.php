<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegistrationRequest extends FormRequest
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
            "name" => "required|string|max:64|min:4|unique:users",
            "email" => "required|email|max:150|min:4|unique:users",
            "password" => "required|string|min:8",
            // "passwordConfirm" => "required|same:password",
        ];
    }


    public function messages()
    {
        return [
            'name.required' => 'Le nom d\'utilisateur est requis',
            'name.min' => 'Le nom d\'utilisateur doit contenir au moins 3 characters',
            'name.max' => 'Le nom d\'utilisateur doit contenir au plus 255 characters',
            'name.unique' => 'Cet nom d\'utilisateur existe déjà !',
            'email.required' => 'Email est requise',
            'email.unique' => 'Cet email exist déjà',
            'password.required' => 'Le mot de passe est requis',
            'passwordComfirm.same' => 'les deux mots de passe sont différent',
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
