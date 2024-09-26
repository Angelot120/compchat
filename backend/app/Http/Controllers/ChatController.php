<?php

namespace App\Http\Controllers;

use App\Interfaces\ChatInterface;
use App\Models\Chat;
use App\Models\Group;
use App\Models\User;
use App\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    //
    private ChatInterface $chatInterface;
    public function __construct(ChatInterface $chatInterface)
    {
        $this->chatInterface = $chatInterface;
    }



    public function send(Request $request)
    {
        $userId = auth()->id();

        $hasFile = false;
        $fileType = "";
        $filePath = "";


        if ($request->hasFile("chat")) {
            $file = $request->file("chat");
            $fileExtension = $file->getClientOriginalExtension();

            if (in_array($fileExtension, ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'])) {
                $fileType = "image";
                $filePath = 'db/files/images/' . $file->getClientOriginalName();
            } elseif ($fileExtension === 'pdf') {
                $fileType = "pdf";
                $filePath = 'db/files/pdfs/' . $file->getClientOriginalName();
            } elseif (in_array($fileExtension, ['doc', 'docx'])) {
                $fileType = "document";
                $filePath = 'db/files/docs/' . $file->getClientOriginalName();
            } elseif ($fileExtension === 'pptx') {
                $fileType = "presentation";
                $filePath = 'db/files/pptx/' . $file->getClientOriginalName();
            } elseif ($fileExtension === 'xlsx') {
                $fileType = "excel";
                $filePath = 'db/files/excels/' . $file->getClientOriginalName();
            } else {
                return response()->json(['error' => 'Type de fichier non autorisé'], 400);
            }


            $file->move(public_path(dirname($filePath)), $file->getClientOriginalName());



            $data = [
                "chat" => $filePath,
                "group_id" => $request->group_id,
                "user_id" => $userId,
            ];

            $hasFile = true;
        } else {
            $data = [
                "chat" => $request->chat,
                "group_id" => $request->group_id,
                "user_id" => $userId,
            ];
        }



        /*if ($request->hasFile('chat')) {
            $request->validate([
                'chat' => 'required|file|mimes:jpeg,png,jpg,gif,pdf',
            ]);

            $path = $request->file('chat')->store('files', 'public');
            $data = [
                "chat" => $path,
                "group_id" => $request->group_id,
                "user_id" => $userId,
            ];
        } else {
            $data = [
                "chat" => $request->chat,
                "group_id" => $request->group_id,
                "user_id" => $userId,
            ];
        }*/


        DB::beginTransaction();

        try {
            $chat = $this->chatInterface->send($data, $hasFile, $fileType);
            DB::commit();

            if (!$chat) {
                return ApiResponse::sendResponse(
                    false,
                    [],
                    'Le message n\'a pas pue être envoyé.',
                    400
                );
            }

            return ApiResponse::sendResponse(
                true,
                [$chat],
                'chat envoyé avec succès.',
                200
            );
        } catch (\Throwable $th) {
            return ApiResponse::rollback($th);
        }
    }

    public function show($id)
    {
        $userId = auth()->id();
        $senders = [];

        $group = Group::find($id);

        $chats = Chat::where("group_id", $group->id)->get();

        foreach ($chats as $chat) {
            $senders[] = User::find($chat->user_id);
        }

        try {
            DB::commit();

            if (!$chats) {
                return ApiResponse::sendResponse(
                    false,
                    [],
                    'Le message n\'a pas pue être envoyé.',
                    400
                );
            }

            return ApiResponse::sendResponse(
                true,
                [
                    "chats" => $chats,
                    "userId" => $userId,
                    "senders" => $senders
                ],
                'Chat récupéré avec succès.',
                200
            );
        } catch (\Throwable $th) {
            return ApiResponse::rollback($th);
        }
    }
}
