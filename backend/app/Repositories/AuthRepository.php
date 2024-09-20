<?php

namespace App\Repositories;

use App\Interfaces\AuthInterface;
use App\Mail\VerificationMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthRepository implements AuthInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function register(array $data)
    {
        //
        $code = rand(111111, 999999);

        $otp = [
            "email" => $data['email'],
            "optCode" => Hash::make($code)
        ];

        OtpCode::where('email', $data['email'])->delete();
        OtpCode::create($otp);
        User::create($data);
        Mail::to($data['email'])->send(new VerificationMail($data['email'], $data['name'], $code));
    }

    public function login(array $data)
    {

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return false;
        }

        if (!Hash::check($data['password'], $user->password)) {
            return false;
        }


        $user->tokens()->delete();
        // $user->token = $user->createToken($user->id)->plainTextToken;

        $token = $user->createToken($user->id)->plainTextToken;

        // return $user;
        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
