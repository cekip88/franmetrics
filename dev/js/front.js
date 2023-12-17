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
	    'showList',
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
	parallaxMove({item,event}){
		const  _ = this
		let
			x = event.x,
			y = event.y,
			parallaxItems = document.querySelectorAll('.parallax');
		_.defineDirections(event);
		for(let i=0; i < parallaxItems.length;i++){
			let
				item = parallaxItems[i],
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
  init(){
  	const _ = this;
  	_.headAppearance();
		_.screenWidth = window.screen['width'];
		_.screenHeight = window.screen['height'];


  };
}
new Front();