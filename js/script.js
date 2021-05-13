window.addEventListener('DOMContentLoaded', async() => {
    class MenuCard {
        constructor(src, index, title, parentSelector) {
            this.src = src;
            this.index = index;
            this.title = title;
            this.parent = document.querySelector(parentSelector);
        }
        render() {
            if(this.index > 4){
                this.parent = document.querySelector(".templatemo_main2");
            }
            const element = document.createElement('div');
            element.classList.add("product-wrap");
            element.innerHTML = `
                <div class="product-image">
                <a href="">
                    <img src=${this.src}>
                    <div class="shadow"></div>
                </a>
                <a class="detail-link" href="" title="Быстрый просмотр"></a>
                <div class="actions">
                    <div class="actions-btn">
                        <a class="chouse-btn ${this.index}" href="chouse.html" title="Перейти"></a>
                    </div>
                </div> 
                </div>
                <div class="product-list">
                <h3>${this.title}</h3>
                </div>
            `;
            this.parent.append(element);
        }
    }
    const rel = await getResource('http://localhost:3000/cards')
    .then(data => {
        data.forEach(({img, index, title}) => {
            new MenuCard(img, index, title, ".templatemo_main").render();
        });
    });
    const tabsParent = document.querySelectorAll('.detail-link'),
          fav = document.getElementById('forclick');
    tabsParent.forEach((item, i) => {
        item.addEventListener('click', (event) => {
            if (i == 0) {
                window.open('img/Spezial/SpezialMain.jpg');
            }
            else if (i == 1) {
                window.open('img/GelRocket/GelRocketMain.jpg');
            }
        });
    });
    //Modal
    const modalTrigger = document.querySelector('[data-modal]'),
          modalTrigger1 = document.querySelector('[data-modal1]'),
          modal = document.querySelector('.modal'),
          modal1 = document.querySelector('.modal1');


    
    modalTrigger.addEventListener('click', openModal);
    modalTrigger1.addEventListener('click', openModal1);

    //Registration
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });
    //Enter
    function closeModal1() {
        modal1.classList.add('hide');
        modal1.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal1() {
        modal1.classList.add('show');
        modal1.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modal1.addEventListener('click', (e) => {
        if (e.target === modal1 || e.target.getAttribute('data-close') == "") {
            closeModal1();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal1.classList.contains('show')) { 
            closeModal1();
        }
    });

    const modalTimerId = setTimeout(openModal1, 3000);
    //Cards
    

  

    async function getResource(url) {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }
    fav.addEventListener('click',async (e) => {
        let prod = document.querySelectorAll('.product-wrap');
        let temp = [];
        const response = await getResource('http://localhost:3000/cards')
        .then(data => {
            data.forEach(({favorites}, i) => {
               if(favorites == 1){
                    temp[i] = 1;
               }
               else{
                temp[i] = 0;
               }
            });
        });
        prod.forEach((item,i)=>{
            console.log(temp[i]);
            if(temp[i] == 0){
                item.classList.add('hide');
            }
        });
        
    });

    //Reg
    const form = document.querySelector('.form_reg');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    bindPostData(form);


    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
    
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
        
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Enter
    const formCheck = document.querySelector('.form');
    const messageCheck = {
        failure: 'Че-то не так чувак'
    };

    check(form);
    function check(form) {
        formCheck.addEventListener('submit', async(e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            formCheck.insertAdjacentElement('afterend', statusMessage);
        
            const formData = new FormData(formCheck);
            

            const rel = await getResource('http://localhost:3000/requests')
            .then(data => {
                data.forEach(({Nickname}) => {
                    if(Nickname == formData.get("Nickname")){
                        console.log("tre");
                        formCheck.reset();
                        closeModal1();

                    }
                });
            });

        });
    }
    const chouses = document.querySelectorAll('.chouse-btn');
    chouses.forEach(item =>{
        item.addEventListener('click', (e) => {
            localStorage.setItem('index', item.classList[1]);
        });
        
    });
    
});