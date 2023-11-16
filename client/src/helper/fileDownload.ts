// Credit: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
export function downloadObjectAsJson(exportObj: string, exportName: string) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute(
    "download",
    `${exportName}${exportName.endsWith(".json") ? "" : ".json"}`,
  );
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
