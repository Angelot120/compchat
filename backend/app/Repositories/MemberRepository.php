<?php

namespace App\Repositories;

use App\Interfaces\MemberInterface;
use App\Mail\InvitationMail;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class MemberRepository implements MemberInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create($data)
    {

        $member = Member::where("email", $data["email"])
            ->where("group_id", $data["group_id"])
            ->first();

        if (!$member) {
            $groupId = Group::find($data["group_id"]);
            $group = $groupId->name;
            $member = Member::create($data);
            Mail::to($data['email'])->send(new InvitationMail($data['email'], $group));
            return $member;
        }
        return false;
    }
}
