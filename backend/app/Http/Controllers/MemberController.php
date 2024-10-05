<?php

namespace App\Http\Controllers;

use App\Interfaces\MemberInterface;
use App\Models\Member;
use App\Models\User;
use App\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    //
    private MemberInterface $memberInterface;

    public function __construct(MemberInterface $memberInterface)
    {
        $this->memberInterface = $memberInterface;
    }

    public function create(Request $request)
    {
        $user = User::where("email", $request->email)->first();

        if (!$user) {
            $email = $request->email;
        } else {
            $email = $user->email;
        }

        $data = [

            "email" => $email,
            "group_id" => $request->groupId,
        ];


        DB::beginTransaction();
        try {

            $member = $this->memberInterface->create($data);
            DB::commit();

            if (!$member) {
                return ApiResponse::sendResponse(
                    false,
                    [],
                    'Cet email exite déjà.',
                    400
                );
            }

            return ApiResponse::sendResponse(
                true,
                [$member],
                'Menbre créé avec succès !.',
                200
            );
        } catch (\Throwable $th) {
            return ApiResponse::rollback($th);
        }
    }


    public function show($id)
    {

        $members = Member::where('group_id', $id)->get();

        if (!$members) {
            return ApiResponse::sendResponse(
                false,
                [],
                'Impossible de récupérer les membres de ce groupe.',
                400
            );
        }

        return ApiResponse::sendResponse(
            true,
            [$members],
            'Menbres récupéré avec succès !.',
            200
        );
    }
}
