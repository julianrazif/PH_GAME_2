document.addEventListener('DOMContentLoaded', function () {

    // Get the category parameter from URL
    const category = getUrlParameter('category');
    // Get the h1 element in the text div
    const headingElement = document.querySelector('.text h1');
    // Get the board element
    const board = document.getElementById("puzzle-board");
    let draggedPiece = null;
    let currentImageIndex = 0;

    // Get audio elements
    const gameStartSound = document.getElementById('gameStartSound');
    const correctAnswerSound = document.getElementById('correctAnswerSound');
    const wrongAnswerSound = document.getElementById('wrongAnswerSound');
    const puzzleSolvedSound = document.getElementById('puzzleSolvedSound');

    const imagesAndAnswers = {
        hewan: [
            {src: "assets/img/hewan/kucing.jpg", answers: ["kucing", "cat"]},
            {src: "assets/img/hewan/buaya.jpg", answers: ["buaya", "crocodile"]},
            {src: "assets/img/hewan/jerapah.jpg", answers: ["jerapah", "giraffe"]},
            {src: "assets/img/hewan/rusa.jpg", answers: ["rusa", "deer"]},
            {src: "assets/img/hewan/singa.jpg", answers: ["singa", "lion"]},
        ],
        buah: [
            {src: "assets/img/buah/apel.jpg", answers: ["apel", "apple"]},
            {src: "assets/img/buah/nanas.jpg", answers: ["nanas", "pineapple"]},
            {src: "assets/img/buah/melon.jpg", answers: ["melon", "melon"]},
            {src: "assets/img/buah/pisang.jpg", answers: ["pisang", "banana"]},
            {src: "assets/img/buah/anggur.jpg", answers: ["anggur", "grapes"]},
        ],
        pekerjaan: [
            // No images available for this category yet
        ],
    };

    const userAnswer = document.getElementById("userAnswer");
    const submitAnswer = document.getElementById("submitAnswer");
    const backToHome = document.getElementById("backToHome");

    let hasAnswered = false;
    let score = 0;

    // Update the heading based on the category
    if (headingElement) {
        if (category === 'hewan') {
            headingElement.textContent = 'Tebak Nama Hewan';
        } else if (category === 'buah') {
            headingElement.textContent = 'Tebak Nama Buah';
        } else if (category === 'pekerjaan') {
            headingElement.textContent = 'Tebak Nama Pekerjaan';
        } else {
            // Default text if no category or unknown category
            headingElement.textContent = 'Tebak Gambar';
        }
    }

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Check if the category exists and has images
    if (category && imagesAndAnswers[category] && imagesAndAnswers[category].length > 0) {
        // shuffle the images and answers
        shuffleArray(imagesAndAnswers[category]);

        function loadNextImage() {
            if (currentImageIndex >= imagesAndAnswers[category].length) {
                // Stop the game start sound when all puzzles are completed
                gameStartSound.pause();
                gameStartSound.currentTime = 0;
                gameStartSound.loop = false;

                alert("Gambar sudah selesai!");
                backToHome.click();
                return;
            }

            const currentImage = imagesAndAnswers[category][currentImageIndex];

            console.log(currentImage.src);

            // Stop any existing game start sound before starting a new one
            gameStartSound.pause();
            gameStartSound.currentTime = 0;

            // Play game start sound
            gameStartSound.loop = true; // Make the sound loop continuously
            gameStartSound.play().catch(function(error) {
                console.log('Sound play prevented: ' + error);
            });

            setupPuzzle(currentImage.src);

            hasAnswered = false;

            userAnswer.value = "";
            userAnswer.disabled = true; // Disable input by default until puzzle is solved
            userAnswer.focus();
        }

        // start the game
        loadNextImage();

        // add event listener to the backToHome button
        backToHome.addEventListener("click", function () {
            // Stop the game start sound before navigating back to home
            gameStartSound.pause();
            gameStartSound.currentTime = 0;
            gameStartSound.loop = false;

            window.location.href = "index.html";
        });

        function setupPuzzle(imagePath) {
            board.innerHTML = "";
            const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            shuffleArray(indices);
            indices.forEach((index, i) => {
                const piece = document.createElement("div");
                piece.classList.add("puzzle-piece");
                piece.setAttribute("data-position", index); // posisi aslinya
                piece.setAttribute("data-index", i); // posisi sekarang
                piece.style.backgroundImage = `url('${imagePath}')`;
                piece.setAttribute("draggable", true);
                piece.style.backgroundPosition = getBackgroundPosition(index);

                addDragEvents(piece);
                board.appendChild(piece);
            });
        }

        function getBackgroundPosition(index) {
            switch (index) {
                case 0: return "0% 0%";
                case 1: return "50% 0%";
                case 2: return "100% 0%";
                case 3: return "0% 50%";
                case 4: return "50% 50%";
                case 5: return "100% 50%";
                case 6: return "0% 100%";
                case 7: return "50% 100%";
                case 8: return "100% 100%";
            }
        }

        function addDragEvents(piece) {
            piece.addEventListener("dragstart", (e) => {
                draggedPiece = e.target;
            });

            piece.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            piece.addEventListener("drop", (e) => {
                e.preventDefault();
                const target = e.target;

                if (draggedPiece && draggedPiece !== target) {
                    const draggedIndex = draggedPiece.getAttribute("data-index");
                    const targetIndex = target.getAttribute("data-index");

                    // Tukar elemen di DOM
                    const temp = document.createElement("div");
                    board.insertBefore(temp, draggedPiece);
                    board.insertBefore(draggedPiece, target);
                    board.insertBefore(target, temp);
                    board.removeChild(temp);

                    // Update data-index
                    draggedPiece.setAttribute("data-index", targetIndex);
                    target.setAttribute("data-index", draggedIndex);
                }

                checkPuzzleSolved();
            });
        }

        function checkPuzzleSolved() {
            const pieces = document.querySelectorAll(".puzzle-piece");
            const sorted = Array.from(pieces).sort(
                (a, b) => parseInt(a.getAttribute("data-index")) - parseInt(b.getAttribute("data-index"))
            );

            const isCorrect = sorted.every((piece, index) => {
                return parseInt(piece.getAttribute("data-position")) === index;
            });

            if (isCorrect) {
                // Stop the game start sound when puzzle is solved
                gameStartSound.pause();
                gameStartSound.currentTime = 0;
                gameStartSound.loop = false;

                // Play puzzle solved sound
                puzzleSolvedSound.currentTime = 0; // Reset sound to beginning
                puzzleSolvedSound.play().catch(function(error) {
                    console.log('Sound play prevented: ' + error);
                });

                // Stop the puzzle solved sound after 3 seconds
                setTimeout(function() {
                    puzzleSolvedSound.pause();
                    puzzleSolvedSound.currentTime = 0;
                }, 3000);

                setTimeout(() => {
                    alert("Puzzle selesai! Silakan jawab nama gambar.");
                    userAnswer.disabled = false; // Enable input when puzzle is solved
                    userAnswer.focus();
                }, 300);
            }
        }

        // Event listener untuk tombol cek jawaban
        submitAnswer.addEventListener("click", checkAnswer);

        function checkAnswer() {
            if (hasAnswered) return;

            const answer = userAnswer.value.trim().toLowerCase();

            if (answer === "") {
                alert("Silakan masukkan jawaban terlebih dahulu!");
                userAnswer.focus();
                return;
            }

            const correctAnswers = imagesAndAnswers[category][currentImageIndex].answers;
            let correctAnswer = correctAnswers[0];
            if (correctAnswers.includes(answer)) {
                correctAnswer = answer;
            }

            if (correctAnswers.includes(answer)) {
                // Play correct answer sound
                correctAnswerSound.currentTime = 0; // Reset sound to beginning
                correctAnswerSound.play().catch(function(error) {
                    console.log('Sound play prevented: ' + error);
                });

                // Stop the correct answer sound after 3 seconds
                setTimeout(function() {
                    correctAnswerSound.pause();
                    correctAnswerSound.currentTime = 0;
                }, 3000);

                score += 10;
                alert(`✅ Jawaban Benar success ${correctAnswer} ${answer}`);
                userAnswer.disabled = true;
                hasAnswered = true;
                currentImageIndex++;
                loadNextImage();
            } else {
                // Play wrong answer sound
                wrongAnswerSound.currentTime = 0; // Reset sound to beginning
                wrongAnswerSound.play().catch(function(error) {
                    console.log('Sound play prevented: ' + error);
                });

                alert(`❌ Jawaban Salah error ${correctAnswer} ${answer}`);
                hasAnswered = false;
                userAnswer.disabled = false;
                userAnswer.focus();
            }
        }

    }
});
