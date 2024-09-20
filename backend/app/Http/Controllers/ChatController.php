<?php

namespace App\Http\Controllers;

use App\Interfaces\ChatInterface;
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

        $data = [
            "chat" => $request->chat,
            "group_id" => $request->group_id,
            "user_id" => $userId,
        ];

        DB::beginTransaction();

        try {
            $chat = $this->chatInterface->send($data);
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
}
