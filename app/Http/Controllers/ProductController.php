<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductUpdateRequest;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = intval($request->query('per_page', 10));
        $perPage = min($perPage, 100);

        $products = Product::with('category')
            ->when($request->category_id, function ($query, $categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->when($request->search, function ($query, $search) {
                $search = mb_strtolower($search, 'UTF-8');
                $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
            })
            ->paginate($perPage);
        return $products->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductCreateRequest $request)
    {
        $validated = $request->validated();
        $product = Product::create($validated);
        return $product->toResource();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Product::with('category')->findOrFail($id)->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateRequest $request, string $id)
    {
        $validated = $request->validated();
        $product = Product::findOrFail($id);
        $product->update($validated);
        return $product->toResource();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
