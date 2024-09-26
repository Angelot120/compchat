<?php

namespace App\Repositories;

use App\Interfaces\GroupInterface;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;

class GroupRepository implements GroupInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create(array $data)
    {
        $user = auth()->id();
        $userMail = User::find($user)->email;

        $group = Group::create($data);

        $memberData = [
            "email" => $userMail,
            "group_id" => $group->id,
            "is_admin" => true
        ];

        Member::create($memberData);
    }

    public function add(array $data) {}
}
