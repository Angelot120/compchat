<?php

namespace App\Repositories;

use App\Interfaces\CheckOtpCodeInterface;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CheckOtpCodeRepository implements CheckOtpCodeInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function check($data)
    {

        $otpCode = OtpCode::where('email', $data['email'])->first();

        if (!$otpCode)
            return false;

        if (Hash::check($data['otpCode'], $otpCode['otpCode'])) {
        // if (OtpCode::where("otpCode", $data['otpCode'])) {

            $user = User::where('email', $data['email'])->first();
            $user->update(['verified' => true]);
            $otpCode->delete();

            $user->token = $user->createToken($user->id)->plainTextToken;

            return $user;
        }

        return false;
    }
}
