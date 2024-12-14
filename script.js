const canvas=document.querySelector("canvas")
const cnt=canvas.getContext("2d");
const tools = document.querySelectorAll(".tool");
const fillcolor= document.querySelector("#fill-color");
const size= document.querySelector("#size-slider");
const color= document.querySelectorAll(".color .option");
const colorpicker = document.querySelector("#color-picker");
const clear= document.querySelector(".clear");
const save= document.querySelector(".save");

window.addEventListener("load",()=>{
    // setting width/height.. offsetwidth/height return viewable width/height of the element
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setbackground();
});

let isdrawing =false;
let brushwidth=5;
let selectedtool = "brush";
let previouswidth,previousheight,snapshot;
let selectedcolor= "#000";

const drawrect = (e)=>{
    if(!fillcolor.checked){
        // strokerect(x-coordinate,y-coordinate,width,height);
        return cnt.strokeRect(e.offsetX,e.offsetY,previouswidth - e.offsetX,previousheight - e.offsetY);
    }
    cnt.fillRect(e.offsetX,e.offsetY,previouswidth - e.offsetX,previousheight - e.offsetY);
}

const drawcircle = (e)=>{
    cnt.beginPath();
    let radius = Math.sqrt(Math.pow((previouswidth-e.offsetX),2)+Math.pow((previousheight-e.offsetY),2));
    //arc(x-coordinate,y-coordinate,radius,start angle, end angle);
    cnt.arc(previouswidth,previousheight,radius,0,2*Math.PI);
    fillcolor.checked ? cnt.fill() : cnt.stroke();
}

const drawtriangle=(e) =>{
    cnt.beginPath(); 
    cnt.moveTo(previouswidth,previousheight);//moving triangle to mouse pointer
    cnt.lineTo(e.offsetX,e.offsetY);//creating first line according to mouse pointer
    cnt.lineTo(previouswidth*2-e.offsetX,e.offsetY);//creating bottom line of triangle
    cnt.closePath();//closing path of the triangle so third line draw automatically
    cnt.stroke();
    fillcolor.checked ? cnt.fill() : cnt.stroke();
}

const drawline = (e) =>{
    cnt.beginPath(); 
    cnt.moveTo(previouswidth,previousheight);//moving triangle to mouse pointer
    cnt.lineTo(e.offsetX,e.offsetY);//creating first line according to mouse pointer
    cnt.stroke();
}

const drawing= (e)=>{
    if(!isdrawing) return; //if isdrawing is false return from here
    cnt.putImageData(snapshot,0,0);//adding copies canvas data on this canvas

    if(selectedtool === "brush" || selectedtool ==="eraser"){
        cnt.strokeStyle = selectedtool ==="eraser" ? "#fff" : selectedcolor;
        cnt.lineTo(e.offsetX,e.offsetY); //creating line according to mouse pointer 
        cnt.stroke();//drawing/filter line with color
    }else if(selectedtool ==="rectangle"){
        drawrect(e);
    }else if(selectedtool ==="circle"){
        drawcircle(e);
    }else if(selectedtool==="triangle"){
        drawtriangle(e);
    }else{
        drawline(e);
    }
}


const startdraw=(e)=>{
    isdrawing=true;
    previouswidth=e.offsetX;//passing previous point x
    previousheight=e.offsetY;//passing previous point y
    cnt.beginPath(); //begin new point
    cnt.lineWidth=brushwidth;
    snapshot=cnt.getImageData(0,0,canvas.width,canvas.height);//getimagedata()- method return an image data object that copies the pixel data (avoid  dragging the image)
    // set the color
    cnt.strokeStyle = selectedcolor;
    cnt.fillStyle = selectedcolor;
}
canvas.addEventListener("mousedown",startdraw); //double click to hold the mouse to draw
canvas.addEventListener("mousemove",drawing);//when isdrawing is true then, draw otherwise not draw
canvas.addEventListener("mouseup",()=> isdrawing=false); // when leave(hold) the mouse then stop the drawing

tools.forEach(btn =>{
    btn.addEventListener("click",()=>{
        // removing active from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedtool= btn.id;
        console.log(btn.id); //adding click event to all tool option
    });
})

color.forEach(btn =>{
    btn.addEventListener("click",() =>{
        // removing active from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // console.log(btn);
        console.log(window.getComputedStyle(btn).getPropertyValue("background-color"));//return - rgb(255, 0, 0)
        // passing the color 
        selectedcolor=window.getComputedStyle(btn).getPropertyValue("background-color");

    })
})
colorpicker.addEventListener("change",()=>{
    // passing picked color value from color picker to last color background
    colorpicker.parentElement.style.background = colorpicker.value;
    colorpicker.parentElement.click();
})

size.addEventListener("change",() =>brushwidth=size.value);//passing slider value 

clear.addEventListener("click",()=>{
    cnt.clearRect(0,0,canvas.width,canvas.height);
})

save.addEventListener("click",()=>{
    const link=document.createElement("a");//creating <a> element
    link.download=`${Date.now()}.jpg`;//passing canvas as link href value
    link.href = canvas.toDataURL();//passing canvasData as link href value
    link.click();//clicking link to download image
    setbackground();
})

// setting background to imag when its download
const setbackground = ()=>{
    // setting whole canvas background to white 
    cnt.fillStyle= "#fff";
    cnt.fillRect(0,0,canvas.width,canvas.height);
    cnt.fillStyle = selectedcolor;//setting fillstyle back to the selected color , it will brush color
}

const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setbackground(); // Reset background after resizing
};

// Resize canvas on window resize
window.addEventListener("resize", resizeCanvas);

// Initial call to set canvas size
resizeCanvas();

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startdraw({
        offsetX: touch.clientX - canvas.getBoundingClientRect().left,
        offsetY: touch.clientY - canvas.getBoundingClientRect().top
    });
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    drawing({
        offsetX: touch.clientX - canvas.getBoundingClientRect().left,
        offsetY: touch.clientY - canvas.getBoundingClientRect().top
    });
});

canvas.addEventListener("touchend", () => {
    isdrawing = false;
});
