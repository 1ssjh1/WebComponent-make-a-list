const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
	display: block;
	font-family: sans-serif;
	text-align: center;
    }

    button {
	border: none;
	cursor: pointer;
    }

    ul {
	list-style: none;
	padding: 0;
    }
</style>
<h1>To do</h1>

<input type="text" placeholder="Add a new to do"></input>
<button>✅</button>

<ul id="todos"></ul>
`;

class TodoApp extends HTMLElement {
    constructor() {
            super();
            //创建 todo列表 用于初始化你的todo行列
            this._todos = [];
            this._shadowRoot = this.attachShadow({ 'mode': 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            // todo列表的容器ul
            this.$todoList = this._shadowRoot.querySelector('ul');

            // 输入框
            this.$input = this._shadowRoot.querySelector('input');
            // 确认按钮
            this.$submitButton = this._shadowRoot.querySelector('button');
            // 提交案件
            this.$submitButton.addEventListener('click', this._addTodo.bind(this));
            // 删除事件  传入 子组件 传递的索引值 并且传给 删除函数
            this.addEventListener('onRemove', (e) => {
                this._removeTodo(e.detail)
            });
            // 勾选事件         遍历  虚拟 列表 根据check属性来确认渲染方式
            this.addEventListener("onToggle", (e) => {

                [...this.$todoList.children].forEach((item, index, arr) => {

                    this._todos[index].checked = item.getAttribute("checked") ?
                        true : false;

                })



            })

        }
        // 提交函数 将你 输入框里的事件提交到  todo队列里面
    _addTodo() {
        console.log(this._todos);
        if (this.$input.value.length > 0) {
            // 默认你的checked 为false
            this._todos.push({ text: this.$input.value, checked: false })
                // 执行 初始化函数  每次 加入事件都去 初始化todo列表
            this._renderTodoList();
            // 将输入框置空
            this.$input.value = '';
        }
    };
    // 删除函数
    _removeTodo(index) {
        this._todos.splice(index, 1);
        this._renderTodoList();
    };
    disconnectedCallback() {
            //删除计时器   侦听事件  当有 dom元素被删除的时候 就会触发
            console.log('disconnected!');
        }
        // 渲染函数
    _renderTodoList() {
        //这里是全部置空再去渲染 想办法 提升一下性能吧
        this.$todoList.innerHTML = '';
        // 遍历todo队列
        this._todos.forEach((todo, index) => {
            //创建子组件  也就是 to-do-item 绑定上index属性 和text属性（将todolist里面的内容设置为其值）
            let $todoItem = document.createElement('to-do-item');
            $todoItem.setAttribute("index", index)
            $todoItem.setAttribute("text", todo.text)
            this.$todoList.appendChild($todoItem);
            // 这里的判断 是在渲染时候 给组件添加一个 check值   当子组件识别到这个值的时候  直接将 内容设置为已经完成
            if (todo.checked) {
                $todoItem.setAttribute('checked', 'checked');
            }
        });


    };
    //   set   拿到外面 传进来的内容
    set todos(value) {
        this._todos = [...this._todos, ...value]
        this._renderTodoList();

    };
    // 可以读出  清单内容
    get todos() {

        return this._todos;
    };
}

customElements.define('to-do-app', TodoApp);

//
document.querySelector('to-do-app').todos = [
    { text: "Make a to-do list", checked: false },
    { text: "Finish blog post", checked: false }
];



// let user = {
//     name: "John",
//     surname: "Smith",

//     get fullName() {
//         return `${this.name} ${this.surname}`;
//     },

//     set fullName(value) {


//         [this.name, this.surname] = value.split(" ");

//     }
// };
// user.fullName = "sjh ls"
// console.log(user.name);