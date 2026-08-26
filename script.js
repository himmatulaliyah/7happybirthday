/* ========================================
   CONFIG
======================================== */

const COUNT=400;
const hearts=[];
const heartContainer=document.getElementById("heart-container");
const openBtn=document.getElementById("openBtn");
const burstCenter=document.getElementById("burstCenter");

/*=========================================
MUSIC
=========================================*/

const music=document.getElementById("music");
const musicControl=document.getElementById("musicControl");
const musicIcon=document.getElementById("musicIcon");

let musicStarted=false;
let musicFadeTimer=null;

/*=========================================
PLAY MUSIC
=========================================*/

async function playMusic(fadeDelay=800,fadeDuration=2500){

    if(!music)return;

    try{

        if(!musicStarted){

            music.currentTime=0;
            musicStarted=true;

        }

        music.volume=0;

        await music.play();

        updateMusicControl();

        setTimeout(()=>{

            fadeMusicVolume(1,fadeDuration);

        },fadeDelay);

    }catch(err){

        console.error(err);

    }

}

/*=========================================
PAUSE MUSIC
=========================================*/

function pauseMusic(){

    if(!music)return;

    fadeMusicVolume(0,500);

    setTimeout(()=>{

        music.pause();

        updateMusicControl();

    },500);

}

/*=========================================
RESUME MUSIC
=========================================*/

async function resumeMusic(){

    if(!music)return;

    music.volume=0;

    try{

        await music.play();

        updateMusicControl();

        fadeMusicVolume(1,800);

    }catch(err){

        console.error(err);

    }

}

/*=========================================
TOGGLE MUSIC
=========================================*/

function toggleMusic(){

    if(!music)return;

    if(music.paused){

        resumeMusic();

    }else{

        pauseMusic();

    }

}

/*=========================================
FADE MUSIC
=========================================*/

function fadeMusicVolume(target,duration){

    if(!music)return;

    if(musicFadeTimer){

        clearInterval(musicFadeTimer);

    }

    const start=music.volume;

    const fps=60;
    const interval=1000/fps;
    const total=Math.max(1,Math.floor(duration/interval));

    let frame=0;

    musicFadeTimer=setInterval(()=>{

        frame++;

        music.volume=
            start+
            (target-start)*
            (frame/total);

        if(frame>=total){

            music.volume=target;

            clearInterval(musicFadeTimer);

            musicFadeTimer=null;

        }

    },interval);

}

/*=========================================
MUSIC CONTROL
=========================================*/

function updateMusicControl(){

    if(!musicControl||!musicIcon)return;

    if(music.paused){

        musicControl.classList.add("pause");
        musicIcon.textContent="▶";

    }else{

        musicControl.classList.remove("pause");
        musicIcon.textContent="❚❚";

    }

}

if(musicControl){

    musicControl.addEventListener("click",toggleMusic);

}

updateMusicControl();

/* ========================================
   RANDOM
======================================== */

function rand(min,max){
    return Math.random()*(max-min)+min;
}

/* ========================================
   FULLSCREEN
======================================== */

function openFullscreen(){

    const el=document.documentElement;

    if(el.requestFullscreen){
        el.requestFullscreen().catch(()=>{});
    }else if(el.webkitRequestFullscreen){
        el.webkitRequestFullscreen();
    }else if(el.msRequestFullscreen){
        el.msRequestFullscreen();
    }

}

/* ========================================
   HEART
======================================== */

function createHeart(x,y){
    const heart=document.createElement("div");

    heart.className="heart";
    heart.innerHTML="❤";

    heart.style.left=x+"px";
    heart.style.top=y+"px";
    heart.style.fontSize=rand(16,38)+"px";

    heartContainer.appendChild(heart);

    return heart;
    
}

/* ========================================
   BURST
======================================== */

function burst(){

    const rect=openBtn.getBoundingClientRect();

    const cx=rect.left+rect.width/2;
    const cy=rect.top+rect.height/2;
    
    heartContainer.prepend(burstCenter);
    
    burstCenter.style.left=cx+"px";
    burstCenter.style.top=cy+"px";

    burstCenter.classList.remove("hide");
    burstCenter.classList.add("show");

    openBtn.style.display="none";

    setTimeout(()=>{

        burstCenter.classList.remove("show");
        burstCenter.classList.add("hide");

    },2500);

    setTimeout(()=>{

        for(let i=0;i<COUNT;i++){

            setTimeout(()=>{

                const heart=createHeart(cx,cy);

                const angle=Math.random()*Math.PI*2;
                const dist=rand(250,450);

                heart.style.setProperty("--x",Math.cos(angle)*dist+"px");
                heart.style.setProperty("--y",Math.sin(angle)*dist+"px");

                heart.style.animation=`burst ${rand(2.2,3.6)}s ease-out forwards`;

                hearts.push(heart);

            },i*5);

        }

    },550);

}

/* ========================================
   REMOVE BURST
======================================== */

function removeBurst(){

    hearts.forEach(heart=>{

        heart.style.transition="opacity 1.4s";
        heart.style.opacity=0;

        setTimeout(()=>{

            heart.remove();

        },1400);

    });

    hearts.length=0;

}

/* ========================================
   FLOATING HEART
======================================== */

function createFloatingHeart(){

    const heart=document.createElement("div");

    heart.className="heart";
    heart.innerHTML="❤";

    heart.style.left=Math.random()*window.innerWidth+"px";
    heart.style.top=window.innerHeight+40+"px";
    heart.style.fontSize=rand(10,24)+"px";

    heart.style.setProperty("--fx",rand(-120,120)+"px");

    heart.style.animation=
    `float ${rand(8,14)}s linear forwards`;

    heartContainer.appendChild(heart);

    heart.addEventListener("animationend",()=>{

        heart.remove();

    });

}

/* ========================================
   START FLOAT
======================================== */

function startFloating(){

    for(let i=0;i<20;i++){

        setTimeout(()=>{

            createFloatingHeart();

        },i*400);

    }

    setInterval(()=>{

        createFloatingHeart();

    },700);

}

/* ========================================
   LETTER ANIMATION
======================================== */

function prepareLetters(){

    document.querySelectorAll(".message-content h2").forEach(title=>{

        const words=title.textContent.trim().split(" ");

        title.innerHTML="";

        words.forEach((word,index)=>{

            const wordSpan=document.createElement("span");

            wordSpan.className="word";

            [...word].forEach(letter=>{

                const span=document.createElement("span");

                span.textContent=letter;

                span.style.animationDelay=
                prepareLetters.delay+"s";

                prepareLetters.delay+=rand(.03,.08);

                wordSpan.appendChild(span);

            });

            title.appendChild(wordSpan);

            if(index<words.length-1){

                title.appendChild(document.createTextNode(" "));

                prepareLetters.delay+=.08;

            }

        });

        prepareLetters.delay+=.3;

    });

}

prepareLetters.delay=0;


/* ========================================
   WRAP SCATTER LETTERS
======================================== */

function wrapScatterLetters(){

    document
    .querySelectorAll("#section2 .word span")
    .forEach(letter=>{

        if(letter.parentElement.classList.contains("scatter")) return;

        const wrapper=document.createElement("span");

        wrapper.className="scatter";

        letter.parentNode.insertBefore(wrapper,letter);

        wrapper.appendChild(letter);

    });

    document.querySelectorAll(".scatter").forEach((letter,index)=>{

        if(index%2===0){

            letter.style.transform="translateY(-20px) rotate(20deg)";

        }

    });

}

/* ========================================
   OPEN
======================================== */

function openInvitation(){

    playMusic();
    openFullscreen();
    burst();
    setTimeout(()=>{

        document
        .getElementById("section1")
        .classList.remove("active");

        const story=
        document.getElementById("story");

        story.classList.add("active");

        currentSection=story;

        story.querySelector(".page-scroll").scrollTop=0;

    },4150);

    startFloating();

}

/* ========================================
   LOAD
======================================== */

window.addEventListener("load",()=>{

    prepareLetters();

    openBtn.addEventListener("click",openInvitation);

});

/* ========================================
   ACTIVE SECTION
======================================== */

let currentSection = document.querySelector(".page.active");
let isAnimating = false;

/* ========================================
   SHOW SECTION
======================================== */

function showSection(id){

    if(isAnimating)return;

    const next=document.getElementById(id);

    if(!next)return;

    isAnimating=true;

    currentSection.classList.add("fade-out");

    setTimeout(()=>{

        currentSection.classList.remove("active");
        currentSection.classList.remove("fade-out");

        currentSection.querySelectorAll(".tap-next").forEach(el=>{
            el.classList.remove("show");
        });

        next.classList.add("active");
        next.classList.add("fade-in");

        if(id==="story"){

            const scroll=next.querySelector(".page-scroll");

        if(scroll){

            scroll.scrollTop=0;

    }

}

        setTimeout(()=>{

            next.classList.remove("fade-in");

            const tap=next.querySelector(".tap-next");

            if(tap){

                tap.classList.add("show");

            }

            currentSection=next;
            isAnimating=false;
            
        },900);

    },700);

}

/* ========================================
   GREETING ANIMATION
======================================== */

function playGreetingAnimation(){

    const section=document.getElementById("section3");

    const items=section.querySelectorAll(
        ".greeting-subtitle,.greeting-title,.greeting-text,.greeting-sign"
    );

    items.forEach(item=>{

        item.style.animation="none";

    });

    void section.offsetWidth;

    items.forEach(item=>{

        item.style.animation="";

    });

}


/* ========================================
   PREVENT TAP WHILE SCROLLING
======================================== */

document.querySelectorAll(".page-scroll").forEach(scroll=>{

    let moved=false;

    scroll.addEventListener("touchmove",()=>{

        moved=true;

    });

    scroll.addEventListener("touchend",()=>{

        setTimeout(()=>{

            moved=false;

        },100);

    });

    scroll.addEventListener("click",function(e){

        if(moved){

            e.stopPropagation();

        }

    });

});

/* ========================================
   RESET SCROLL
======================================== */

function resetScroll(section){

    const box=section.querySelector(".page-scroll");

    if(box){

        box.scrollTop=0;

    }

}

/* ========================================
   UPDATE SHOW SECTION
======================================== */

const oldShowSection=showSection;

showSection=function(id){

    const next=document.getElementById(id);

    if(next){

        resetScroll(next);
        updateScrollProgress();
    }

    oldShowSection(id);

};


/*=========================================
AUTO SCROLL SECTION 2 -> SECTION 3
=========================================*/

const pageScroll=document.querySelector("#story .page-scroll");
const section3=document.getElementById("section3");
const scrollHint=document.querySelector("#section2 .scroll-hint");
const scrollProgressBar=document.getElementById("scrollProgressBar");

let touchStartY=0;

function goToSection3(){

    pageScroll.scrollTo({
        top:section3.offsetTop,
        behavior:"smooth"
    });

}

/*=========================================
SCROLL PROGRESS
=========================================*/

function updateScrollProgress(){

    const max=
    pageScroll.scrollHeight-
    pageScroll.clientHeight;

    const percent=
    Math.min(
        pageScroll.scrollTop/max,
        1
    );

    scrollProgressBar.style.width=
    percent*100+"%";

}

pageScroll.addEventListener(
    "scroll",
    updateScrollProgress
);

updateScrollProgress();

/*=========================================
SCROLL HINT CLICK
=========================================*/

scrollHint.style.pointerEvents="auto";

scrollHint.addEventListener("click",()=>{

    goToSection3();

});



/*=========================================
SCROLL HINT FADE
=========================================*/

pageScroll.addEventListener("scroll",()=>{

    const progress=Math.min(pageScroll.scrollTop/120,1);

    scrollHint.style.animation="none";
    scrollHint.style.opacity=1-progress;

});

/*=========================================
SCROLLING ANIMATION
=========================================*/

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
},{
    threshold: 0.05,
    rootMargin: "0px 0px -10% 0px"
});

document.querySelectorAll(".section-content").forEach(section=>{

    sectionObserver.observe(section);

});


/*=========================================
 ANIMATION
=========================================*/

// Story Card
const storyCards=document.querySelectorAll(".story-card");

const storyObserver=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:.15
});

storyCards.forEach(card=>{

    storyObserver.observe(card);

});


// reveal animation

const revealObserver=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0,
    rootMargin:"0px 0px -150px 0px"
});

document.querySelectorAll(".reveal").forEach((el,index)=>{

    el.style.transitionDelay=(index%6)*0.12+"s";

    revealObserver.observe(el);

});


/*=========================================
LETTER OPEN + HUMAN TYPING
=========================================*/

document.addEventListener("DOMContentLoaded",()=>{

    const envelope=document.querySelector(".letter-envelope");
    const nameBox=document.querySelector(".name-box");
    const typing=document.querySelector(".typing-text");

    if(!envelope||!nameBox||!typing)return;

    const text=typing.textContent.trim();

    typing.textContent="";

    function randomDelay(index){

        const char=text[index];
        const next=text[index+1];

        // kecepatan dasar
        let delay=15+Math.random()*20;

        // selama masih satu kata jangan berhenti
        if(next&&next!==" "&&next!=="\n"){
            return delay;
        }

        // selesai satu kata
        delay+=20+Math.random()*40;

        // koma
        if(char===","){
            delay+=120+Math.random()*80;
        }

        // titik
        if(char==="."||char==="!"||char==="?"){
            delay+=350+Math.random()*250;
        }

        // paragraf baru
        if(char==="\n"){
            delay+=800;
        }

        // sesekali seperti berpikir
        if(Math.random()<0.03){
            delay+=300+Math.random()*500;
        }

        return delay;

    }

    function typeWriter(index){

        if(index>=text.length){

            typing.classList.remove("typing");
            typing.classList.add("done");

            return;

        }

        typing.textContent+=text[index];

        setTimeout(()=>{

            typeWriter(index+1);

        },randomDelay(index));

    }

    envelope.addEventListener("click",()=>{

        envelope.classList.add("hide");

        setTimeout(()=>{

            envelope.style.display="none";

            nameBox.classList.add("show");

            setTimeout(()=>{

                typing.classList.add("typing");
                typeWriter(0);

},600);

        },400);

    });

});


/*=========================================
SECTION 5 - GALLERY
=========================================*/

const lockScreen=document.getElementById("lockScreen");
const gallery=document.getElementById("gallery");

const slider=document.getElementById("giftSlider");
const track=document.getElementById("giftTrack");
const progress=document.getElementById("giftProgress");
const text=document.getElementById("giftText");

const preview=document.getElementById("preview");
const previewImage=document.getElementById("previewImage");
const closePreview=document.getElementById("closePreview");

if(
    lockScreen&&
    gallery&&
    slider&&
    track&&
    progress&&
    text
){

    const photos=document.querySelectorAll(".gallery-grid img");

    let dragging=false;
    let startX=0;
    let startLeft=0;

    function maxSlide(){
        return track.clientWidth-slider.offsetWidth;
    }

    slider.addEventListener("pointerdown",e=>{

        dragging=true;

        startX=e.clientX;
        startLeft=parseFloat(slider.dataset.x||0);

        slider.style.transition="none";
        progress.style.transition="none";

        text.classList.add("hide");
        text.classList.remove("animate");

        slider.setPointerCapture(e.pointerId);

    });

    slider.addEventListener("pointermove",e=>{

        if(!dragging)return;

        let x=startLeft+(e.clientX-startX);

        x=Math.max(0,Math.min(x,maxSlide()));

        slider.dataset.x=x;

        slider.style.transform=`translateX(${x}px)`;

        const trackRect=track.getBoundingClientRect();
        const sliderRect=slider.getBoundingClientRect();

        progress.style.width=`${sliderRect.right-trackRect.left}px`;

    });

    function endSlide(){

        if(!dragging)return;

        dragging=false;

        const x=parseFloat(slider.dataset.x||0);

        slider.style.transition=".35s ease";
        progress.style.transition=".35s ease";

        if(x>=maxSlide()*0.95){

            slider.dataset.x=maxSlide();

            slider.style.transform=`translateX(${maxSlide()-5}px)`;

            progress.style.width="100%";

            lockScreen.classList.add("hide");

            setTimeout(()=>{

                lockScreen.style.display="none";

                gallery.classList.add("show");

            },450);

        }else{

            slider.dataset.x=0;

            slider.style.transform="translateX(0)";

            progress.style.width="0";

            text.classList.remove("hide");

            void text.offsetWidth;

            text.classList.add("animate");

        }

    }

    slider.addEventListener("pointerup",endSlide);
    slider.addEventListener("pointercancel",endSlide);

    photos.forEach(photo=>{

        photo.addEventListener("click",()=>{

            previewImage.src=photo.src;

            preview.classList.add("show");

        });

    });

    function closeViewer(){

        preview.classList.remove("show");

    }

    closePreview.addEventListener("click",closeViewer);

    preview.addEventListener("click",e=>{

        if(
            e.target===preview||
            e.target.classList.contains("preview-bg")
        ){

            closeViewer();

        }

    });

    document.addEventListener("keydown",e=>{

        if(
            e.key==="Escape"&&
            preview.classList.contains("show")
        ){

            closeViewer();

        }

    });

}

/*=========================================
SECTION 6
=========================================*/

const s6Title=document.getElementById("s6Title");
const s6Divider=document.querySelector("#section6 .story-divider");
const s6Subtitle=document.getElementById("s6Subtitle");
const s6StartBtn=document.getElementById("s6StartBtn");
const s6Loading=document.getElementById("s6Loading");
const s6CandleArea=document.getElementById("s6CandleArea");
const s6Candle=document.getElementById("s6Candle");
const s6TapText=document.getElementById("s6TapText");
const s6Flame=document.getElementById("s6Flame");
const s6Overlay=document.getElementById("s6Overlay");
const s6Flash=document.getElementById("s6Flash");
const s6Ending=document.getElementById("s6Ending");
const s6Music=document.getElementById("music");
const s6Canvas=document.getElementById("s6ConfettiCanvas");
const s6Ctx=s6Canvas.getContext("2d");

let s6Dpr=Math.min(window.devicePixelRatio||1,2);
let s6Confetti;
let s6Blown=false;

/*=========================================
CONFETTI ENGINE
=========================================*/

class Section6ConfettiEngine{

    constructor(canvas){

        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
        this.width=0;
        this.height=0;
        this.particles=[];
        this.running=false;
        this.lastTime=0;
        this.gravity=.08;
        this.drag=.998;
        this.wind=.003;
        this.maxParticles=
            window.innerWidth<768
            ?400
            :720;

        this.resize();

        window.addEventListener(
            "resize",
            ()=>this.resize()
        );

    }

    resize(){

        s6Dpr=Math.min(
            window.devicePixelRatio||1,
            2
        );

        this.width=this.canvas.clientWidth;
        this.height=this.canvas.clientHeight;

        this.canvas.width=this.width*s6Dpr;
        this.canvas.height=this.height*s6Dpr;

        this.ctx.setTransform(
            s6Dpr,
            0,
            0,
            s6Dpr,
            0,
            0
        );

    }

    launch(){

        this.createBurst(
            this.width*.25,
            this.height
        );

        setTimeout(()=>{

            this.createBurst(
                this.width*.5,
                this.height
            );

        },150);

        setTimeout(()=>{

            this.createBurst(
                this.width*.75,
                this.height
            );

        },300);

        if(!this.running){

            this.running=true;
            this.lastTime=performance.now();

            requestAnimationFrame(
                this.animate.bind(this)
            );

        }

    }

    createBurst(originX,originY){

        const total=Math.floor(
            this.maxParticles/3
        );

        for(let i=0;i<total;i++){

            this.particles.push(
                this.createParticle(
                    originX,
                    originY
                )
            );

        }

    }

    createParticle(x,y){

        const colors=[
            "#ff4d6d",
            "#ff8fab",
            "#ffd54f",
            "#ffffff",
            "#80d8ff",
            "#7cff9d",
            "#ffa010",
            "#b388ff"
        ];

        const shapes=[
            "circle",
            "star",
            "heart"
        ];

        const angle=
            (-115+Math.random()*60)
            *Math.PI/180;

        const speed=
            8+Math.random()*10;

        return{

            x:x,
            y:y,
            vx:Math.cos(angle)*speed,
            vy:Math.sin(angle)*speed,
            size:3+Math.random()*4,
            color:colors[
                Math.floor(
                    Math.random()*colors.length
                )
            ],
            shape:shapes[
                Math.floor(
                    Math.random()*shapes.length
                )
            ],
            rotation:
                Math.random()*360,
            rotationSpeed:
                (Math.random()-.5)*13,
            opacity:1,
            life:0,
            maxLife:
                360+
                Math.random()*180

        };

    }

    animate(time){

        const delta=
            (time-this.lastTime)
            /16.666;

        this.lastTime=time;

        this.update(delta);
        this.draw();

        if(this.running){

            requestAnimationFrame(
                this.animate.bind(this)
            );

        }

    }

    update(delta){

        for(
            let i=this.particles.length-1;
            i>=0;
            i--
        ){

            const p=this.particles[i];

            p.life+=delta;

            p.vx*=Math.pow(
                this.drag,
                delta
            );

            p.vy*=Math.pow(
                this.drag,
                delta
            );

            p.vx+=this.wind*delta;
            p.vy+=this.gravity*delta;

            p.x+=p.vx*delta;
            p.y+=p.vy*delta;

            p.rotation+=
                p.rotationSpeed*delta;

            if(
                p.life>
                p.maxLife*.75
            ){

                p.opacity=
                    1-
                    (
                        (p.life-p.maxLife*.75)
                        /
                        (p.maxLife*.25)
                    );

            }else{

                p.opacity=1;

            }

            if(
                p.life>=p.maxLife||
                p.y>this.height+80
            ){

                this.particles.splice(
                    i,
                    1
                );

            }

        }

        if(
            this.particles.length===0&&
            this.running
        ){

            this.running=false;

        }

    }

    draw(){

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        for(
            const p of this.particles
        ){

            this.ctx.save();

            this.ctx.globalAlpha=
                p.opacity;

            this.ctx.translate(
                p.x,
                p.y
            );

            this.ctx.rotate(
                p.rotation*
                Math.PI/
                180
            );

            this.ctx.fillStyle=
                p.color;

            switch(p.shape){

                case"circle":
                    this.drawCircle(
                        p.size
                    );
                    break;

                case"star":
                    this.drawStar(
                        p.size
                    );
                    break;

                case"heart":
                    this.drawHeart(
                        p.size
                    );
                    break;

            }

            this.ctx.restore();

        }

    }

    drawCircle(size){

        this.ctx.beginPath();

        this.ctx.arc(
            0,
            0,
            size*.5,
            0,
            Math.PI*2
        );

        this.ctx.fill();

    }

    drawStar(size){

        const spikes=5;
        const outer=size;
        const inner=size*.45;

        this.ctx.beginPath();

        for(
            let i=0;
            i<spikes*2;
            i++
        ){

            const r=
                i%2===0
                ?outer
                :inner;

            const a=
                Math.PI/
                spikes*
                i;

            const x=
                Math.cos(a)*r;

            const y=
                Math.sin(a)*r;

            if(i===0){

                this.ctx.moveTo(
                    x,
                    y
                );

            }else{

                this.ctx.lineTo(
                    x,
                    y
                );

            }

        }

        this.ctx.closePath();
        this.ctx.fill();

    }

    drawHeart(size){

        this.ctx.beginPath();

        this.ctx.moveTo(
            0,
            size*.3
        );

        this.ctx.bezierCurveTo(
            size,
            -size*.7,
            size*1.7,
            size*.5,
            0,
            size*1.5
        );

        this.ctx.bezierCurveTo(
            -size*1.7,
            size*.5,
            -size,
            -size*.7,
            0,
            size*.3
        );

        this.ctx.fill();

    }

}

s6Confetti=
new Section6ConfettiEngine(
    s6Canvas
);

/*=========================================
MULAI BERDOA
=========================================*/

s6StartBtn.addEventListener("click",()=>{

    s6Title.classList.add("s6-fade");
    s6Divider.classList.add("s6-fade");
    s6Subtitle.classList.add("s6-fade");
    s6StartBtn.classList.add("s6-fade");
    
    const storyScroll=document.querySelector("#story .page-scroll");

if(storyScroll){

    storyScroll.scrollTo({
        top:storyScroll.scrollHeight,
        behavior:"smooth"
    });

}

    setTimeout(()=>{

        s6Title.style.display="none";
        s6Divider.style.display="none";
        s6Subtitle.style.display="none";
        s6StartBtn.style.display="none";

        s6Loading.classList.add("show");

    },900);

    setTimeout(()=>{

        s6Loading.classList.remove("show");

    },4700);

    setTimeout(()=>{

        s6CandleArea.classList.add("show");

    },5000);

});

/*=========================================
TIUP LILIN
=========================================*/

s6Candle.addEventListener(
    "click",
    blowSection6Candle
);

s6TapText.addEventListener(
    "click",
    blowSection6Candle
);

function blowSection6Candle(){

    if(s6Blown)return;

    s6Blown=true;

    s6Flame.classList.add("out");

    fadeMusicVolume(.15,1800);

    s6Overlay.classList.add("show");

    setTimeout(()=>{

        s6CandleArea.classList.add("s6-fade-out");

    },4700);

    setTimeout(()=>{

        s6CandleArea.style.display="none";

    },5000);

    setTimeout(()=>{

        s6Overlay.classList.remove("show");

        s6Flash.classList.add("show");

        fadeMusicVolume(1,1800);

        s6Confetti.launch();

    },5300);

    setTimeout(()=>{

        s6Flash.classList.remove("show");

    },5700);

    setTimeout(()=>{

        s6Ending.classList.add("show");

    },5900);

}
