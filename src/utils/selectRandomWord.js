import { words } from "@/data/words";

export function selectRandomWord(){
    const randomIndex = Math.floor(Math.random() * words.length);

    return words[randomIndex].toUpperCase();
}