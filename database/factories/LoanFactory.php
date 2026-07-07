<?php

namespace Database\Factories;

use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Loan>
 */
class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $today = '2026-07-07';
        $borrowedAt = Carbon::instance(fake()->dateTimeBetween("{$today} 07:00:00", "{$today} 19:00:00"));
        $isReturned = fake()->boolean(60);

        $statuses = ['borrowed', 'returned', 'not_returned', 'damaged', 'lost'];
        $status = $isReturned
            ? fake()->randomElement(['returned', 'not_returned'])
            : fake()->randomElement(['borrowed']);

        $conditions = ['good', 'minor_damage', 'damaged', 'missing_parts', 'lost'];

        $maxReturn = $borrowedAt->copy()->addHours(3);
        $cap = $borrowedAt->copy()->setTime(20, 0, 0);
        if ($maxReturn->gt($cap)) {
            $maxReturn = $cap;
        }

        return [
            'game_id' => \App\Models\Game::inRandomOrder()->first()?->id ?? 1,
            'borrower_name' => fake()->name(),
            'borrowed_at' => $borrowedAt,
            'returned_at' => $isReturned
                ? fake()->dateTimeBetween($borrowedAt->toDateTimeString(), $maxReturn->toDateTimeString())
                : null,
            'status' => $status,
            'notes' => fake()->optional(0.4)->sentence(),
            'return_condition' => $isReturned ? fake()->randomElement($conditions) : null,
            'missing_components' => $isReturned && fake()->boolean(20)
                ? fake()->sentence(3)
                : null,
            'fine_amount' => $isReturned && fake()->boolean(25)
                ? fake()->randomFloat(2, 5000, 100000)
                : null,
        ];
    }
}
