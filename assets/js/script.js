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
            {src: "assets/img/hewan/kucing.jpg", answers: ["kucing"]},
            {src: "assets/img/hewan/buaya.jpg", answers: ["buaya"]},
            {src: "assets/img/hewan/jerapah.jpg", answers: ["jerapah"]},
            {src: "assets/img/hewan/kangguru.jpg", answers: ["kangguru"]},
            {src: "assets/img/hewan/kuda.jpg", answers: ["kuda"]},
            {src: "assets/img/hewan/harimau.jpg", answers: ["harimau"]},
            {src: "assets/img/hewan/rusa.jpg", answers: ["rusa"]},
            {src: "assets/img/hewan/anjing.jpg", answers: ["anjing"]},
            {src: "assets/img/hewan/kudanil.jpg", answers: ["kuda nil","kudanil"]},
            {src: "assets/img/hewan/singa.jpg", answers: ["singa"]},
        ],
        buah: [
            {src: "assets/img/buah/apel.jpg", answers: ["apel"]},
            {src: "assets/img/buah/nanas.jpg", answers: ["nanas"]},
            {src: "assets/img/buah/melon.jpg", answers: ["melon"]},
            {src: "assets/img/buah/pisang.jpg", answers: ["pisang"]},
            {src: "assets/img/buah/anggur.jpg", answers: ["anggur"]},
            {src: "assets/img/buah/mangga.jpg", answers: ["mangga"]},
            {src: "assets/img/buah/semangka.jpg", answers: ["semangka"]},
            {src: "assets/img/buah/alpukat.jpg", answers: ["alpukat"]},
            {src: "assets/img/buah/strawberry.jpg", answers: ["strawberry"]},
            {src: "assets/img/buah/jeruk.jpg", answers: ["jeruk"]},
        ],
        pekerjaan: [
            {src: "assets/img/pekerjaan/pemadam.jpg", answers: ["pemadam kebakaran","pemadam"]},
            {src: "assets/img/pekerjaan/koki.jpg", answers: ["koki","chef" ]},
            {src: "assets/img/pekerjaan/dokter.jpg", answers: ["dokter", "dokter hewan"]},
        ],
    };

    const userAnswer = document.getElementById("userAnswer");
    const submitAnswer = document.getElementById("submitAnswer");
    const backToHome = document.getElementById("backToHome");

    let hasAnswered = false;
    let score = 0;

    function showModal(message, callback) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        const modalOkButton = document.getElementById('modalOkButton');
    
        modalMessage.textContent = message;
        modal.style.display = 'flex';
    
        // Definisikan handler DULU
        function modalOkButtonClickHandler() {
            modal.style.display = 'none';
            if (typeof callback === 'function') {
                callback(); // panggil hanya jika callback valid
            }
        }
        modalOkButton.replaceWith(modalOkButton.cloneNode(true)); // Cara instan untuk hapus semua event listener
        const newModalOkButton = document.getElementById('modalOkButton');
        newModalOkButton.addEventListener('click', modalOkButtonClickHandler);
    }

    function showToast(playerAnswer, correctAnswer) {
        const toast = document.getElementById('customToast');
        const toastBody = document.getElementById('toastBody');

        let isCorrect = playerAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
        let message = `Jawaban Anda: <strong>${playerAnswer}</strong><br>`;

        if (isCorrect) {
            message += `<span style="color: #c8ffcc;">✅ Jawaban Anda benar!</span>`;
            toast.classList.remove("bg-danger");
            toast.classList.add("bg-success");
        } else {
            message += `<span style="color: #ffcccc;">❌ Jawaban yang benar: <strong>${correctAnswer}</strong></span>`;
            toast.classList.remove("bg-success");
            toast.classList.add("bg-danger");
            wrongAnswerSound.play();
        }

        toastBody.innerHTML = message;

        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
        toastBootstrap.show();
    }

    submitAnswer.addEventListener("click", function () {
        if (hasAnswered) return;

        const currentData = imagesAndAnswers[category][currentImageIndex];
        const playerAnswer = userAnswer.value.trim();

        if (playerAnswer === "") return;
    });

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
                
        // Play score sound
        const endGameSound = document.getElementById('endgamedSound');
        endGameSound.currentTime = 0;
        endGameSound.play();


                showModal(`Selesai! Total skor anda: ${score}`, () => {
            // When OK is clicked, go back to home
            backToHome.click();
        });

        return; // Don't do anything further, waiting for OK click to go back
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
                    showModal("Puzzle selesai! Silakan jawab nama gambar.");
                    userAnswer.disabled = false; // Enable input when puzzle is solved
                    userAnswer.focus();
                }, 300);
            }
        }

        // Event listener untuk tombol cek jawaban
        submitAnswer.addEventListener("click", checkAnswer);

        if (playerAnswer === "") return;
        function checkAnswer() {
            if (hasAnswered) return;

            const answer = userAnswer.value.trim().toLowerCase();

            if (answer === "") {
                showModal("Silakan Selesaikan puzzle terlebih dahulu dan pasti kan untuk mengisi jawaban!");
                userAnswer.focus();
                return;
            }

            const correctAnswers = imagesAndAnswers[category][currentImageIndex].answers;
            let correctAnswer = correctAnswers[0];
            if (correctAnswers.includes(answer)) {
                correctAnswer = answer;
            }

            hasAnswered = true;
            userAnswer.disabled = true;
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
                showToast(answer, correctAnswer);
                currentImageIndex++;
                document.getElementById("score").textContent = `Score: ${score}`;
                setTimeout(() => {
                    loadNextImage();
            }, 3000);
            } else {
                // Play wrong answer sound
                wrongAnswerSound.currentTime = 0; // Reset sound to beginning
                wrongAnswerSound.play().catch(function(error) {
                    console.log('Sound play prevented: ' + error);
                });

                showToast(answer, correctAnswer);
                    currentImageIndex++;
                        setTimeout(() => {
                        loadNextImage();
                }, 1000);
            }
        }

    }
});
