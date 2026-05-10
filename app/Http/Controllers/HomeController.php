<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller 
{
    public function index()
    {
        return Inertia::render('Welcome');
    }

    public function productPage(int $id)
    {
        return Inertia::render('product/Show', ['id' => $id]);
    }

    public function edit(int $id)
    {
        return Inertia::render('admin/products/Form', ['id' => $id]);
    }
}