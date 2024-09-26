<?php

namespace App\Repositories;

use App\Interfaces\MemberInterface;
use App\Mail\InvitationMail;
use App\Mail\NewMemberMail;
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
            $allMembers = Member::where("group_id", $data['group_id'])->get();
            if ($groupId) {

                $group = $groupId->name;
                $member = Member::create($data);
                Mail::to($data['email'])->send(new InvitationMail($data['email'], $group));

                try {
                    foreach ($allMembers as $existingMember) {

                        Mail::to($existingMember->email)->send(new NewMemberMail($existingMember->email, $group));
                    }
                } catch (\Exception $e) {
                    return false;
                }
                return $member;
            } else {
                return false;
            }
        }
        return false;
    }
}
