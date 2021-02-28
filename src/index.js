const menu = document.querySelector('.menu');
const filmTab = document.getElementById('films-tab');
const tvChannelTab = document.getElementById('tv-channels-tab');
const tvSchedule = document.querySelector('.tv_schedule_container');
const movies = document.getElementById('movies');
const genres = document.getElementById('genres');
const modalWindow = document.querySelector('.modal-window_wrapper');
const loginButton = document.querySelector('.header-login');
const loginInput = document.getElementById('login-input');
const logoutButton = document.querySelector('.header-logout')
const passwordInput = document.getElementById('password-input');
const form = document.getElementById('form');
const username = document.querySelector('.header-username')
const usernameInput = document.querySelector('.header-username-input')
const checkbox = document.querySelector('.checkbox');
let url = 'http://localhost:3000/users'
const tvScheduleCard = document.querySelector('.tv-schedule');

// Создаем модальное окно при клике на кнопку войти
loginButton.addEventListener('click', () => {modalWindow.classList.remove('hidden')})
// И убираем модальное окно, если кликнут за его пределами
modalWindow.addEventListener('click', cancelAuth);

function cancelAuth(event){
    if (event.target.className === 'modal-window_wrapper'){ modalWindow.classList.add('hidden')}
}

//с помощью делегирования событий создаем обработчик табов, который генерирует контент на странице в зависимости от выбранного
menu.addEventListener('click', tabChangeHandler);

function tabChangeHandler(event){
    if (!event.target.classList.contains('menu__tab_active')){
        if (event.target === filmTab ){
            filmTab.classList.add('menu__tab_active');
            tvChannelTab.classList.remove('menu__tab_active')
            tvSchedule.classList.add('hidden');
            movies.classList.remove('hidden');
            genres.classList.remove('hidden');
        } else if (event.target === tvChannelTab) {
            tvChannelTab.classList.add('menu__tab_active');
            filmTab.classList.remove('menu__tab_active')
            tvSchedule.classList.remove('hidden');
            movies.classList.add('hidden');
            genres.classList.add('hidden');
            //при переходе на "Телешоу" создаем функцию по созданию кастомного скроллбара
            scrollbarCreating()
        }
    }
}

function scrollbarCreating() {
    'use strict';
    // Проверяем существует ли он уже
    if  (document.querySelector('.scroller')) return;

    function ScrollBox(container, nameEvent) {
        this.container = document.querySelector('.tv_schedule_container')
        // имя события прокрутки
        this.nameEvent = nameEvent;
        // родительский элемент в котором находится контент и скроллбар
        this.viewport = container.querySelector('.viewport');
        // элемент с контентом
        this.content = this.viewport.querySelector('.content');
        // высоты полученных элементов
        this.viewportHeight = this.viewport.offsetHeight;
        this.contentHeight = this.content.scrollHeight;
        // возможная максимальная прокрутка контента
        this.max = this.viewport.clientHeight - this.contentHeight;
        // соотношение между высотами вьюпорта и контента
        this.ratio = this.viewportHeight / this.contentHeight;
        // минимальная высота ползунка скроллбара
        this.scrollerHeightMin = 25;
        // шаг прокручивания контента при наступлении события 'wheel'
        // чем меньше шаг, тем медленнее и плавнее будет прокручиваться контент
        this.step = 20;
        // флаг нажатия на левую кнопку мыши
        this.pressed = false;
    }

    // для сокращения записи, создадим переменную, которая будет ссылаться
    // на прототип 'ScrollBox'
    const fn = ScrollBox.prototype;

    fn.init = function() {
        // если высота контента меньше или равна высоте вьюпорта,
        // выходим из функции
        if (this.viewportHeight >= this.contentHeight) return;
        // формируем полосу прокрутки и полунок
        this.createScrollbar();
        // устанавливаем обработчики событий
        this.registerEventsHandler();
    };

    fn.createScrollbar = function() {
        // создаём новые DOM-элементы DIV из которых будет
        // сформирован скроллбар
        let scrollbar = document.createElement('div'),
            scroller = document.createElement('div');

        // присваиваем созданным элементам соответствующие классы
        scrollbar.className = 'scrollbar';
        scroller.className = 'scroller';

        // вставляем созданные элементы в document
        scrollbar.appendChild(scroller);
        this.container.appendChild(scrollbar);

        // получаем DOM-объект ползунка полосы прокрутки, вычисляем и
        // устанавливаем его высоту
        this.scroller = this.container.querySelector('.scroller');
        this.scrollerHeight = parseInt(this.ratio * this.viewportHeight);
        this.scrollerHeight = (this.scrollerHeight < this.scrollerHeightMin) ? this.scrollerHeightMin : this.scrollerHeight;
        this.scroller.style.height = this.scrollerHeight + 'px';
        // вычисляем максимально возможное смещение ползунка от верхней границы вьюпорта
        // это смещение зависит от высоты вьюпорта и высоты самого ползунка
        this.scrollerMaxOffset = this.viewportHeight - this.scroller.offsetHeight;
    };

    // регистрация обработчиков событий
    fn.registerEventsHandler = function(e) {
        // вращение колёсика мыши
        if (this.nameEvent === 'wheel') {
            this.viewport.addEventListener('wheel', this.scroll.bind(this));
        } else {
            this.content.addEventListener('scroll', () => {
                this.scroller.style.top = (this.content.scrollTop * this.ratio) + 'px';
            });
        }

        // нажатие на левую кнопку мыши
        this.scroller.addEventListener('mousedown', e => {
            // координата по оси Y нажатия левой кнопки мыши
            this.start = e.clientY;
            // устанавливаем флаг, информирующий о нажатии левой кнопки мыши
            this.pressed = true;
        });

        // перемещение мыши
        document.addEventListener('mousemove', this.drop.bind(this));

        // отпускание левой кнопки мыши
        document.addEventListener('mouseup', () => this.pressed = false);
    };

    fn.scroll = function(e) {
        e.preventDefault();
        // направление вращения колёсика мыши
        let dir = -Math.sign(e.deltaY);
        // шаг прокручивания контента, в зависимости от прокручивания
        // колёсика мыши
        let	step = (Math.abs(e.deltaY) >= 3) ? this.step * dir : 0;

        // управляем позиционированием контента
        this.content.style.top = (this.content.offsetTop + step) + 'px';
        // ограничиваем прокручивание контента вверх и вниз
        if (this.content.offsetTop > 0) this.content.style.top = '0px';
        if (this.content.offsetTop < this.max) this.content.style.top = this.max + 'px';

        // перемещаем ползунок пропорционально прокручиванию контента
        this.scroller.style.top = (-this.content.offsetTop * this.ratio) + 'px';
    };

    fn.drop = function(e) {
        e.preventDefault();
        // если кнопка мыши не нажата, прекращаем работу функции
        if (this.pressed === false) return;

        // величина перемещения мыши
        let shiftScroller = this.start - e.clientY;
        // изменяем положение бегунка на величину перемещения мыши
        this.scroller.style.top = (this.scroller.offsetTop - shiftScroller) + 'px';

        // ограничиваем перемещение ползунка по верхней границе вьюпорта
        if (this.scroller.offsetTop <= 0) this.scroller.style.top = '0px';
        // ограничиваем перемещение ползунка по нижней границе вьюпорта
        // сумма высоты ползунка и его текущего отступа от верхней границы вьюпорта
        let	totalHeight = this.scroller.offsetHeight + this.scroller.offsetTop;
        if (totalHeight >= this.viewportHeight) this.scroller.style.top = this.scrollerMaxOffset + 'px';

        // расстояние, на которую должен переместиться контент
        // это расстояние пропорционально смещению ползунка
        let	shiftContent = this.scroller.offsetTop / this.ratio;
        // прокручиваем контент по событию 'wheel'
        if (this.nameEvent === 'wheel') {
            // прокручиваем контент на величину пропорциональную перемещению ползунка,
            // она имеет обратный знак, т.к. ползунок и контент прокручиваются
            // в противоположных направлениях
            this.content.style.top = -shiftContent + 'px';
            // прокручиваем контент по событию 'scroll'
        } else {
            this.content.scrollTo(0, shiftContent);
        }
        // устанавливаем координату Y начала движения мыши равной текущей координате Y
        this.start = e.clientY;
    };

    // выбираем все блоки на странице, в которых может понадобиться
    // прокрутка контента
    const containers = document.querySelectorAll('[data-control]');
    // перебираем полученную коллекцию элементов
    for (const container of containers) {
        // имя события, используемого для прокручивания контента
        let nameEvent = container.getAttribute('data-control');
        // с помощью конструктора 'ScrollBox' создаём экземпляр объекта,
        // в котором будем прокручивать контент
        let scrollbox = new ScrollBox(container, nameEvent);
        // создание скроллбара, исходя из полученных в конструкторе высот
        // контента и вьюпорта текущего блока, регистрация обработчиков событий
        scrollbox.init();
    }
};

//Назначем слушателя на кнопку авторизации
form.addEventListener('submit',auth);

function auth(event){
    //останавливаем переадресацию
    event.preventDefault();


    //отправляем get запрос на сервер для получения объекта с пользователями и перебираем его
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    let answer;
    xhr.onload = () => {
        answer = JSON.parse(xhr.response)
        let a = false;

        for (let key of answer){
            if(key.login == loginInput.value){
                if(key.password == passwordInput.value){
                    //если логин и пароль совпали, то заносим в local storage данные о пользователе
                    localStorage.setItem('user', key.firstName);
                    localStorage.setItem('userid', key.id);

                    //Смотрим хочет ли пользователь, что бы его запомнили
                    (checkbox.checked) ? localStorage.setItem('checked', true) : localStorage.setItem('checked', false)
                    console.log('Вы вошли')
                    a = true;
                    //передаем управление другой функции
                    isValid();
                    break;
                }
            }
        }
        if (!a) { console.log('Вы ввели данные неправильно') }
    };
    xhr.send();
}

//отвечает за генерацию контента на странице, если пользователь вошел в аккаунт
function isValid() {
    modalWindow.classList.add('hidden');
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    username.classList.remove('hidden');
    username.innerHTML = localStorage.user;
}

//назначаем слушателя и присваеваем ему функцию для смены имени
username.addEventListener('click', nameChange)

//генерирует поля ввода и направляет туда фокус
function nameChange(){
    username.classList.add('hidden');
    usernameInput.classList.remove('hidden');
    usernameInput.value = username.innerHTML;
    usernameInput.focus();
}

//как только фокус пропадает, то функция меняет имя(если пройдет валидацию)
usernameInput.addEventListener('blur', nameChanged)

function nameChanged(){
    if (usernameInput.value.length > 0 && usernameInput.value.length < 32) {
        localStorage.setItem('user', usernameInput.value);

        //если все прошло успешно, то отправляем запрос на сервер, где меняем информацию о пользователе
        const xhr = new XMLHttpRequest();
        let response = {
            firstName:localStorage.user
        };
        response = JSON.stringify(response);
        xhr.open('PATCH', url + '/' + localStorage.userid);
        xhr.setRequestHeader('Content-type','application/json')

        xhr.send(response);
        //и убираем поле ввода
        username.innerHTML = usernameInput.value;
        username.classList.remove('hidden');
        usernameInput.classList.add('hidden');
    } else {
        //если нет, то возвращаем старое имя и уведомляем пользователя
        username.innerHTML = localStorage.user;
        username.classList.remove('hidden');
        usernameInput.classList.add('hidden');
        console.log('Введенные данные не подходят')
    }
};

//назначаем прослушивателя для деавторизации
logoutButton.addEventListener('click',exit);

//меняет статус пользователя и генерирует контент для неавторизованного пользователя
function exit(){
    username.classList.add('hidden');
    usernameInput.classList.add('hidden');
    logoutButton.classList.add('hidden');
    loginButton.classList.remove('hidden');
    localStorage.checked = 'false';
}


//при загрузке страницы проверяем, хотел ли пользователь, что бы его запомнили и если да, то осуществляем вход
if (localStorage.checked == 'true'){
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    username.classList.remove('hidden');
    username.innerHTML = localStorage.user;
}


/* */
let intervalTextScrollDown;
let timeoutTextScrollDown;
movies.addEventListener('mouseover', shiftText)

function shiftText(event){
    if (event.target.classList.contains('movies-card__description') && event.target.offsetHeight < event.target.scrollHeight ){
            intervalTextScrollDown = setInterval(function scrollText(){
                event.target.scrollTop += 1;
                let width = event.target.scrollHeight - event.target.offsetHeight;
                if (event.target.scrollTop == width){
                    console.log('они равны');
                    clearInterval(intervalTextScrollDown);
                    timeoutTextScrollDown = setTimeout(function(){
                        event.target.scrollTop = 0;
                        intervalTextScrollDown = setInterval(scrollText,90)
                    }, 1000)
                }
            }, 90)
    }
}

movies.addEventListener('mouseout', unshiftText);

function unshiftText(event){
    if (event.target.classList.contains('movies-card__description') ){
        clearTimeout(timeoutTextScrollDown);
        clearInterval(intervalTextScrollDown)
    }
}

/* tv */
let intervalTextScrollRight;

tvScheduleCard.addEventListener('mouseover', shiftHorizontalText)

function shiftHorizontalText(event){
    if (event.target.tagName === 'SPAN'){
        pieceOfShit(event)
    }
}

tvScheduleCard.addEventListener('mouseout', unshiftHorizontalText)

function unshiftHorizontalText(event){
    if (event.target.tagName === 'SPAN'){
        clearInterval(intervalTextScrollRight)
        let a = event.target.closest('p');
        a.scrollLeft = 0;
    }
}

function pieceOfShit(event){
    let a = event.target.closest('p');
    let b = true

    if (a.offsetWidth < a.scrollWidth){
        intervalTextScrollRight = setInterval(function scrollTextRight(){
            if (b == true){
                a.scrollLeft += 2;
                console.log(a.scrollLeft)
                if (a.scrollLeft + a.offsetWidth === a.scrollWidth){
                    b = false;
                }
            } else {
                a.scrollLeft -= 2;
                if (a.scrollLeft === 0) {
                    b = true;
                }
            }
        }, 90);
    }
}