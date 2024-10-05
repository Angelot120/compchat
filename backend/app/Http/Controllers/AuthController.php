<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistrationRequest;
use App\Http\Resources\UserResource;
use App\Responses\ApiResponse;
use App\Interfaces\AuthInterface;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    //
    private AuthInterface $authInterface;
    public function __construct(AuthInterface $authInterface)
    {
        $this->authInterface = $authInterface;
    }

    public function register(RegistrationRequest $registrationRequest)
    {

        $data = [
            "email" => $registrationRequest->email,
            "name" => $registrationRequest->name,
            "password" => $registrationRequest->password,
            "phone_num" => $registrationRequest->phoneNum,
            "passwordConfirm" => $registrationRequest->passwordConfirm,
        ];

        DB::beginTransaction();

        try {

            $user = $this->authInterface->register($data);

            DB::commit();

            return ApiResponse::sendResponse(
                true,
                [new UserResource($user)],
                'Opération effectuée.',
                201
            );
        } catch (\Throwable $th) {

            return ApiResponse::rollback($th);
        }
    }


    public function login(LoginRequest $loginRequest)
    {
        $data = [
            'email' => $loginRequest->email,
            'password' => $loginRequest->password,
        ];

        DB::beginTransaction();

        try {
            $result = $this->authInterface->login($data);

            DB::commit();

            if (!$result) {
                return ApiResponse::sendResponse(
                    false,
                    [],
                    'identifiant invalide.',
                    401
                );
            }

            return ApiResponse::sendResponse(
                true,
                [
                    'user' => $result['user'],
                    'token' => $result['token'],
                ],
                'connexion effectuée.',
                200
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return ApiResponse::rollback($th);
        }
    }


    public function showProfile()
    {
        $userId = auth()->id();

        $user = User::find($userId);


        if (!$user) {
            return ApiResponse::sendResponse(
                false,
                [],
                'Veullez vous connecter pour consulter votre profile.',
                401
            );
        }

        return ApiResponse::sendResponse(
            true,
            [
                $user
            ],
            'Opération éffectuée effectuée.',
            201
        );
    }
}
