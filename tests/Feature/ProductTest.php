<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authorized user can create a product', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $payload = [
        'name' => 'Новый iPhone',
        'price' => 999.99,
        'description' => 'Лучший смартфон',
        'category_id' => $category->id,
    ];

    $response = $this->actingAs($user)
        ->postJson('/api/products', $payload);

    $response->assertStatus(201);

    $this->assertDatabaseHas('products', [
        'name' => 'Новый iPhone',
        'price' => 999.99,
    ]);
});

test('unauthorized user cannot create a product', function () {
    $response = $this->postJson('/api/products', [
        'name' => 'Hacker product'
    ]);

    $response->assertStatus(401);
});

test('authorized user can update a product', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = \App\Models\Product::factory()->create([
        'category_id' => $category->id,
    ]);

    $payload = [
        'name' => 'Обновленный iPhone',
        'price' => 899.99,
        'category_id' => $category->id,
        'description' => 'Обновленное описание',
    ];

    $response = $this->actingAs($user)
        ->patchJson("/api/products/{$product->id}", $payload);

    $response->assertStatus(200);

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Обновленный iPhone',
        'price' => 899.99,
        'category_id' => $category->id,
        'description' => 'Обновленное описание',
    ]);
});

test('unauthorized user cannot update a product', function () {
    $category = Category::factory()->create();
    $product = \App\Models\Product::factory()->create([
        'category_id' => $category->id,
        'description' => 'Описание товара',
        'price' => 999.99,
        'name' => 'iPhone',
    ]);

    $response = $this->patchJson("/api/products/{$product->id}", [
        'id' => $product->id,
        'name' => 'Обновленный iPhone',
        'price' => 899.99,
        'category_id' => $category->id,
        'description' => 'Обновленное описание',
    ]);

    $response->assertStatus(401);
});