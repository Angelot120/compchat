<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckOtpCodeRequest;
use App\Interfaces\CheckOtpCodeInterface;
use App\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChekOtpCodeController extends Controller
{
    private CheckOtpCodeInterface $checkOtpCodeInterface;
    public function __construct(CheckOtpCodeInterface $checkOtpCodeInterface)
    {
        $this->checkOtpCodeInterface = $checkOtpCodeInterface;
    }

    public function check(CheckOtpCodeRequest $checkOtpCodeRequest)
    {
        $data = [
            "email" => $checkOtpCodeRequest->email,
            "otpCode" => $checkOtpCodeRequest->otpCode,
        ];

        DB::beginTransaction();

        try {
            $verified = $this->checkOtpCodeInterface->check($data);

            DB::commit();

            if (!$verified) {
                return ApiResponse::sendResponse(
                    false,
                    [],
                    'Code de vérification invalide.',
                    400
                );
            }

            return ApiResponse::sendResponse(
                true,
                [$verified],
                'Bienvenue.',
                200
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return ApiResponse::rollback($th);
        }
    }
}
