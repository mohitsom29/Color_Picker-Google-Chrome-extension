const btn = document.querySelector(".changeColorBtn");
const colorgrid = document.querySelector(".colorGrid");
const colorvalue = document.querySelector(".colorValue");

btn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log("color: ", color);
  });
  let [tab] = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;
      if (data.result) {
        const color = data.result.sRGBHex;
        colorgrid.style.backgroundColor = color;
        colorvalue.innerText = color;
        try {
          await navigator.clipboard.writeText(color);
        } catch (err) {
          console.log(err);
        }
      }
    }
  );
});

async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.log(err);
  }
}
