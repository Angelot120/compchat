<?php

namespace App\Repositories;

use App\Interfaces\GroupInterface;
use App\Models\Group;

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
        Group::create($data);
    }

    public function add(array $data) {}
}
