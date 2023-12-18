import G_G from "./libs/G_G.js";
import { G_Bus } from "./libs/G_Control.js";
class Front extends G_G{
  constructor(){
    super();
    const _ = this;

  }
  define(){
    const _ = this;
    _.componentName = 'front';
		_.head = _.f('.head');
		_.body = document.body;
		_.currentX = 0;
		_.currentY = 0;
		_.directionX = 'left';
		_.directionY = 'top';
    let events = [
	    'openMenu','parallaxMove',
	    'showList','reviewRight',
			'confindenceDot','confindenceRight','confindenceLeft',
			'showAccordeonItem'
    ];
    G_Bus.on(_,events);
    _.init();
  }
	openMenu({item}) {
  	const _ = this;
		console.log(_.body)
  	let head = item.closest('.head');
  	if (head.classList.contains('active')) {
		  _.body.classList.remove('non-overflow');
		  head.classList.remove('active');
	  } else {
		  _.body.classList.add('non-overflow');
		  head.classList.add('active');
	  }
  }
	showList({item}) {
  	const _ = this;
  	let cont = item.previousElementSibling;
  	if (cont.classList.contains('active')) {
  		cont.removeAttribute('style');
  		cont.classList.remove('active');
  		item.textContent = 'Show';
	  } else {
		  cont.style = `height:${cont.firstElementChild.clientHeight}px;`
  		item.textContent = 'Hide';
		  setTimeout(function (){
			  cont.classList.add('active');
		  },350)
	  }
	}

	headAppearance(){
  	const _ = this;
  	_.head.classList.remove('hidden');
	}
	defineDirections(event){
		const _ = this;
		let
			x = event.x,
			y = event.y;
		if(x > _.currentX){
			_.directionX = 'right';
		}else{
			_.directionX = 'left';
		}
		if(y > _.currentY){
			_.directionY = 'top';
		}else{
			_.directionY = 'bottom';
		}
		_.currentX = x;
		_.currentY = y;
	}
	fadedBlockInit(){
		const _ = this;
		_.fadedArr = [];
		let
			fadedItems = document.querySelectorAll('.faded');
		for(let item of fadedItems){
			_.fadedArr.push({
				item: item,
				demensions: {
					top: item.getBoundingClientRect().top + window.scrollY,
					bottom: item.getBoundingClientRect().bottom + window.scrollY
				}
			})
			//	console.log(item.getBoundingClientRect())
		}
	}
	fadedBlock(init=true){
		const _ = this;
		if(init) {
			_.fadedBlockInit();
		}
		let scrolledPoints = parseInt(window.scrollY);
		for(let item of _.fadedArr){
			let
				itemTop = item.demensions.top-_.screenHeight*1.225,
				itemBottom = item.demensions.bottom;
			let query =(scrolledPoints >= itemTop) &&	(scrolledPoints <= itemBottom);
			if(init){
				query =(scrolledPoints >= itemTop);
			}
			if(	query ){
				if(item['item'].classList.contains('confidence-subtitle')){
				}
				let
					r = scrolledPoints-itemTop,
					yPercent = 100,
					opacityPercent = 0,
					scalePercent = 1;
				if(r < 350){
					opacityPercent = (r/3)/100;
					scalePercent = 1.1 - ((r/3)/1000);
					yPercent = 100 - (r/3);
				}else{
					opacityPercent = 1;
					scalePercent = 1;
					yPercent = 0;
				}
				item['item'].style.opacity = opacityPercent;
				item['item'].style.transform =`translate3d(0px,${yPercent}px,0) scale(${scalePercent})`;
			}
		}
	}
	parallaxMove({item,event}){
		const  _ = this
		let
			x = event.x,
			y = event.y;
		_.defineDirections(event);
		for(let i=0; i < _.parallaxItems.length;i++){
			let
				item = _.parallaxItems[i],
				dirX = 'right',
				dirY = 'bottom',
				maxOffset = parseInt(item.getAttribute('data-offset')),
				currentXOffset = parseFloat(item.getAttribute('data-x-offset') ?? 0),
				currentYOffset = parseFloat(item.getAttribute('data-y-offset') ?? 0),
				offsetStepX = (maxOffset/_.screenWidth)*5,
				offsetStepY = (maxOffset/_.screenHeight)*5;
			if(i % 2){
				dirX = 'left';
				dirY = 'top';
			}else{
				dirX = 'right';
				dirY = 'bottom';
			}
			if(_.directionX == dirX){
				currentXOffset+=offsetStepX;
			}else{
				currentXOffset-=offsetStepX;
			}
			if(_.directionY == dirY){
				currentYOffset+=offsetStepY;
			}else{
				currentYOffset-=offsetStepY;
			}
			if( currentYOffset >= maxOffset ){
				currentYOffset = maxOffset;
			}
			if( currentYOffset <= (maxOffset*-1) ){
				currentYOffset = maxOffset*-1;
			}
			if(currentXOffset >= maxOffset){
				currentXOffset = maxOffset;
			}
			if(currentXOffset <= (maxOffset*-1)){
				currentXOffset = (maxOffset*-1);
			}
			item.style.transform = `translate(${currentXOffset}px,${currentYOffset}px)`;
			item.setAttribute('data-x-offset',currentXOffset);
			item.setAttribute('data-y-offset',currentYOffset);
		}
	}

	confindenceAnimationOut({leftPreviousSide,rightPreviousSide,leftCurrrentSide,rightCurrentSide}){
		leftPreviousSide.style.transform = 'translateX(-100%)';
		leftPreviousSide.style.opacity = '0';
		rightPreviousSide.style.opacity = '0';
		leftCurrrentSide.style.transform = 'translateX(50%)';
		leftCurrrentSide.style.opacity = '0';
		rightCurrentSide.style.opacity = '0';
	}
	confindenceSliderInit(){
		const _ = this;
		let
			sliderCont = _.f('.confidence-slider'),
			slides = sliderCont.querySelectorAll('.slide'),
			leftBtn = _.f('#confidence-left'),
			rightBtn = _.f('#confidence-right');
		_.confindenceSlides = slides;
		_.confindenceSlidesCnt = slides.length;
		_.createConfidenceDots();
	}
	confindenceRight(slidePos){
		const _ = this;
		_.currentConfidenceSlide++;
		if(_.currentConfidenceSlide > _.confindenceSlidesCnt){
			_.currentConfidenceSlide = _.confindenceSlidesCnt;
			return false;
		}
		let
			previousSlide = _.confindenceSlides[_.currentConfidenceSlide-2],
			leftPreviousSide = previousSlide.querySelector('.slide-left'),
			rightPreviousSide = previousSlide.querySelector('.slide-right'),
			currentSlide = _.confindenceSlides[_.currentConfidenceSlide-1],
			leftCurrrentSide = currentSlide.querySelector('.slide-left'),
			rightCurrentSide = currentSlide.querySelector('.slide-right');

		_.confindenceAnimationOut({leftPreviousSide,rightPreviousSide,leftCurrrentSide,rightCurrentSide})
		setTimeout(()=>{
			previousSlide.style.marginLeft = '-100%';
			leftCurrrentSide.style.transform = 'translateX(0%)';
			leftCurrrentSide.style.opacity = '1';
			rightCurrentSide.style.opacity = '1';
		},750);
		_.f('#confidence-dots .active').classList.remove('active');
		_.f(`#confidence-dots button[data-pos="${_.currentConfidenceSlide}"]`).classList.add('active');
	}
	confindenceLeft(slidePos){
		const _ = this;
		_.currentConfidenceSlide--;
		if(_.currentConfidenceSlide < 1){
			_.currentConfidenceSlide = 1;
			return false;
		}
		let
			previousSlide = _.confindenceSlides[_.currentConfidenceSlide],
			leftPreviousSide = previousSlide.querySelector('.slide-left'),
			rightPreviousSide = previousSlide.querySelector('.slide-right'),
			currentSlide = _.confindenceSlides[_.currentConfidenceSlide-1],
			leftCurrrentSide = currentSlide.querySelector('.slide-left'),
			rightCurrentSide = currentSlide.querySelector('.slide-right');

		_.confindenceAnimationOut({leftPreviousSide,rightPreviousSide,leftCurrrentSide,rightCurrentSide})
		setTimeout(()=>{
			currentSlide.style.marginLeft = '0%';
			leftCurrrentSide.style.transform = 'translateX(0%)';
			leftCurrrentSide.style.opacity = '1';
			rightCurrentSide.style.opacity = '1';
		},750);
		_.f('#confidence-dots .active').classList.remove('active');
		_.f(`#confidence-dots button[data-pos="${_.currentConfidenceSlide}"]`).classList.add('active');
	}
	confindenceDot({item}){
		const _ = this;
		_.f('#confidence-dots .active').classList.remove('active');
		item.classList.add('active');
		let slidePos = item.getAttribute('data-pos');

		let
			previousSlide = _.confindenceSlides[_.currentConfidenceSlide-1],
			leftPreviousSide = previousSlide.querySelector('.slide-left'),
			rightPreviousSide = previousSlide.querySelector('.slide-right'),
			currentSlide = _.confindenceSlides[slidePos-1],
			leftCurrrentSide = currentSlide.querySelector('.slide-left'),
			rightCurrentSide = currentSlide.querySelector('.slide-right');
		_.confindenceAnimationOut({leftPreviousSide,rightPreviousSide,leftCurrrentSide,rightCurrentSide})
		setTimeout(()=>{
			for(let i =0; i < _.confindenceSlides.length;i++){
				let slide = _.confindenceSlides[i];
				slide.style.marginLeft = 0;
			}
			currentSlide.style.marginLeft = `-${(slidePos-1)*100}%`;
			leftCurrrentSide.style.transform = 'translateX(0%)';
			leftCurrrentSide.style.opacity = '1';
			rightCurrentSide.style.opacity = '1';
		},750);
		_.currentConfidenceSlide = slidePos;
	}
	createConfidenceDots(){
		const _ = this;
		let dotStr = ``;
		for(let i = 0; i < _.confindenceSlidesCnt;i++){
			if(_.currentConfidenceSlide-1 == i){
				dotStr+= `
					<button class='slider-dot active' data-pos="${i+1}"
 					data-click="${_.componentName}:confindenceDot">
					</button>`;
			}else{
				dotStr+= `<button class='slider-dot' data-pos="${i+1}"  data-click="${_.componentName}:confindenceDot">
				</button>`;
			}

		}
		_.f('#confidence-dots').innerHTML = dotStr;
	}
	showAccordeonItem({item,event}){
		const _ = this;
		let
			accordeonCont = event.target.closest('.profits-accordeon'),
			accordeonItemActive = accordeonCont.querySelector('.-active'),
			accordeonItem = event.target.closest('.profits-accordeon-item');
		accordeonItemActive.classList.remove('-active')
		accordeonItem.classList.add('-active')
		console.log(item)
	}
	init(){
  	const _ = this;
  	_.headAppearance();
		_.screenWidth = window.screen['width'];
		_.screenHeight = window.screen['height'];

		_.parallaxItems = document.querySelectorAll('.parallax');
		if(_.screenWidth > 780){
			_.fadedBlock();
			window.addEventListener('scroll',_.fadedBlock.bind(_,false));
		}
		_.currentConfidenceSlide = 1;
		_.confindenceSliderInit();

  };
}
new Front();