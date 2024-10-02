<?php

namespace App\Http\Controllers;

use App\Interfaces\GroupInterface;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;
use App\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    //
    private GroupInterface $groupInterface;

    public function __construct(GroupInterface $groupInterface)
    {
        $this->groupInterface = $groupInterface;
    }

    public function index()
    {

        $user = auth()->id();
        $userMail = User::find($user)->email;

        $members = Member::where("email", $userMail)->get();
        $groupIds = $members->pluck('group_id');
        $groups = Group::whereIn('id', $groupIds)->get();

        // $groups = Group::where("user_id", $user)->get();

        // foreach($members as $member){

        // }

        return ApiResponse::sendResponse(
            true,
            [$groups],
            'opération effectuée.',
            200
        );
    }

    public function show($id)
    {
        $group = Group::find($id);

        return ApiResponse::sendResponse(
            true,
            [$group],
            'opération effectuée.',
            200
        );
    }




    public function create(Request $request)
    {

        $userId = auth()->id();

        // if ($request->hasFile('image')) {
        //     move_uploaded_file($_FILES['image']['tmp_name'], 'db/groupProfile/' . $_FILES['image']['name']);
        //     $image = $_FILES['image']['name'];
        // } else {
        //     $image = '';
        // }


        if ($request->hasFile('image')) {
            move_uploaded_file($_FILES['image']['tmp_name'], 'db/groupProfile/' . $_FILES['image']['name']);
            $image = $_FILES['image']['name'];
        } else {
            $image = '';
        }



        $data = [
            "image" => $image,
            "name" => $request->name,
            "description" => $request->description,
            "user_id" => $userId,
        ];

        DB::beginTransaction();
        try {

            $this->groupInterface->create($data);
            DB::commit();

            return ApiResponse::sendResponse(
                true,
                [],
                'opération effectuée.',
                200
            );
        } catch (\Throwable $th) {
            return ApiResponse::rollback($th);
        }
    }
}
