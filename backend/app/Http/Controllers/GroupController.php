<?php

namespace App\Http\Controllers;

use App\Interfaces\GroupInterface;
use App\Models\Group;
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
        $groups = Group::all();

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

        if ($request->hasFile("file")) {
            move_uploaded_file($_FILES['file']['tmp_name'], 'db/groupProfile/' . $_FILES['file']['name']);
            $image = $_FILES['file']['name'];
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
