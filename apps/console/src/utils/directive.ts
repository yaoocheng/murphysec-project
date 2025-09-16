import xss from 'xss';
import markdownIt from 'markdown-it';

const md = markdownIt();

export const vMarkdown = (el: HTMLElement, binding: any) => {
    el.innerHTML = xss(md.render(binding.value ?? ''));
};

export const vHtml = (el: HTMLElement, binding: any) => {
    el.innerHTML = xss(binding.value ?? '');
};
