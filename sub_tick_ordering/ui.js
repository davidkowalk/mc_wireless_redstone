const collapseBtn = document.getElementById("collapseSidebar");
const showBtn = document.getElementById("showSidebar");

collapseBtn.addEventListener("click", () => {
    document.body.classList.add("collapsed");
});

showBtn.addEventListener("click", () => {
    document.body.classList.remove("collapsed");
});

function runAndDisplayTests() {
    document.getElementById("test-results").textContent = "...";
    const result = run_unit_tests();
    document.getElementById("test-results").textContent =
        result.passed + "/" + result.total + " tests passed.";
}