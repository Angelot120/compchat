<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string("email")->email();
            $table->boolean("is_admin")->default(false);
            $table->integer("group_id")->unsigned();
            $table->foreign('group_id')->references('id')->on('groups');
            $table->timestamps();
        });


        // For mySQL


        /*

            Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string("email");
            $table->boolean("is_admin")->default(false);
            $table->unsignedBigInteger("group_id");
            $table->foreign('group_id')->references('id')->on('groups');
            $table->timestamps();
        });

        */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
