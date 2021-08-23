const uriPrefix = 'http://localhost:8338/hyper/';
// rewrite hyper urls in the document to http
[...document.scripts]
    .filter(e => e.src.startsWith('hyper://'))
    .forEach(e => {
        // write a new script element with a http url
        const scriptTag = document.createElement('script')
        scriptTag.src = uriPrefix + encodeURIComponent(e.src);
        e.parentNode.appendChild(scriptTag);
    });

function rewriteDatImageUrls() {
    [...document.images]
        .filter(e => e.src.startsWith('hyper://'))
        .forEach(e => e.src = uriPrefix + encodeURIComponent(e.src));
}

rewriteDatImageUrls();
// rewrite images on the fly
document.onload = () => {
    const observer = new MutationObserver(rewriteDatImageUrls);
    observer.observe(document.body, { childList:true, subtree:true });
}