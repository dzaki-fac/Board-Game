<?php

namespace Database\Factories;

use App\Models\Game;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Loan>
 */
class LoanFactory extends Factory
{
    private static array $gameLoanCounts = [];

    public function definition(): array
    {
        $today = '2026-07-07';
        $borrowedAt = Carbon::instance(fake()->dateTimeBetween("{$today} 07:00:00", "{$today} 19:00:00"));

        $conditions = ['good', 'minor_damage', 'damaged', 'missing_parts', 'lost'];

        $maxReturn = $borrowedAt->copy()->addHours(3);
        $cap = $borrowedAt->copy()->setTime(20, 0, 0);
        if ($maxReturn->gt($cap)) {
            $maxReturn = $cap;
        }

        [$game, $isReturned] = $this->pickGame();

        $status = $isReturned
            ? fake()->randomElement(['returned', 'not_returned'])
            : 'borrowed';

        return [
            'boardgame_id' => $game->id,
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

    private function pickGame(): array
    {
        if (empty(self::$gameLoanCounts)) {
            self::$gameLoanCounts = Game::pluck('available_copies', 'id')->toArray();
        }

        $availableForBorrow = array_keys(array_filter(self::$gameLoanCounts, fn ($count) => $count > 0));

        if (empty($availableForBorrow)) {
            $gameId = fake()->randomElement(array_keys(self::$gameLoanCounts));
            return [Game::find($gameId), true];
        }

        $isReturned = fake()->boolean(60);

        if ($isReturned) {
            $gameId = fake()->randomElement(array_keys(self::$gameLoanCounts));
            return [Game::find($gameId), true];
        }

        $gameId = fake()->randomElement($availableForBorrow);
        self::$gameLoanCounts[$gameId]--;

        return [Game::find($gameId), false];
    }

    public static function resetCopyCounts(): void
    {
        self::$gameLoanCounts = [];
    }
}
