class VolumeSlider{

  constructor(){
    this.slider    = document.getElementById('volume-slider');
    this.icon      = document.getElementById('volume-icon');
    this.indicator = document.getElementById('volume-indicator');
    this.shape     = document.getElementById('circle-mask-shape');
    this.input     = document.getElementById('volume-input');

    this._lock     = false;
    this._charging = false;
    this._charge   = 0;
    this._volume   = 0;

    this.input.value = this._volume;

    this.icon.addEventListener('mousedown', () => { this.charge(); });
    this.icon.addEventListener('mouseup', () => { this.release(this._charge); });
    this.icon.addEventListener('touchstart', () => { this.charge(); });
    this.icon.addEventListener('touchend', () => { this.release(this._charge); });
  }


  /**
   * Begin charge cycle
   */
  charge(){

    if(this._lock){ return false; }
    this._lock = true;

    // Reset
    this._charge   = 0;
    this._charging = true;

    // Hide indicator
    this.indicator.style.visibility = 'hidden';
    this.indicator.style.opacity    = '0';
    this.indicator.style.left = 10;

    /**
     * Charge loop
     */
    let cycle = () => {
      if(this._charging && ++this._charge < 100){
        //document.getElementById("out").innerHTML = this._charge;
        requestAnimationFrame(() => {
          cycle();
        });
      }

      // Update icon styles
     //this.shape.style.transform = `scale(${this._charge / 100})`;
       //document.getElementById("out").innerHTML = this._charge;

      this.shape.style.transform = `translateX(${-33 +this._charge/100 * 20}px)`;
      this.icon.style.transform  = `rotate(${-0.35 * this._charge * 0.75}deg)`;
    };

    setTimeout(() => cycle(), 100);
  }


  /**
   * Release and fire based on charge
   * @param  {float} charge
   */
  release(charge){
    // Reset charge animation
    this._charging = false;
    requestAnimationFrame(() => { this.shape.style.transform = `scale(0)`; });

    // Animation vars
    let y_cap    = charge * 0.35 * 0.5,
        y_start  = -0.3 * charge,
        x_cap    = charge * 6.4,
        x_start  = -10,
        duration = 20 + (9 * charge),
        start    = new Date().getTime(),
        volume   = this._volume,
        rotate;

    // Y animation
    let y_swap = duration * 0.55;

    let y_duration_up   = y_swap,
        y_duration_down = duration - y_swap;

    let y           = y_start,
        y_diff_up   = -y_cap,
        y_diff_down = (y_cap - y_start);

    // X animation
    let x      = x_cap,
        x_diff = x_cap - 10;

    // Display indicator
    this.indicator.style.visibility = 'visible';
    this.indicator.style.opacity    = '1';

    /**
     * Animation loop
     */
    let animate = () => {
      let elapsed = new Date().getTime() - start;

      if(elapsed < duration){
        // Animate
        requestAnimationFrame(() => { animate(); });

        if(elapsed < y_duration_up){
          // Y up
          y = this.easeOut(elapsed, y_start, y_diff_up, y_duration_up);
        }else{
          // Y down
          y = this.easeIn(elapsed - y_duration_up, y_start - y_cap, y_diff_down, y_duration_down);
        }

        // Set values
        x            = this.linearTween(elapsed, 0, x_diff, duration);
        rotate       = this.easeInOut(elapsed, -0.4 * this._charge, 0.4 * this._charge , duration);
        this._volume = this.easeOut(elapsed, volume, charge - volume, duration * 0.5);
      }else{
        // End of animation
        this._lock = false;
         setTimeout(function(){
            /* if("index.html".indexOf(document.location.href) > -1)
             document.getElementById("out").innerHTML = "true";
             }
             else{
             document.getElementById("out").innerHTML = "false";
             }*/
            // document.getElementById("out2").innerHTML = x;
             if(x < 110 && x > 20){
             document.location.href = "index.html";
             }
             else if (x < 290 && x > 20){
             document.location.href = "b.html";
             }
             else if(x < 470 && x > 20){
              document.location.href = "c.html";
             }
             else if(x > 20){
                 document.location.href = "d.html";
             }
             /*if(x > 100 && document.location.href != "b.html"){
        //document.location.href = "b.html";
                }
             else if(document.location.href != "index.html"){
                // document.location.href = "index.html"
             }*/
        }, 500);

          // Set values
        x            = x_cap;
        y            = 0;
        rotate       = 0;
        this._volume = charge;
      }

      // Render values
      this.icon.style.transform      = `rotate(${rotate}deg)`;
      this.indicator.style.transform = `translateX(${x}px) translateY(${y}px)`;
      this.input.value               = this._volume;
    };

    animate();
  }


  /**
   * Linear progression
   */
  linearTween(t, b, c, d){
    return c*t/d + b;
  }


  /**
   * Cubic ease-in progression
   */
  easeIn(t, b, c, d){
    t /= d;
    return c*t*t*t + b;
  }


  /**
   * Cubic ease-out progression
   */
  easeOut(t, b, c, d){
    t /= d;
    t--;
    return c*(t*t*t + 1) + b;
  }


  /**
   * Cubic ease-in-out progression
   */
  easeInOut(t, b, c, d){
    t /= d/2;
    if (t < 1){
      return c/2*t*t*t + b;
    }
    t -= 2;
    return c/2*(t*t*t + 2) + b;
  }

}



new VolumeSlider();
