document.addEventListener('DOMContentLoaded', function () {
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get the category parameter from URL
    const category = getUrlParameter('category');

    // Get the h1 element in the text div
    const headingElement = document.querySelector('.text h1');

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

    let currentImageIndex = 0;

    const gameImage = document.getElementById("gameImage");

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
            gameImage.src = currentImage.src;

            console.log(currentImage.src);

            // Add error handling for image loading
            gameImage.onerror = function() {
                console.error("Failed to load image:", currentImage.src);
                // Try to load next image or show a placeholder
                currentImageIndex++;
                if (currentImageIndex < imagesAndAnswers[category].length) {
                    loadNextImage();
                } else {
                    // If all images fail, set a default image or show an error message
                    gameImage.src = "assets/img/error_not_found.jpg";
                }
            };
        }

        // start the game
        loadNextImage();

        const backToHome = document.getElementById("backToHome");
        // add event listener to the backToHome button
        backToHome.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    } else {
        // Handle case when category doesn't exist or has no images
        console.warn("No images available for category:", category);
        // Set a default image based on category
        if (category && gameImage) {
            gameImage.src = "assets/img/error_not_found.jpg";
        }
    }

});
