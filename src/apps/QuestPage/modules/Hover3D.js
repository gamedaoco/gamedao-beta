export class Hover3D 
{
    constructor(id)
    {
        this.id = id;
        this.xOffset = 3;
        this.yOffset = 3;
        this.attack = 0.1;
        this.release = 1;
        this.perspective = 300;
        this.create();
    }

    create()
    {
        document.querySelectorAll(this.id).forEach(element => 
        {
            const rectTransform = element.getBoundingClientRect();
            const perspective = "perspective(" + this.perspective + "px) ";
            element.style.setProperty("transform-style", "preserve-3d");
            
            element.addEventListener("mouseenter", e =>
            {
                element.style.setProperty("transition", "transform " + this.attack + "s");
                element.style.setProperty("transform", "scale(2.5)");
            })

            element.addEventListener("mousemove", e => 
            {
                let dy = e.clientY - rectTransform.top;
                let dx = e.clientX - rectTransform.left;
                let xRot = this.map(dx, 0, rectTransform.width, -this.xOffset, this.xOffset);
                let yRot = this.map(dy, 0, rectTransform.height, this.yOffset, -this.yOffset);
                let propXRot = "rotateX(" + yRot + "deg) ";
                let propYRot = "rotateY(" + xRot + "deg)";

                element.style.setProperty("transform", perspective + propXRot + propYRot + "scale(2.5)");
            })

            element.addEventListener("mouseleave", e => 
            {
                element.style.setProperty("transition", "transform " + this.release + "s");
                element.style.setProperty("transform", perspective + "scale(1) rotateX(0deg) rotateY(0deg)");
            })
        })
    }
    // Processing map() function
    map(value, istart, istop, ostart, ostop) 
    {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }
}