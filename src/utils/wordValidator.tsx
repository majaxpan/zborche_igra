import {words} from "@/data/words";

export function isValidWord(word) {
    return words.includes(word.toLowerCase());
}