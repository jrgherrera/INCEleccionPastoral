function check() {
  "use strict";

  if (typeof Symbol === "undefined") return false;
  try {
      eval("class Foo {}");
      eval("var bar = (x) => x+1");
  } catch (e) { return false; }

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!check()) {
    const $noSupportModal = document.getElementById('no-support');
    $noSupportModal.classList.add('show');
    document.body.classList.add('popup-open');
  }
});
