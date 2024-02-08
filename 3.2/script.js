let xPos = 0;

gsap
.timeline()
.set(".ring", { rotationY: 180, cursor: "grab" }) //set initial rotationY so the parallax jump happens off screen
.set(".img32", {
    // apply transform rotations to each image
    rotateY: (i) => i * -36,
    transformOrigin: "50% 50% 500px",
    z: -500,
    backfaceVisibility: "hidden",
})
.add(() => {
    fetchDogImages(); // Call the function to fetch dog images
}, "-=0.5")
.from(".img32", {
    duration: 1.5,
    y: 200,
    opacity: 0,
    stagger: 0.1,
    ease: "expo",
})
.add(() => {
    $(".img32").on("mouseenter", (e) => {
    let current = e.currentTarget;
    gsap.to(".img32", {
        opacity: (i, t) => (t == current ? 1 : 0.5),
        ease: "power3",
    });
    });
    $(".img32").on("mouseleave", (e) => {
    gsap.to(".img32", { opacity: 1, ease: "power2.inOut" });
    });
}, "-=0.5");

$(window).on("mousedown touchstart", dragStart);
$(window).on("mouseup touchend", dragEnd);

function dragStart(e) {
if (e.touches) e.clientX = e.touches[0].clientX;
xPos = Math.round(e.clientX);
gsap.set(".ring", { cursor: "grabbing" });
$(window).on("mousemove touchmove", drag);
}

function drag(e) {
if (e.touches) e.clientX = e.touches[0].clientX;

gsap.to(".ring", {
    rotationY: "-=" + ((Math.round(e.clientX) - xPos) % 360),
    onUpdate: () => {
    gsap.set(".img32", { backgroundPosition: (i) => getBgPos(i) });
    },
});

xPos = Math.round(e.clientX);
}

function dragEnd(e) {
$(window).off("mousemove touchmove", drag);
gsap.set(".ring", { cursor: "grab" });
}

function getBgPos(i) {
//returns the background-position string to create parallax movement in each image
return (
    100 -
    (gsap.utils.wrap(
    0,
    360,
    gsap.getProperty(".ring", "rotationY") - 180 - i * 36
    ) /
    360) *
    500 +
    "px 0px"
);
}

function fetchDogImages() {
fetch("https://dog.ceo/api/breeds/image/random/10")
    .then((response) => response.json())
    .then((data) => {
    if (data.status === "success") {
        const dogImages = data.message;
        updateDogImages(dogImages);
    }
    })
    .catch((error) => console.error("Error fetching dog images:", error));
}

function updateDogImages(dogImages) {
// Update your DOM with the dog images
// Assuming you have three images in the dogImages array
if (dogImages) {
    $(".img32").each((i, el) => {
    $(el).css({
        "background-image": `url(${dogImages[i]})`,
        "background-position": getBgPos(i),
    });
    });
}
}