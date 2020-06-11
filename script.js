const canvas = document.querySelector('#can8');
const ctx = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let mouse = {
    x: undefined,
    y: undefined
};

const numberOfParticles = 180; //кол-во частиц
const particlesArray = []; //массив частиц
const buttons = []; //массив кнопок (которые частицы будут обтекать)

window.addEventListener("mousemove", event =>{
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

class Button{
    constructor(x,y,width,height,basedX){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.baseX = x; //первоначальное расположение кнопки (её начала, у - не нужен, т.к. кнопка движется только по горизонтали)
    }
    update(){
        let directionX = 2.2;
        if((mouse.x < this.x + this.width && mouse.x > this.x && //если по Х в пределах кнопки
            mouse.y < this.y + this.height && mouse.y > this.y) && //и по У тоже
            //если начало кнопки не достигло конечной точки анимации (выехала на 50px влево от базовой точки baseX)
            (this.x > this.baseX - 50)){
            //animate button to the left
            this.x -=directionX; //то кнопка выезжает
            this.width +=directionX; //ширина увеличивается на пройденное расстояние
        } else if(this.x < this.baseX){ //если кнопка выехала
            this.x +=directionX; //то она будет заезжать назад
            this.width -=directionX; //ширина будет уменьшаться
        }
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.closePath();
    }
}

class Particle{
    constructor(x,y,size,weight){
        this.x = x;
        this.y = y;
        this.size = size;
        this.weight = weight; //скорость падения частиц
        this.flowingRight = false; //возможность обтекать кнопку справа
    }
    update(){
        //collision detection particle/mouse
        if(this.x > mouse.x -50 && this.x < mouse.x + 50 && //если частица находится в промежутке от -50 до 50 наведения курсора
        this.y > mouse.y - 5 && this.y < mouse.y + 5){
            this.x -=this.weight; //изм-е точки движ-я течения по х (по сути это не нужно, если не делать анимацию с курсором)
            this.y +=this.weight; //изм-е точки движ-я течения по у (и это тоже не нужно)
            this.flowingRight = true; //обтекание справа
        }

        //collision detected particle/button
        for(let i=0;i<buttons.length;++i){ //если частицы находятся в пределах одной из кнопок
            if(this.x < buttons[i].x + buttons[i].width &&
            this.x > buttons[i].x &&
            this.y < buttons[i].y + buttons[i].height &&
            this.y > buttons[i].y){
                this.weight = 0; //то движение по горизонту невозможно
                if(!this.flowingRight){ //если течение вправо запрещено
                    this.x -=4; //течёт влево
                } else { //и наоборот
                    this.x +=4;
                }
            } else { //если кнопки на пути нет
                this.weight +=0.03;
            }
        }
        if(this.y > canvas.height){ //если доходит до границы внизу
            this.y = 0 -this.size; //то появляется снова сверху
            this.x = (Math.random()*60) + 200; //точка респауна сверху по Х
            this.weight = (Math.random()*0.5) + 1; //особо коэф-ты на скор-ть сверху не влияют
            this.flowingRight = false;
        }
        this.y += this.weight;
    }
    draw(){
        ctx.fillStyle = 'rgba(128,197,222,1)';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI *2);
        ctx.fill();
    }
}

function createButtons(){
    for(let i=0;i<5;++i){
        let topMargin = 150;
        let buttonMargin = 5;
        let x = 142;
        let y = topMargin + ((50 + buttonMargin)*i);
        let height = 50;
        let width = 200;
        buttons.push(new Button(x,y,width,height));
    }
}

function drawButtons() {
    for(let i=0;i<buttons.length;++i){
        buttons[i].update();
        // buttons[i].draw();
    }
}

//animate canvas
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<particlesArray.length;++i){
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    drawButtons();
}

function createParticles(){
    for(let i=0;i<numberOfParticles;++i){
        const x = (Math.random()*60) +200;
        const y = (Math.random()*canvas.height);
        const size = (Math.random()*20) + 5;
        const weight = (Math.random()*0.5) + 1;
        particlesArray.push(new Particle(x,y,size,weight));
    }
}
createParticles();

animate();
createButtons();






