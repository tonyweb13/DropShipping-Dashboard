<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // User::insert([[
        //     'first_name' => 'Test',
        //     'last_name' => 'Client',
        //     'email' => 'client@email.com',
        //     'password' => Hash::make('password'),
        //     'is_admin' => 0
        // ],[
        //     'first_name' => 'Test',
        //     'last_name' => 'Admin',
        //     'email' => 'admin@email.com',
        //     'password' => Hash::make('password'),
        //     'is_admin' => 1
        // ]]);
        User::insert([
            'first_name' => 'Moerie',
            'last_name' => 'Moerie',
            'email' => 'moerie@email.com',
            'password' => Hash::make('Moerie'),
            'is_admin' => 0
        ]);
    }
}
