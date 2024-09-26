<?php

namespace App\Repositories;

use App\Interfaces\ChatInterface;
use App\Mail\ChatMail;
use App\Mail\testMail;
use App\Models\Chat;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class ChatRepository implements ChatInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function send(array $data, bool $hasFile, string $fileType)
    {
        $chat = Chat::create($data);

        if ($hasFile) {

            $sender = User::find($data['user_id']);

            $members = Member::where("group_id", $data['group_id'])->get();

            $group = Group::find($data['group_id']);

            if (!$sender || !$members->isNotEmpty() || !$group)
                return false;

            foreach ($members as $member) {
                // $receiver = User::where("id", $member->user_id)->first();
                // $receiver = User::where("email", $member->email)->first();
                $receiver = $member->email;
                if ($receiver) {
                    try {
                        // Mail::to($receiver)->send(new testMail());
                        // Mail::to($receiver)->send(new ChatMail($sender->email, $fileType, $sender->name, $group->name, $receiver->name));
                        Mail::to($receiver->email)->send(new ChatMail($sender->email, $fileType, $sender->name, $group->name, $receiver->name));

                        // Mail::to($receiver)->send(new ChatMail("sender->email", "fileType", "sender->name", "group->name", "receiver->name"));
                    } catch (\Exception $e) {
                        // Log::error('Mail sending failed: ' . $e->getMessage());
                        return false;
                    }
                } else {
                    Log::warning('Receiver not found for member email: ' . $member->email);
                    return false;
                }
            }
        }

        return $chat;
    }

    // public function send(array $data, bool $hasFile, string $fileType)
    // {
    //     $chat = Chat::create($data);

    //     if ($hasFile) {
    //         $sender = User::where("id", $data['user_id'])->first();
    //         $members = Member::where("group_id", $data['group_id'])->get();
    //         $group = Group::where("id", $data['group_id'])->first();

    //         foreach ($members as $member) {
    //             $receiver = User::where("id", $member->user_id)->first();
    //             if ($receiver) {
    //                 try {
    //                     Mail::to($receiver->email)->send(new ChatMail($sender->email, $fileType, $sender->name, $group->name, $receiver->name));
    //                 } catch (\Exception $e) {
    //                     \Log::error('Erreur lors de l\'envoi de l\'email : ' . $e->getMessage());
    //                 }
    //             }
    //         }
    //     }

    //     return $chat;
    // }
}
