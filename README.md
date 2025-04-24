# Tebak Gambar Puzzle Game

## Sound Implementation

This game now includes sound effects for a more immersive experience:

1. Background music in the main menu
2. Game start sound when a new puzzle is loaded
3. Puzzle solved sound when the puzzle is completed
4. Correct answer sound when the user provides the correct answer
5. Wrong answer sound when the user provides an incorrect answer

## Audio Files

You need to add your own audio files to the `assets/audio` directory:

1. `background_music.mp3` - Background music for the main menu
2. `game_start.mp3` - Sound played when a new puzzle is loaded
3. `puzzle_solved.mp3` - Sound played when the puzzle is solved
4. `correct_answer.mp3` - Sound played when the answer is correct
5. `wrong_answer.mp3` - Sound played when the answer is wrong

You can find free sound effects and music on websites like:
- [Freesound](https://freesound.org/)
- [Pixabay](https://pixabay.com/sound-effects/)
- [Soundbible](http://soundbible.com/)

## Notes

- Most browsers require user interaction before playing audio. If the sounds don't play automatically, add a button to start the audio.
- The volume of the background music is set to 50% by default. You can adjust this in the JavaScript code.
