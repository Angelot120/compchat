<?php

namespace App\Interfaces;

interface ChatInterface
{
    public function send(array $data, bool $hasFile, string $fileType);
}
