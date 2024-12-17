import panzoom, { PanZoom } from 'panzoom';
import styles from './styles';

export const insertPanzoomStyles = (head: HTMLHeadElement) => {
  const panzoomStyleElement = document.createElement('style');
  panzoomStyleElement.textContent = styles;
  head.appendChild(panzoomStyleElement);
};

export const attachPanzoom = (el: HTMLElement, diagramElement: HTMLDivElement): void => {
  const box = document.createElement('div');
  box.className = 'panzoom-box';

  const nav = document.createElement('nav');
  nav.className = 'panzoom-top-nav';

  const resetButton = document.createElement('button');
  resetButton.classList.add('panzoom-reset', 'panzoom-button');
  resetButton.innerHTML = `
    <svg class="panzoom-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M125.7 160l50.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48 224c-17.7 0-32-14.3-32-32L16 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"></path></svg>
  `;

  const maxButton = document.createElement('button');
  maxButton.classList.add('panzoom-max', 'panzoom-button');
  maxButton.innerHTML = `
    <svg class="panzoom-icon" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"></path></svg>
  `;

  const minButton = document.createElement('button');
  minButton.classList.add('panzoom-min', 'panzoom-button', 'panzoom-hidden');
  minButton.innerHTML = `
    <svg class="panzoom-icon" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"></path></svg>
  `;

  const infoBox = document.createElement('div');
  infoBox.className = 'panzoom-info-box';
  infoBox.innerHTML = `
    <span>Hold down Alt / Option</span>
    <svg class="panzoom-icon" style="vertical-align: middle" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3,4H9.11L16.15,18H21V20H14.88L7.84,6H3V4M14,4H21V6H14V4Z" /></svg>
    <span>to enable mouse or trackpad pan & zoom</span>
  `;

  nav.appendChild(resetButton);
  nav.appendChild(maxButton);
  nav.appendChild(minButton);
  box.appendChild(nav);
  box.appendChild(diagramElement);
  box.appendChild(infoBox);

  el.parentNode?.insertBefore(box, el.nextSibling);
  const instance = panzoom(diagramElement, {
    minZoom: 1,
    beforeWheel: (e: MouseEvent) => !e.altKey,
    beforeMouseDown: (e: MouseEvent) => !e.altKey && !e.button,
    pinchSpeed: 2,
    zoomDoubleClickSpeed: 1,
    autocenter: true,
    bounds: true,
  });
  addPanzoomButtonEvents(box, instance);
};

const resetPanzoom = (instance: PanZoom) => {
  instance.moveTo(0, 0);
  instance.zoomAbs(0, 0, 1);
};

const addPanzoomButtonEvents = (box: HTMLElement, instance: PanZoom): void => {
  const reset = box.querySelector('.panzoom-reset') as HTMLElement | null;
  const max = box.querySelector('.panzoom-max') as HTMLElement | null;
  const min = box.querySelector('.panzoom-min') as HTMLElement | null;
  const info = box.querySelector('.panzoom-info') as HTMLElement | null;
  const infoBox = box.querySelector('.panzoom-info-box') as HTMLElement | null;

  if (reset) {
    reset.addEventListener('click', () => {
      resetPanzoom(instance);
    });
  }

  if (info) {
    info.addEventListener('click', () => {
      if (box.dataset.info === 'true') {
        box.dataset.info = 'false';
        infoBox?.classList.add('panzoom-hidden');
      } else {
        box.dataset.info = 'true';
        infoBox?.classList.remove('panzoom-hidden');
      }
    });
  }

  if (max) {
    max.addEventListener('click', () => {
      box.classList.add('panzoom-fullscreen');
      min?.classList.remove('panzoom-hidden');
      max.classList.add('panzoom-hidden');
      box.focus();
    });
  }

  if (min) {
    min.addEventListener('click', () => {
      resetPanzoom(instance);
      box.classList.remove('panzoom-fullscreen');
      max?.classList.remove('panzoom-hidden');
      min.classList.add('panzoom-hidden');
    });
  }

  box.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      if (max && min) {
        box.classList.remove('panzoom-fullscreen');
        max.classList.remove('panzoom-hidden');
        min.classList.add('panzoom-hidden');
      }
    }
  });
};
