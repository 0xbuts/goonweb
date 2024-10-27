import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faClipboard, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';

library.add(faClipboard, faCheck, faXmark, faXTwitter, faTelegram, faDiscord);

dom.watch();