const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
	display: block;
	font-family: sans-serif;
    }

    .completed {
	text-decoration: line-through;
    }

    button {
	border: none;
	cursor: pointer;
    }
</style>
<li class="item">
    <input type="checkbox">
    <label></label>
    <button>❌</button>
</li>
`;

class TodoItem extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$item = this._shadowRoot.querySelector('.item');
        this.$removeButton = this._shadowRoot.querySelector('button');
        this.$text = this._shadowRoot.querySelector('label');
        this.$checkbox = this._shadowRoot.querySelector('input');
        // 绑定  删除事件的按钮  并设计自定义事件

        this.$removeButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onRemove', {
                    detail: this.getAttribute("index"),
                    bubbles: true,
                    composed: true
                })

            );

        });
        // 绑定  勾选事件的的按钮并设计自定义事件
        this.$checkbox.addEventListener('click', (e) =>

            {
                this.dispatchEvent(new CustomEvent('onToggle', {
                        detail: this.getAttribute("index"),
                        bubbles: true,
                        composed: true
                    }



                ));

            });
        // 设计 点击按钮事件  点击之后 如果有 check属性 则去掉 此属性 
        // 如果没有 则添加 此属性  于此同时在调用 渲染函数重新渲染
        this.addEventListener('onToggle', (e) => {
            !this.hasAttribute('checked') ?
                this.setAttribute('checked', 'checked') :
                this.removeAttribute('checked');
            this._renderTodoItem(e.detail);
        })


    };
    //  渲染  生命周期回调函数   
    // 现阶段 负责 将父组件 存下的值 展示到 子组件中
    connectedCallback() {
        if (!this.hasAttribute('text')) {
            this.setAttribute('text', 'placeholder');
        }
        this.$text.innerHTML = this._text;

    };
    // _renderTodoItem 负责监控 词条信息是否带有 checked 属性
    // 从而进行选择性渲染    不允许操作 checked 属性
    _renderTodoItem(detail) {

        if (this.hasAttribute('checked')) {
            this.$item.classList.add('completed');

            this.$checkbox.checked = true;

        } else {
            this.$item.classList.remove('completed');

        }


    };
    // 会先调用这个生命周期函数  识别哪些 做出来改变  我这里监控了 两个属性['text', "checked"]
    static get observedAttributes() {

        return ['text', "checked"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // switch 做选择  识别到 text  就将这个属性值 存起来 先别渲染 
        // 渲染操作 应该在connectedCallback 生命周期回调函数里面操作
        switch (name) {
            case 'text':
                this._text = newValue;
                break;
                // switch 做选择  识别到 checked    就调用 渲染函数
            case 'checked':
                this._renderTodoItem();
                break;
        }
    };


    get checked() {
        return this.hasAttribute("checked");
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
            this.$checkbox.checked = false;
        }
    }

    set index(val) {
        this.setAttribute('index', val);
    }

    get index() {
        return this._index;
    }
}

document.querySelector("to-do-app")._shadowRoot.querySelector("to-do-item").checked
customElements.define('to-do-item', TodoItem);