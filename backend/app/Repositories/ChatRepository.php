<?php

namespace App\Repositories;

use App\Interfaces\ChatInterface;
use App\Models\Chat;

class ChatRepository implements ChatInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function send(array $data)
    {
        $chat = Chat::create($data);

        return $chat;
    }
}
