import {words} from "@/data/words";

export function isSaneGuess(word: string) {
    return words.includes(word.toLowerCase());
}