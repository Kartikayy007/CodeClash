type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface ProblemWithDifficulty {
    difficulty?: Difficulty;
}

const difficultyOrder: Record<Difficulty, number> = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
};

export function sortProblemsByDifficulty<T extends ProblemWithDifficulty>(problems: T[]): T[] {
    return [...problems].sort((a, b) => {
        if (a.difficulty && b.difficulty) {
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        if (a.difficulty && !b.difficulty) return -1;
        if (!a.difficulty && b.difficulty) return 1;
        return 0;
    });
}