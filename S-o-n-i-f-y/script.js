function setAnalysis(newLocation, direction, example) {
  window.localStorage.setItem("picLocation",newLocation);
  window.localStorage.setItem("analysisDirection", direction);
}
function getURL(direction) {
  imageURL = window.prompt("Enter an image URL:");
  window.localStorage.setItem("picLocation", imageURL);
  window.localStorage.setItem("analysisDirection", direction);
  window.location.href="imageAnalysis.html"
}