const state = {
  score: 0,
  clickPower: 1,
  cps: 0,         
};

document.getElementById("clicker-btn").addEventListener("click", () => {
  state.score += state.clickPower;
  updateUI();
  spawnFloatingText(`+${state.clickPower}`);
});