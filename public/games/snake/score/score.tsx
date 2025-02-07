import { getScoreValue } from '../src/components/GameOverScreen'; // Adjust the path as necessary

// Function to get the score
export const getScore = () => {
    return getScoreValue(); // Call the function to return the score value
};

// Now you can use getScore in this file
console.log("Score from GameOverScreen:", getScore()); // This will log the score correctly

export default getScore;