var keyHoldTimer;

document.addEventListener("keydown", checkPressed);
document.addEventListener("keyup", checkUnpressed);
document.addEventListener("keypress", checkChar);

var boxArray = [];

function checkPressed(event) {
    if (event.keyCode == 17) {
        keyHoldTimer = setTimeout(toggleAccels, 500);
        return;
    }
    if ((event.keyCode == 27) && (boxArray.length > 0)) {
        // Allow [ESC] to clear accels too
        toggleAccels();
        return;
    }
}

function checkUnpressed(event) {
    if (event.keyCode == 17) {
        clearTimeout(keyHoldTimer);
    }
}

function checkChar(event) {
    for (var i=0; i < boxArray.length; i++) {
        if (event.charCode == boxArray[i].box.textContent.charCodeAt(0)) {
            boxArray[i].link.click();
        }
    }
}

function toggleAccels() {
    if (boxArray.length > 0) { //accels already visible
        hideAccels();
        return;
    }

    var charList = "1234567890abcdefghijklmnopqrstuvwxyz"
    var charIndex = 0;
    var links = document.getElementsByTagName("a");

    for (var i = 0; i < links.length; i++) {
        var link = links[i];

        if (visible(link)) {
            var keyBox = document.createElement("div");
            var link_style = getComputedStyle(link);
            keyBox.textContent = charList[charIndex];
            keyBox.style.position = "absolute";
            keyBox.style.border = "1px solid";
            //keyBox.style.borderColor = "link";
            keyBox.style.color = "black";
            keyBox.style.backgroundColor = "white";
            keyBox.style.fontSize = link_style.fontSize;

            document.body.appendChild(keyBox);

            keyBox.style.top = link.getClientRects()[0].top + "px";
            keyBox.style.left = link.getClientRects()[0].left + "px";
            keyBox.style.zIndex = 1000;

            boxArray.push({"box":keyBox, "link": link});

            charIndex++;
            if(charIndex >= charList.length) {
                break;
            }
        }
    }
}

function hideAccels() {
    while (boxArray.length > 0) {
        var element = boxArray.pop();
        element.box.parentNode.removeChild(element.box);
    }
}

/** Function for checking visibility of element.
 * @note Adapted from http://stackoverflow.com/questions/704758/how-to-check-if-an-element-is-really-visible-with-javascript
 */
function visible(element) {

    if (element.offsetWidth === 0 || element.offsetHeight === 0) return false;
    var height = document.documentElement.clientHeight,
        rects = element.getClientRects(),
        on_top = function (r) {
            var x = (r.left + r.right) / 2,
                y = (r.top + r.bottom) / 2;
            document.elementFromPoint(x, y) === element;
        };
    for (var i = 0, l = rects.length; i < l; i++) {
        var r = rects[i],
            in_viewport = r.top > 0 ? r.top <= height : (r.bottom > 0 && r.bottom <=
                height);
        if (in_viewport /*&& on_top(r)*/) return true;
    }
    return false;
}
