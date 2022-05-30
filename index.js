class MyElement extends HTMLElement {
    constructor() {
        // always call super() first
        super();
        console.log('constructed!');
    }

    connectedCallback() {
        console.log('connected!');
    }

    disconnectedCallback() {
        //删除计时器   侦听事件  当有 dom元素被删除的时候 就会触发
        console.log('disconnected!');
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`Attribute: ${name} changed!`);
    }

    adoptedCallback() {
        console.log('adopted!');
    }
}

customElements.define('my-element', MyElement);