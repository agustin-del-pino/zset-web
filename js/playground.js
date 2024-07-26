
const { ZSetEngine } = zsetlang;
const zse = new ZSetEngine();
const input = document.querySelector("#input");
const lines = document.querySelector("#lines");
const output = document.querySelector("#output");
const share = document.querySelector("#modalshare");
const link = document.querySelector("#modallink");

let cache = 0;
let running = false;
let stdout = [];

const log = console.log;

console.log = function (...args) {
    if (running) {
        stdout.push(args);
    }
    log.apply(console, args);
}


function getLines() {
    const l = input.value.match(/\n/g)?.length || 0;
    if (l === 0) {
        return 1
    }
    return l + 1;
}

function refreshLines(l) {
    if (l === cache) return;

    if (l > cache) {
        while (l > cache) {
            cache++;
            const n = document.createElement("p")
            n.innerText = cache;
            lines.appendChild(n);
        }
    } else {
        while (l < cache) {
            cache--;
            lines.lastChild.remove()
        }
    }
}

function lzwCompress(input) {
    const dictionary = {};
    const data = input.split("");
    const result = [];
    let currentChar;
    let phrase = data[0];
    let code = 256;

    for (let i = 1; i < data.length; i++) {
        currentChar = data[i];
        if (dictionary[phrase + currentChar] != null) {
            phrase += currentChar;
        } else {
            result.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));
            dictionary[phrase + currentChar] = code;
            code++;
            phrase = currentChar;
        }
    }

    result.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));

    return result.map(charCode => String.fromCharCode(charCode)).join("");
}

function lzwDecompress(compressed) {
    const dictionary = {};
    const data = compressed.split("");
    let currentChar = data[0];
    let oldPhrase = currentChar;
    const result = [currentChar];
    let code = 256;
    let phrase;

    for (let i = 1; i < data.length; i++) {
        const currCode = data[i].charCodeAt(0);
        phrase = currCode < 256 ? data[i] : (dictionary[currCode] ? dictionary[currCode] : (oldPhrase + currentChar));
        result.push(phrase);
        currentChar = phrase.charAt(0);
        dictionary[code] = oldPhrase + currentChar;
        code++;
        oldPhrase = phrase;
    }

    return result.join("");
}


function toB64(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    return btoa(String.fromCharCode(...utf8Bytes));
}

function fromB64(str) {
    const binaryString = atob(str);
    const utf8Bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return new TextDecoder().decode(utf8Bytes);
}

function createLink() {
    let code = input.value.replace(/\n{2,}/g, "\n").replace(/\s{2,}/, " ")
    return `${window.location.host}/playground.html?run=${toB64(lzwCompress(code))}`;
}

function load() {
    const query = new URLSearchParams(location.search);
    if (query.has("run")) {
        input.value = lzwDecompress(fromB64(query.get("run")));
        refreshLines(getLines());
    } else {
        refreshLines(1);
    }
}

input.addEventListener("input", () => refreshLines(getLines()))

document.querySelector("#run").addEventListener("click", () => {
    output.classList.remove("msg-error");
    output.innerText = "";

    running = true;

    try {
        zse.exec(input.value);
        stdout.forEach(a => output.innerText += `${a}\n`);
        stdout = [];
    } catch (ex) {
        output.classList.add("msg-error")
        output.innerText = `Error: ${ex.message}`;
    }

    running = false;
    zse.clear();
});

document.querySelector("#share").addEventListener("click", () => {
    if(input.value !== "") {
        link.value = createLink();
        link.setSelectionRange(0, 0);
    } else {
        link.value = "there no code to share";
    }
    share.showModal();
});

document.querySelector("#modalcopy").addEventListener("click", async ()=> {
    await navigator.clipboard.writeText(link.value);
    share.close();
})

document.querySelector("#modalclose").addEventListener("click", () => share.close());


load();