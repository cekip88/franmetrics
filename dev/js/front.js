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

    let events = [
	    'burgerClick'
    ];
    G_Bus.on(_,events);
    _.init();
  }
	burgerClick({item}) {
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
	headAppearance(){
  	const _ = this;
  	_.head.classList.remove('hidden');
	}
  init(){
  	const _ = this;
  	_.headAppearance();
  };
}
new Front();