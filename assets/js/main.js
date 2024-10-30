import './icons.js';
import LazyLoad from 'vanilla-lazyload';

document.addEventListener('DOMContentLoaded', main);

function main() {
    new LazyLoad();
    // anchors smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // copy to clipboard
    async function copyToClipBoard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            return false;
        }
    }

    document.querySelectorAll('.clipboard').forEach(clipboard => {
        const text = clipboard.querySelector('[data-clipboard="text"]');
        if (text) {
            const normalContent = clipboard.querySelector('[data-clipboard="normal"]');
            const successContent = clipboard.querySelector('[data-clipboard="success"]');
            const errorContent = clipboard.querySelector('[data-clipboard="error"]');

            clipboard.addEventListener('click', async () => {
                const success = await copyToClipBoard(text.innerText);
                const hiddenClass = 'is-hidden';

                if (normalContent && successContent && errorContent) {
                    normalContent.classList.add(hiddenClass);
                    
                    if (success) {
                        successContent.classList.remove(hiddenClass);
                    } else {
                        errorContent.classList.remove(hiddenClass);
                    }
                }

                await new Promise(resolve => {
                    setTimeout(resolve, 1000);
                });

                if (normalContent && successContent && errorContent) {
                    normalContent.classList.remove(hiddenClass);
                    if (success) {
                        successContent.classList.add(hiddenClass);
                    } else {
                        errorContent.classList.add(hiddenClass);
                    }
                }
            });
        }
    });

    // navgar burger

    var navbar = document.querySelector('.navbar');
    var navbarMenu = document.querySelector('.navbar-menu');
    var navbarBurger = document.querySelector('.navbar-burger');

    const toggleBurger = () => {
        navbarBurger.classList.toggle('is-active');
        navbarMenu.classList.toggle('is-active');
    };

    const navBarLinks = navbar.querySelectorAll('a[href^="#"]');
    navBarLinks.forEach(function (el) {
        el.addEventListener('click', toggleBurger);
    });

    navbarBurger.addEventListener('click', toggleBurger);

    const isVisible = (elem) => { return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length); };

    document.addEventListener('click', (event) => {
        if (!navbarBurger.contains(event.target) && isVisible(navbarBurger) && !navbarMenu.contains(event.target) && isVisible(navbarMenu)) {
            if (navbarMenu.classList.contains('is-active')) {
                toggleBurger();
            }
        }
    });
}
