import {words} from "@/data/words";

export function isSaneGuess(word) {
    return words.includes(word.toLowerCase());
}