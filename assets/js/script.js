document.addEventListener('DOMContentLoaded', function () {

    // Get the category parameter from URL
    const category = getUrlParameter('category');
    // Get the h1 element in the text div
    const headingElement = document.querySelector('.text h1');
    // Get the board element
    const board = document.getElementById("puzzle-board");
    let draggedPiece = null;
    let currentImageIndex = 0;

    // const gameImage = document.getElementById("gameImage");

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

    const backToHome = document.getElementById("backToHome");

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
                return;
            }

            const currentImage = imagesAndAnswers[category][currentImageIndex];
            // gameImage.src = currentImage.src;

            console.log(currentImage.src);

            setupPuzzle(currentImage.src);

            // Add error handling for image loading
            // gameImage.onerror = function() {
            //     console.error("Failed to load image:", currentImage.src);
            //     // Try to load next image or show a placeholder
            //     currentImageIndex++;
            //     if (currentImageIndex < imagesAndAnswers[category].length) {
            //         loadNextImage();
            //     } else {
            //         // If all images fail, set a default image or show an error message
            //         gameImage.src = "assets/img/error_not_found.jpg";
            //     }
            // };
        }

        // start the game
        loadNextImage();

        // add event listener to the backToHome button
        backToHome.addEventListener("click", function () {
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
                setTimeout(() => {
                    alert("Puzzle selesai! Silakan jawab nama gambar.");
                    document.querySelector(".input-container").style.display = "flex";
                }, 300);
            }
        }
    } else {
        // Handle case when category doesn't exist or has no images
        console.warn("No images available for category:", category);
        // Set a default image based on category
        // if (category && gameImage) {
        //     gameImage.src = "assets/img/error_not_found.jpg";
        // }
    }

});
