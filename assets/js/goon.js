import Masonry from 'masonry-layout'

document.addEventListener('DOMContentLoaded', main);
const server = "https://0xbuts.fly.dev"

//TODO: improve error UI
function showError(error) {
    alert(error);
}

let memes = null;

async function loadMemes() {
    let url = `${server}/goon/memes`;

    const memesResp = await fetch(url);
    console.log(memesResp);
    if (!memesResp.ok) {
        //TODO: improve error message
        throw new Error(memesResp.statusText)
    }
    memes = await memesResp.json();
}

try {
    loadMemes();
}
catch (e) {
    //TODO: improve error text
    showError(e);
}

function waitForCondition(conditionFn, interval = 10) {
    return new Promise((resolve) => {
        const checkCondition = setInterval(() => {
            if (conditionFn()) {
                clearInterval(checkCondition);
                resolve();
            }
        }, interval);
    });
}

async function initMemes() {
    await waitForCondition(() => memes != null);

    const randomMemeElem = document.getElementById('random-meme');
    const memeFigureElem = document.getElementById('meme-figure')
    const memeVideoElem = document.getElementById('meme-video')
    const memeVideoSourceElem = memeVideoElem.querySelector('source');
    const memeImageElem = memeFigureElem.querySelector('img');
    const downloadMemeLem = document.getElementById('download-meme');

    async function toDataURL(url) {
        const blob = await fetch(url).then(res => res.blob());
        return URL.createObjectURL(blob);
    }

    downloadMemeLem.addEventListener('click', async () => {
        const url = memeImageElem.src;
        const a = document.createElement("a");
        a.href = await toDataURL(url);
        a.download = url.replace(/^.*[\\/]/, '');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    const finish = () => {
        memeFigureElem.classList.remove('is-skeleton');
        memeVideoElem.classList.remove('is-skeleton');
        randomMemeElem.classList.remove('is-loading');
        downloadMemeLem.classList.remove('is-loading');
    }

    memeImageElem.addEventListener('load', finish);
    memeImageElem.addEventListener('error', finish);

    memeVideoElem.addEventListener('canplay', finish);
    memeVideoElem.addEventListener('loadeddata', finish);
    memeVideoElem.addEventListener('error', finish);

    const getRandomMeme = async () => {
        const meme = memes[Math.floor(Math.random() * memes.length)];

        const video = isVideo(meme);
        const srcElem = video ? memeVideoSourceElem : memeImageElem;

        if (video) {
            memeFigureElem.classList.add('is-hidden');
            memeVideoElem.classList.remove('is-hidden');
        } else {
            memeFigureElem.classList.remove('is-hidden');
            memeVideoElem.classList.add('is-hidden');
        }

        memeFigureElem.classList.add('is-skeleton');
        memeVideoElem.classList.add('is-skeleton');
        randomMemeElem.classList.add('is-loading');
        downloadMemeLem.classList.add('is-loading');
        srcElem.src = meme;
        if (video) {
            memeVideoElem.load();
        }
    };

    randomMemeElem.addEventListener('click', getRandomMeme);

    getRandomMeme();
}

const videoMimeTypes = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'flv': 'video/x-flv'
};

const videoExtensions = Object.keys(videoMimeTypes);

function getVideoMimeType(url) {
    const extension = url.split('.').pop();
    const normalizedExtension = extension.toLowerCase().replace('.', '');
    return videoMimeTypes[normalizedExtension] || null;
}

function isVideo(url) {
    const extension = url.split('.').pop();
    return videoExtensions.includes(extension.toLowerCase());
}

async function main() {
    try {
        //initMemes();
        await waitForCondition(() => memes != null);

        const videoObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.5 });

        const memesGridElem = document.querySelector(".masonry");
        const masonry = new Masonry(memesGridElem, {
            itemSelector: '.masonry-item',
            columnWidth: '.masonry-item',
            percentPosition: true,
            gutter: 0,
            transitionDuration: 0
        });
        memes.forEach((url, index) => {
            const item = document.createElement('div');
            item.classList.add('masonry-item');
            let elem = null;
            if (isVideo(url)) {
                elem = document.createElement('video');
                elem.autoplay = true;
                elem.loop = true;
                elem.muted = true;
                elem.playsInline = true;
                elem.controls = false;
                const source = document.createElement('source');
                source.src = url;
                source.type = getVideoMimeType(url);
                elem.appendChild(source);
                videoObserver.observe(elem);
            } else {
                elem = document.createElement('img');
                elem.src = url;
            }

            item.dataset.index = index;
            item.appendChild(elem);

            masonry.appended(item);

            function itemLoaded() {
                let minIndex = -1;
                let minElem = null;
                for (let i = 0; i < memesGridElem.children.length; ++i) {
                    const otherItem = memesGridElem.children[i];
                    const otherIndex = Number(otherItem.dataset.index);

                    if (otherIndex > index && (minIndex == - 1 || otherIndex < minIndex)) {
                        minIndex = otherIndex;
                        minElem = otherItem;
                    }
                }

                if (minElem != null) {
                    memesGridElem.insertBefore(item, minElem);
                } else {
                    memesGridElem.appendChild(item);
                }

                masonry.reloadItems();
                masonry.layout();

                elem.removeEventListener('load', itemLoaded);
                elem.removeEventListener('loadeddata', itemLoaded);
                elem.removeEventListener('canplay', itemLoaded);
                elem.removeEventListener('error', itemLoaded);
            }

            elem.addEventListener('load', itemLoaded);
            elem.addEventListener('loadeddata', itemLoaded);
            elem.removeEventListener('canplay', itemLoaded);
            elem.addEventListener('error', itemLoaded);
        });
    }
    catch (e) {
        //TODO: improve error text
        showError(e);
    }
}

