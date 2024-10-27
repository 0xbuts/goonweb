import './icons.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    document.querySelectorAll('.clipboard').forEach(clipboard => {
        const text = clipboard.querySelector('[data-clipboard="text"]');
        if (text) {
            const normalContent = clipboard.querySelector('[data-clipboard="normal"]');
            const successContent = clipboard.querySelector('[data-clipboard="success"]');
            const errorContent = clipboard.querySelector('[data-clipboard="error"]');

            clipboard.addEventListener('click', async () => {
                const success = await copyToClipBoard(text.innerText);
                const hiddenClass = 'is-hidden';

                const resultClass = success ? 'is-success' : 'is-danger';
                clipboard.classList.add(resultClass);
                if(normalContent && successContent && errorContent) {
                    normalContent.classList.add(hiddenClass);
                    if(success) {
                        successContent.classList.remove(hiddenClass);
                    } else {
                        errorContent.classList.remove(hiddenClass);
                    }
                }

                await new Promise(resolve => {
                    setTimeout(resolve, 1000);
                });
                clipboard.classList.remove(resultClass);
                if(normalContent && successContent && errorContent) {
                    normalContent.classList.remove(hiddenClass);
                    if(success) {
                        successContent.classList.add(hiddenClass);
                    } else {
                        errorContent.classList.add(hiddenClass);
                    }
                }
            });
        }
    });
}

async function copyToClipBoard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        return false;
    }
}