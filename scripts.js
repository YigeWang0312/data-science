let mapWidth;
document.querySelectorAll('div.vega-container').forEach(
    async function(el) {
        mapWidth = mapWidth ?? Math.min(800,el.clientWidth*0.75);
        const vegaDiv = el.querySelector('div.vega-canvas');
        const dataFunction = vegaDiv.getAttribute('data-data-function');
        const dataEl = el.querySelector('script[type="text/data"]');
        const dataScript = el.querySelector('script[type="text/javascript-function"]');
        let data;
        let code;
        let codeLanguage = 'javascript';
        if (dataEl) {
            code = dataEl.innerText;
            data = JSON.parse(dataEl.innerText);
            data.width = data.width ? Math.min(data.width,window.innerWidth) : mapWidth;

            const ratio = data.width/800;
            data.height = 500*ratio;
            try {
                data.marks[0].encode.update.size.value *= ratio*ratio;
                data.marks[2].encode.enter.fontSize.value *= ratio;
            }
            catch(e) {

            }

            codeLanguage = 'json';
        }
        else if (dataScript) {
            code = dataScript.innerText;
            await eval(dataScript.innerText);
        }
        if (code) {
            exposeCode(code, codeLanguage, el);
        }

        vegaEmbed(vegaDiv, data);
    }
);


function exposeCode(code, language, parentEl) {
    const firstLineWhiteSpace = code.match(/(\n)(\s+)(\S)/m);
    code = code.replaceAll(firstLineWhiteSpace[2],'');
    const codeEl = document.createElement('pre');
    codeEl.innerHTML = '<code>' + hljs.highlight(code, {language}).value + '</code>';
    parentEl.appendChild(codeEl);
}

document.querySelectorAll('script.expose').forEach(
    (el) => {
        exposeCode(
            el.innerText,
            'javascript',
            el.closest('div')
        );
    }
);
document.querySelectorAll('div.tabs-container').forEach(
    (el) => {
        const tabs = el.querySelectorAll('ol.tabs li');

        tabs.forEach(
            (tab) => {
                tab.addEventListener(
                    'click',
                    function(e) {
                        e.preventDefault();
                        const target = tab.querySelector('a').getAttribute('href');
                        el.querySelectorAll('.tab-content').forEach((tabContent) => tabContent.classList.remove('active'));
                        el.querySelector(target).classList.add('active');
                        tabs.forEach( (tab) => tab.classList.remove('active'))
                        tab.classList.add('active');
                    }
                )
            }
        )
    }
);