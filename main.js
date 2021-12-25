function len(str) {
    let size = new Blob([str]).size;
    return size;
}

Number.prototype.toUTF16 = function () {
    return this.toString(16).toUpperCase().padStart(4, "0");
}
Number.prototype.toUTF8 = function () {
    return this.toString(16).toUpperCase().padStart(2, "0");
}

function htmlChar(str) {
    const grapheme = [...new Intl.Segmenter().segment(str)]
    let graphemestr = ''
    grapheme.forEach(graphemeelement => {
        const points = [...graphemeelement.segment]
        let pointstr = ''

        points.forEach(pointselement => {
            let format = ''
            const decstr = pointselement.codePointAt(0).toString(10)
            const hexstr = pointselement.codePointAt(0).toUTF16()
            //const urlstr = encodeURI(pointselement)
            const utf8array = new TextEncoder().encode(pointselement)
            const utf8str = Array.from(utf8array).map(item => {
                return '%' + item.toUTF8()
            }).join('')
            const surrogate = Number.isNaN(pointselement.charCodeAt(1)) ? `\\u${pointselement.charCodeAt(0).toUTF16()}` : `\\u${pointselement.charCodeAt(0).toUTF16()}\\u${pointselement.charCodeAt(1).toUTF16()}`
            if (pointselement === "\r") {
                format = '<span class="symbol S2Tooltip anchor">CR</span>';
            } else if (pointselement === "\n") {
                format = '<span class="symbol S2Tooltip anchor">LF</span>';
            } else if (pointselement === "\t") {
                format = '<span class="symbol S2Tooltip anchor">⟶</span>&#8203;';
            } else if (pointselement === " ") {
                format = '<span class="white S2Tooltip anchor">·</span>&#8203;';
            } else {
                if (pointselement.match(/^[\p{Z}\p{C}\p{M}]$/u) != null)
                    format = `<span class="hex S2Tooltip anchor">U+${hexstr}</span>`
                else
                    format = `<span class="S2Tooltip anchor">${pointselement}</span>`
            }
            pointstr = pointstr + `${format}<span class="S2Tooltip container"><span class="S2Tooltip tiptext rounded shadow"><span class="S2Tooltip char">${pointselement}</span><br>U+${hexstr}<br>${surrogate}<br>&amp;#${decstr};<br>${utf8str}</span></span>`
            if (pointselement === "\n") pointstr = pointstr + '<br>'
        });

        graphemestr = graphemestr + pointstr
    });
    return graphemestr
}



function run() {
    const str = document.getElementById("input").value
    const grapheme = [...new Intl.Segmenter().segment(str)]
    const res = htmlChar(str)
    document.getElementById("sum").innerHTML = `${grapheme.length} graphemes, ${[...str].length} Code points(0-0x10FFFF), ${str.length} UTF-16(0-0xFFFF), ${len(str)} UTF-8(0-0xFF)`
    document.getElementById("output").innerHTML = res
    console.log(grapheme)
    console.log([...str])
}
