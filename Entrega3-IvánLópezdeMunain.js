
/*

Práctica 3: Iván López de Munain Quintana

*/

//Variables globales
var gl = null,
    canvas = null,
    glProgram = null,
    Frag_Shader = null,
    Vertex_Shader = null;       

//bufferes y localizaciones
var  posicionLocation = null, 
     normalLocation = null,
     rotacionLocation = null,
     Vertex_Buffer = null,
     Normal_Buffer = null;

//texturas y buffer
var texture = null;
var Texture_Buffer = null;
var uTexture = null;

//posicion de la luz inicial
var posicionLuzLocation  = null;
var posicionLuz = [0,0,1];


//localizaciones y valores luz ambiente
var booleanoAmbienteLocation = null;
var intAmbienteLocation  = null;
var luzAmbiente = 0; 
var valorLuzAmbiente= 0;

//localizaciones y valores luz difusa
var booleanoDifusoLocation = null;
var intDifusoLocation  = null;
var luzDifusa = 1; 
var valorLuzDifusa = 0.5;


//localizaciones y valores luz especular
var booleanoEspecularLocation = null;
var intEspecularLocation = null;
var luzEspecular = 0;
var valorLuzEspecular = 0;
var brillantezLocation = null;
var valorBrillantez = 1;

//sliders y salidas correspondientes
var Slider_Ambiente=null;
var Slider_Difuso=null;
var Slider_Especular=null;
var Slider_Brillantez=null;
var Slider_X=null;
var Slider_Y=null;
var Slider_Z=null;
var output1= null;
var output2= null;
var output3= null;
var output4= null;
var output5= null;
var output6= null;
var output7= null;


//indicadores de texturas que se esta utilizando (inicialmente sin textura, color rojo)
//destacar que "discoteca" no es ninguna textura como tal, tan solo es un cambio de colores continuo. Pero me parecio bonito y lo he dejado
var mix=0;
var acero=0;
var dibujos=0;
var carpeta=0;
var discoteca=0;

//variables para manejar la rotacion automatica en cualquiera de los ejes
var rotacionX =0;
var rotacionY =0;
var rotacionZ =0;
var theta = [ 45.0, 45.0, 45.0];
var thetaLoc=null;
var booleanoRotacionLocation=null;
var rotacionAutomatica = false;

//color de la luz cuando aplicas las texturas (solo se usa cuando se aplican las texturas)
var colLuzTexturas= [1,1,1];

// bool_Material se utiliza para saber si dibujar una textura o el color base rojo
//lo implemente con un vec2 porque no me dejaba pasar booleanos al fragment shader (no sé si se puede)
var bool_Material=[0,0];

//coordenadas de textura cuando se realiza el mix de texturas
//para implentar varias texturas por cara hize una composición de fotos y usé las coordenadas para asignar una textura distinta a cada cara
var textureCoord_Mix = [

    //cara1
    0,0,
    0,0.5, 
    1/3,0,
    0,0.5,
    1/3,0.5,
    1/3,0,
    // cara2
    1/3,0,
    1/3,0.5,
    2/3,0,
    1/3,0.5,
    2/3, 0.5, 
    2/3,0,
    //cara 3
    2/3,0,
    2/3,0.5,
    1,0,
    2/3,0.5,
    1,0.5,
    1,0,
    //cara4
    0,0.5,
    0,1,
    1/3,0.5,
    0,1,
    1/3,1,
    1/3,0.5,
    //cara5
    1/3,0.5,
    1/3,1,
    2/3,0.5,
    1/3,1,
    2/3,1,
    2/3,0.5,
    //cara 6
    2/3,0.5,
    2/3,1,
    1,0.5,
    2/3,1,
    1,1,
    1,0.5,
    ];

//coordenadas de texturas cuando se usa la misma textura para todas las superficies 
var textureCoord=[  
    0,1, 0,0, 1,0,
    1,1, 0,1, 1,0, 

    0,0, 1,0, 0,1,
    1,1, 0,1, 1,0,   

    0,0, 0,1, 1,0,
    1,1, 1,0, 0,1,

    0,1, 1,0, 0,0,
    1,1, 1,0, 0,1, 

    0,1, 0,0, 1,0,
    1,1, 0,1, 1,0, 

    1,1, 0,0, 1,0,
    0,1, 0,0, 1,1,       
];

//vertices del cubo
var   Vertices =[
    
    //frente
    -0.400, 0.400, 0.40,
    -0.40, -0.40, 0.40,
     0.40,-0.40, 0.40,
     0.40, 0.40, 0.40,
    -0.40, 0.40, 0.40,
     0.40,-0.40, 0.40,
     //arriba
    -0.40, 0.40, 0.40,
     0.40, 0.40, 0.40,
    -0.40, 0.40,-0.40,
     0.40, 0.40,-0.40,
    -0.40, 0.40,-0.40,
     0.40, 0.40, 0.40,
     //abajo
    -0.40, -0.40, 0.40,
    -0.40, -0.40,-0.40,
     0.40, -0.40, 0.40,
     0.40, -0.40,-0.40,
     0.40, -0.40, 0.40,
    -0.40, -0.40,-0.40,
    //detras
    -0.40, 0.40, -0.40,
     0.40,-0.40, -0.40,
    -0.40, -0.40,-0.40, 
     0.40, 0.40, -0.40,
     0.40,-0.40, -0.40,
    -0.40, 0.40, -0.40,
    //dch    
    0.40, 0.40, 0.40,
    0.40, -0.40, 0.40,
    0.40, -0.40,-0.40,
    0.40, 0.40,-0.40,
    0.40, 0.40, 0.40,
    0.40, -0.40,-0.40,
    //izq  
   -0.40, 0.40, 0.40,
   -0.40, -0.40,-0.40,
   -0.40, -0.40, 0.40,
   -0.40, 0.40,-0.40,  
   -0.40, -0.40,-0.40,
   -0.40, 0.40, 0.40,

];


//a continuación se calculan las normales de todos los vertices con la funcion calculoNormales() explicada posteriormente
//el resultado se almacena en Normales
var i=0;
var Normales=[];
var norm = [];
while(i<Vertices.length){

    var p1 = [Vertices[i],Vertices[i+1], Vertices[i+2]];
    var p2 =  [Vertices[i+3],Vertices[i+4], Vertices[i+5]];
    var p3 =  [Vertices[i+6],Vertices[i+7], Vertices[i+8]];

    norm = calculoNormales(p1,p2,p3);

    Normales = [...Normales,...norm,...norm,...norm];

    i = i + 9;
}



//ademas se añaden esferas con distintos centros rodeando al cubo (se usa la funcion esfera())
//en cada iteracion se pinta una esfera, se hallan sus normales y se añade la solucion a Vertices y a Normales
//arrays solVertices, indexData y VerticesSol se van sobreescribiendo en cada iteracion
//ademas se calculan las texturas correspondientes en textureCoordEsferas que tambien se ira sobreescribiendo
//el resultado de texturas se almacena en textureCoord_Mix y en textureCoord 

var solVertices=[];
var indexData = [];
var VerticesSol=[];
var textureCoordEsferas=[];

//En las texturas de las esferas, para simplicarlo, he utilizado siempre el mismo patron (incluir la imagen completa por triangulo)
//lo he dejado asi porque al contar con tantos triangulos se quedaban unos patrones de texturas bonitos  
var auxText1=[0,0];
var auxText2=[0,1];
var auxText3=[1,0];
var auxText4=[0,1];
var auxText5=[1,1];
var auxText6=[1,0];

//coordenadas de las esferas (le costara cargar un poco, si no se puede ejecutar con una sola esfera, aunque mejor con todas)
var coordenadas = [[0,3.25,0],[0,-3.25,0],[3.25,0,0],[-3.25,0,0],[0,0,3.25],[0,0,-3.25]];
//var coordenadas = [[0,3.25,0]];

for (elem in coordenadas){
    var solVertices=[];
    var indexData = [];
    var VerticesSol=[];
    
    esfera(coordenadas[elem][0],coordenadas[elem][1],coordenadas[elem][2],0.2);

    //calculo de vertices de las esferas
    var k =0;
    for(j=0;j<indexData.length;j++){
        VerticesSol[k]=-1*solVertices[indexData[j]*3];
        VerticesSol[k+1]=-1*solVertices[indexData[j]*3+1];
        VerticesSol[k+2]=-1*solVertices[indexData[j]*3+2];
        k=k+3;
    }

    //calculo de Normales
    var i=0;
    var NormalesSol=[];
    var norm = [];
    while(i<VerticesSol.length){

        var p1 = [VerticesSol[i],VerticesSol[i+1], VerticesSol[i+2]];
        var p2 =  [VerticesSol[i+3],VerticesSol[i+4], VerticesSol[i+5]];
        var p3 =  [VerticesSol[i+6],VerticesSol[i+7], VerticesSol[i+8]];

        norm = calculoNormales(p1,p2,p3);

        NormalesSol = [...NormalesSol,...norm,...norm,...norm];

        i = i + 9;
    }

    //se añade al vector general de vertices y normales
    Vertices=[...Vertices,...VerticesSol];
    Normales=[...Normales,...NormalesSol];

    //texturas de las esferas
    for(a=0;a<VerticesSol.length;a=a+3*6){

        textureCoordEsferas=[...textureCoordEsferas, ...auxText1,...auxText2,...auxText3,...auxText4,...auxText5,...auxText6];
    }
    
    //se añaden a los vectores generales de texturas
    textureCoord_Mix= [...textureCoord_Mix,...textureCoordEsferas];
    textureCoord= [...textureCoord, ...textureCoordEsferas];

}



/********************* 1. INIT WEBGL **************************************/ 
function initWebGL()
{
    canvas = document.getElementById("canvas");
    body = document.getElementById("body");
    gl = canvas.getContext("webgl");
    
    
    if(gl) {

        setUpSliders_Color();
        setUpCheckboxes();
        setupWebGL();
        initShaders();
        deteccionRaton();
        setupBuffers();
        drawScene();    
        animation(); 

    } 
    else {  
        alert("WebGl does not work in this browser");
    }   
}

/********************* 2.setupWEBGL **************************************/ 
function setupWebGL()
      {
        // Sets the background color to white.
        gl.clearColor(1,1,1,1);

        //Creates a viewport with the canvas size.
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Mode ON DEPTH
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);        
  
        gl.enable(gl.BLEND);
        gl.enable(gl.CULL_FACE);

        inicializarMatrices();
        
      }

/********************* 3. INIT SHADER **************************************/ 
function initShaders()
    {
    
    //1.Obtains the shaders' references.
    var fs_source = document.getElementById('fragment-shader').innerHTML;
    var vs_source = document.getElementById('vertex-shader').innerHTML;

    //2.Compiles the shaders.
    Vertex_Shader = makeShader(vs_source, gl.VERTEX_SHADER);
    Frag_Shader = makeShader(fs_source, gl.FRAGMENT_SHADER);

    //3. Creates a program.
    glProgram = gl.createProgram();

    //4. Attaches each shader to the program.
        gl.attachShader(glProgram, Vertex_Shader);
        gl.attachShader(glProgram, Frag_Shader);
        gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("No se puede inicializar el Programa .");
        }

    //5. Uses the program
    gl.useProgram(glProgram);
  
    }

/********************* 3.1. MAKE SHADER **************************************/ 
function makeShader(src, type)
{
    //Compiles each shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

/********************* 5.1 SETUP BUFFERS  **************************************/ 
function setupBuffers(){         

    
    // ==================== Vertices ==================
    Vertex_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Vertex_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vertices), gl.STATIC_DRAW);         
    
    posicionLocation = gl.getAttribLocation(glProgram, "a_position");
    gl.enableVertexAttribArray(posicionLocation);        

    gl.bindBuffer(gl.ARRAY_BUFFER, Vertex_Buffer);
    gl.vertexAttribPointer(posicionLocation, 3, gl.FLOAT, false, 0, 0);    

    // ====================== Normales ==========================
    Normal_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,Normal_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Normales), gl.STATIC_DRAW);

    normalLocation = gl.getAttribLocation(glProgram,"a_normal");
    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, Normal_Buffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);


    // ======================= Texturas =========================

    texture = gl.createTexture();

    //selectiva en funcion de que textura se elija
    //siempre se crea una textura aunque no tiene porque usarse en el fragment shader, porque me parecia conveniente dejar la posibilidad de ver un color basico (en este caso el rojo)
    //quiza no sea el metodo mas eficiente porque siempre se crea una textura aunque no se use
    if(mix==1){
        texture.image = loadImage("Texturas/mix-materiales.png");
    }else if(acero==1){
        texture.image = loadImage("Texturas/acero.png");
    }else if(dibujos==1){
        texture.image = loadImage("Texturas/dibujos.jpg");
    }else{
        texture.image = loadImage("Texturas/carpeta.jpg");
    }
    
    Texture_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,Texture_Buffer);

    //coger unas coordenadas de textura u otras en funcion de la imagen que se escoga (si es mix de materiales o solo una textura)
    if(mix==1){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord_Mix), gl.STATIC_DRAW);  
    }else{
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW); 
    }
    
    textureLocatAttrib = gl.getAttribLocation(glProgram, "aTexCoord");
    gl.enableVertexAttribArray(textureLocatAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER,Texture_Buffer);
    gl.vertexAttribPointer(textureLocatAttrib,2,gl.FLOAT,false,0,0);  

    //============= localizacion resto de atributos =============
  
    posicionLuzLocation = gl.getUniformLocation(glProgram,"posicion_Luz");
    intAmbienteLocation = gl.getUniformLocation(glProgram,"ambienteCoef");
    intDifusoLocation = gl.getUniformLocation(glProgram, "difusoCoef");
    intEspecularLocation = gl.getUniformLocation(glProgram, "especularCoef");
    brillantezLocation = gl.getUniformLocation(glProgram, "brillantez");
    uTexture = gl.getUniformLocation(glProgram,'uTexture');
    uMvMatrix = gl.getUniformLocation(glProgram, 'uMvMatrix');
    booleanoMixLocation = gl.getUniformLocation(glProgram, "a_boolMixtext");
    colorAleatorioLocation = gl.getUniformLocation(glProgram, "a_colorAleatorio")
    colLuzTexturasLocation = gl.getUniformLocation(glProgram, "colLuzTexturas");

} 

/*************** Cargar una imagen  ******************/

function loadImage(url) {
    var image = new Image();
    image.src = url;
    image.onload = function(){ setTexture(texture);};
    return image;
  }
  

/************************* Set textura *****************************/

function setTexture(){
    
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA, gl.UNSIGNED_BYTE, texture.image);

    // Filtering parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // Repetition parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    // Mipmap creation
    gl.generateMipmap(gl.TEXTURE_2D);

    
}

/********************* 6 Draw Scene     *********************************** */
function drawScene(){   
  
    //rotacion automatica o raton (no se pueden las dos a la vez)
    if(rotacionX==0 && rotacionY==0 && rotacionZ==0){
        mat4.multiply(PMatrix,MvMatrix,MvMatrix);
    }else{
        MvMatrix= rotacionAut(theta);
    }
    gl.uniformMatrix4fv(uMvMatrix, false, MvMatrix);
    
    //posicion de la luz
    gl.uniform3fv(posicionLuzLocation,posicionLuz);

    //dependiendo si esta activada se pasa el coeficiente o un vector de ceros
    if(luzAmbiente==1){
        var aux1=[valorLuzAmbiente,valorLuzAmbiente,valorLuzAmbiente];
    }else{
        var aux1=[0,0,0];
    }
    gl.uniform3fv(intAmbienteLocation,aux1);

    //dependiendo si esta activada se pasa el coeficiente o un vector de ceros
    if(luzDifusa==1){
        var aux2 =[valorLuzDifusa,valorLuzDifusa,valorLuzDifusa];
    }else{
        var aux2 = [0,0,0];
    }
    gl.uniform3fv(intDifusoLocation, aux2);

    //dependiendo si esta activada se pasa el coeficiente o un vector de ceros
    if(luzEspecular==1){
        var aux3 =[valorLuzEspecular,valorLuzEspecular,valorLuzEspecular];
    }else{
        var aux3 = [0,0,0];
    }
    gl.uniform3fv(intEspecularLocation, aux3);  

    //coeficiente de brillantez
    gl.uniform1f(brillantezLocation, valorBrillantez);

    //para saber si se dibuja textura o no
    gl.uniform2fv(booleanoMixLocation, bool_Material);

    //si no se dibuja textura se puede dejar por defecto en color rojo o en efecto "discoteca"
    if(discoteca==1){
        //cambio de colores de forma continua
        gl.uniform3fv(colorAleatorioLocation,[Math.random(),Math.random(),Math.random()]);
    }else{
        //color rojo base de inicio
        gl.uniform3fv(colorAleatorioLocation,[1,0,0]);
    }

    //color del foco de luz cuando hay texturas
    gl.uniform3fv(colLuzTexturasLocation, colLuzTexturas);
        
    
    //modificacion del angulo cuando la rotacion es continua
    if(rotacionX==1){
        theta[0] += 2.0;
    }

    if( rotacionY==1){
        theta[1]+=2;
    }

    if(rotacionZ==1){
        theta[2]+=2;
    }

 
    //Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, (Vertices.length/3));

}

function animation(){
    drawScene();
    requestAnimationFrame(animation);
}

//inicializaciones de los sliders
function setUpSliders_Color(){
    
    //mostrar los valores de los sliders
    output1 = document.getElementById("demo1");
    output2 = document.getElementById("demo2");
    output3 = document.getElementById("demo3");
    output4 = document.getElementById("demo4");
    output5 = document.getElementById("demo5");
    output6 = document.getElementById("demo6");
    output7 = document.getElementById("demo7");
    
    //todos los sliders
    Slider_Ambiente = document.getElementById("sliderLA");
    Slider_Difuso = document.getElementById("sliderLD");
    Slider_Especular = document.getElementById("sliderLS");
    Slider_Brillantez = document.getElementById("sliderBrillantez");
    Slider_X = document.getElementById("sliderX");
    Slider_Y = document.getElementById("sliderY");
    Slider_Z = document.getElementById("sliderZ");
    


    //condiciones iniciales (tan solo hay luz difusa)
    d3.select("#sliderLA").property("disabled", true).style("opacity",0.25);
    d3.select("#sliderLS").property("disabled", true).style("opacity",0.25);
    d3.select("#sliderBrillantez").property("disabled", true).style("opacity",0.25);

    //manejador del color para la luz de las texturas
    var selectorColor = document.getElementById("selectorCol");
    selectorColor.value="#ffffff";
    selectorColor.addEventListener("input", function() {
        colLuzTexturas = hexToRgb(selectorColor.value); 
     }, false);

    //valores iniciales sliders
    Slider_Ambiente.value = "0"; 
    output1.innerHTML=Slider_Ambiente.value;

    Slider_Difuso.value = "0.5"; 
    output2.innerHTML= Slider_Difuso.value;

    Slider_Especular.value="0";
    output3.innerHTML= Slider_Especular.value;

    Slider_Brillantez.value = "1";
    output4.innerHTML=Slider_Brillantez.value;

    Slider_X.value="0";
    output5.innerHTML=Slider_X.value;

    Slider_Y.value="0";
    output6.innerHTML=Slider_Y.value;

    Slider_Z.value="1";
    output7.innerHTML=Slider_Z.value;
}

//inicializaciones de los checkboxes
function setUpCheckboxes() {    
    d3.select("#checkboxAmbiente").property("checked", (luzAmbiente == 1));
    d3.select("#checkboxDifusa").property("checked", (luzDifusa == 1));
    d3.select("#checkboxEspecular").property("checked", (luzEspecular == 1));
    d3.select("#checkboxMix").property("checked", (mix == 1));
    d3.select("#checkboxAcero").property("checked", (acero == 1));
    d3.select("#checkboxDibujos").property("checked", (dibujos == 1));
    d3.select("#checkboxCarpeta").property("checked", (carpeta == 1));
    d3.select("#checkboxDiscoteca").property("checked", (discoteca == 1));
    d3.select("#rotacionX").property("checked", (rotacionX == 1));
    d3.select("#rotacionY").property("checked", (rotacionY == 1));
    d3.select("#rotacionZ").property("checked", (rotacionZ == 1));

}


//========================================== Manejadores de sliders y checkboxes ==================================

//se actualiza el valor y se muestra en el span correspondiente (igual en todos los sliders)
function sliderContLA(){
    valorLuzAmbiente = Slider_Ambiente.value;
    output1.innerHTML = Slider_Ambiente.value; 
       
}

 
function sliderContLD(){
    valorLuzDifusa = Slider_Difuso.value; 
    output2.innerHTML = Slider_Difuso.value; 
}
 
function sliderContLS(){
    valorLuzEspecular = Slider_Especular.value;
    output3.innerHTML = Slider_Especular.value;  
    
}
function sliderCoefBrillo(){
    valorBrillantez = Slider_Brillantez.value; 
    output4.innerHTML = Slider_Brillantez.value;    
}

function sliderX(){
    posicionLuz[0] = Slider_X.value; 
    output5.innerHTML = Slider_X.value; 
}
 
function sliderY(){
    posicionLuz[1] = Slider_Y.value; 
    output6.innerHTML = Slider_Y.value; 
}
function sliderZ(){
    posicionLuz[2] = Slider_Z.value; 
    output7.innerHTML = Slider_Z.value; 
}

//handlers checkboxes -> bifurcacion: 
//  -pulsado: activaciones, destactivaciones y actualizaciones correspondientes
//  -despulsado: activaciones, desactivaciones y actualizaciones correspondientes

function checkbox_Ambiente() {
        
    if(luzAmbiente == 0) {
        luzAmbiente = 1;
        d3.select("#sliderLA").property("disabled", false).style("opacity",1);
    } else {
        luzAmbiente = 0;
        d3.select("#sliderLA").property("disabled", true).style("opacity",0.3);
    }
}
function checkbox_Difusa() {
        
    if(luzDifusa == 0) {
        luzDifusa = 1;
        d3.select("#sliderLD").property("disabled", false).style("opacity",1);
    } else {
        luzDifusa = 0;
        d3.select("#sliderLD").property("disabled", true).style("opacity",0.3);
    }
}
function checkbox_Especular() {
        
    if(luzEspecular == 0) {
        luzEspecular = 1;
        d3.select("#sliderLS").property("disabled", false).style("opacity",1);
        d3.select("#sliderBrillantez").property("disabled", false).style("opacity",1);
    } else {
        luzEspecular = 0;
        d3.select("#sliderLS").property("disabled", true).style("opacity",0.3);
        d3.select("#sliderBrillantez").property("disabled", true).style("opacity",0.3);
    }
}

function checkbox_Mix(){
    if(mix==0){
        mix=1;
        acero=0;
        dibujos=0;
        carpeta=0;
        discoteca=0;
        bool_Material = [mix,1]; 
        d3.select("#checkboxMix").property("disabled", false).style("opacity",1);
        d3.select("#checkboxAcero").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxDibujos").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxCarpeta").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxDiscoteca").property("disabled", true).style("opacity",0.3);
        setupBuffers();    
    }else{
        mix=0;
        d3.select("#checkboxAcero").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxDibujos").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxCarpeta").property("disabled", false).style("opacity",1);
        d3.select("#checkboxDiscoteca").property("disabled", false).style("opacity",1);
        bool_Material = [mix,0];
    }

}

function checkbox_Acero(){
    if(acero==0){
        acero=1;
        mix=0;
        dibujos=0;
        carpeta=0;
        discoteca=0;
        bool_Material = [acero,1];
        d3.select("#checkboxMix").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxAcero").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxDibujos").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxCarpeta").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxDiscoteca").property("disabled", true).style("opacity",0.3);
        setupBuffers();
    }else{
        acero=0;
        d3.select("#checkboxCarpeta").property("disabled", false).style("opacity",1);
        d3.select("#checkboxMix").property("disabled", false).style("opacity",1);
        d3.select("#checkboxDibujos").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxDiscoteca").property("disabled", false).style("opacity",1);
        bool_Material = [acero,0];
    }


}

function checkbox_Dibujos(){
    if(dibujos==0){
        dibujos=1;
        acero=0;
        mix=0;
        carpeta=0;
        discoteca=0;
        bool_Material = [dibujos,1];
        d3.select("#checkboxMix").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxAcero").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxDibujos").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxCarpeta").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxDiscoteca").property("disabled", true).style("opacity",0.3);
        setupBuffers();
    }else{
        dibujos=0;
        d3.select("#checkboxCarpeta").property("disabled", false).style("opacity",1);
        d3.select("#checkboxMix").property("disabled", false).style("opacity",1);
        d3.select("#checkboxAcero").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxDiscoteca").property("disabled", false).style("opacity",1);
        bool_Material = [dibujos,0];
    }
}

function checkbox_Carpeta(){
    if( carpeta==0){
        carpeta=1;
        dibujos=0;
        acero=0;
        mix=0;
        discoteca=0;
        bool_Material = [carpeta,1];
        d3.select("#checkboxCarpeta").property("disabled", false).style("opacity",1);
        d3.select("#checkboxMix").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxAcero").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxDibujos").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxDiscoteca").property("disabled", true).style("opacity",0.3);
        setupBuffers();
    }else{
        carpeta=0;
        d3.select("#checkboxDibujos").property("disabled", false).style("opacity",1);
        d3.select("#checkboxMix").property("disabled", false).style("opacity",1);
        d3.select("#checkboxAcero").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxDiscoteca").property("disabled", false).style("opacity",1);
        bool_Material = [carpeta,0];
    }
}

function checkbox_Discoteca(){
    if( discoteca==0){
        discoteca=1;
        carpeta=0;
        dibujos=0;
        acero=0;
        mix=0;
        bool_Material = [0,0];
        d3.select("#checkboxCarpeta").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxMix").property("disabled", true).style("opacity",0.3);
        d3.select("#checkboxAcero").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxDibujos").property("disabled", true).style("opacity",0.3); 
        d3.select("#checkboxDiscoteca").property("disabled", false).style("opacity",1);
        setupBuffers();
    }else{
        discoteca=0;
        d3.select("#checkboxDibujos").property("disabled", false).style("opacity",1);
        d3.select("#checkboxMix").property("disabled", false).style("opacity",1);
        d3.select("#checkboxAcero").property("disabled", false).style("opacity",1); 
        d3.select("#checkboxCarpeta").property("disabled", false).style("opacity",1);
        bool_Material = [0,0];
    }
}


function checkbox_rotacionX(){
    if(rotacionX==0){
        rotacionX=1; 
        rotacionAutomatica= true;
        setupBuffers();
        drawScene();
        
    }else{
        rotacionX=0;
    }
}

function checkbox_rotacionY(){
    if(rotacionY==0){
        rotacionY=1; 
        rotacionAutomatica= true;
        setupBuffers();
        drawScene();
        
    }else{
        rotacionY=0;
    }
}

function checkbox_rotacionZ(){
    if(rotacionZ==0){
        rotacionZ=1; 
        rotacionAutomatica= true;
        setupBuffers();
        drawScene();
        
    }else{
        rotacionZ=0;
    }
}


/*======================= ROTACION Y FUNCIONES AUXILIARES ==================*/



let ratonAbajo = false;
let posRatonX = null;
let posRatonY = null;


  let MvMatrix=null,
      PMatrix=null;

  let uMvmatrix=null;

  function deteccionRaton(){

    canvas.onmousedown=pulsaRatonAbajo;
    document.onmouseup=pulsaRatonArriba;
    document.onmousemove=mueveRaton;
  }

  function inicializarMatrices(){
    MvMatrix=mat4.create();
    PMatrix=mat4.create();

    mat4.identity(MvMatrix);
    mat4.identity(PMatrix);

    mat4.lookAt([0.1,0.1 ,0],[0,0,-1],[0,1,0],MvMatrix);

  }

  function pulsaRatonAbajo(event) {
    ratonAbajo = true;
    posRatonX = event.clientX;
    posRatonY = event.clientY;
}


function pulsaRatonArriba(event) {
    ratonAbajo = false;
}


function mueveRaton(event) {
    if (!ratonAbajo) {
        return;
    }
    let nuevaX = event.clientX;
    let nuevaY = event.clientY;
    let deltaX = nuevaX - posRatonX;
    let deltaY = nuevaY - posRatonY;

    let idMatrix=mat4.create();
    mat4.identity(idMatrix);

    mat4.rotate(idMatrix,degToRad(deltaX/2), [0,1,0]); //el ultimo vector te indica que vector tienes que rotar
    mat4.rotate(idMatrix,degToRad(deltaY/2), [1,0,0]);
    
    mat4.multiply(idMatrix,MvMatrix,MvMatrix);
    posRatonX = nuevaX;
    posRatonY = nuevaY;
}

//conversion grados a radianes
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//calculo de los vertices de una esfera
function esfera(xc,yc,zc,radius){
    var latitudeBands = 30;
    var longitudeBands = 30;

    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta + xc;
            var y = cosTheta + yc;
            var z = sinPhi * sinTheta + zc;

            solVertices.push(radius * x);
            solVertices.push(radius * y);
            solVertices.push(radius * z);
        }
    }


    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }


}

//Calculo de la normal de 3 verties p1,p2,p3
//Devuelve un vec3
function calculoNormales(p1,p2,p3){
    v1=[p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]];
    v2=[p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]];
  
    //producto vectorial v1xv2
    normal = [v1[1]*v2[2]-v1[2]*v2[1],
              v1[2]*v2[0]-v1[0]*v2[2],
              v1[0]*v2[1]-v1[1]*v2[0]
    ];
  
    return normal;
  }

//calculo matriz cuando la rotacion es automatica
function rotacionAut(theta){
        // Calcula
        var angles1 = degToRad( theta[0] );
        var angles2 = degToRad( theta[1] );
        var angles3 = degToRad( theta[2] );
        var c = [Math.cos(angles1),Math.cos(angles2),Math.cos(angles3)];
        var s = [Math.sin(angles1),Math.sin(angles2),Math.sin(angles3)];
 
        // Matrices por columna
        var rx =  [1.0,  0.0,  0.0, 0.0,
                0.0,  c[0],  s[0], 0.0,
                0.0, -s[0],  c[0], 0.0,
                0.0,  0.0,  0.0, 1.0] ;
    
        var ry =  [c[1], 0.0, -s[1], 0.0,
                0.0, 1.0,  0.0, 0.0,
                s[1], 0.0,  c[1], 0.0,
                0.0, 0.0,  0.0, 1.0] ;
    
        var rz = [ c[2], -s[2], 0.0, 0.0,
                s[2],  c[2], 0.0, 0.0,
                0.0,  0.0, 1.0, 0.0,
                0.0,  0.0, 0.0, 1.0 ];
                
        aux=mat4.create();
        mat4.identity(aux);
        mat4.multiply(rx,ry, aux);
        mat4.multiply(aux,rz, aux);

        return aux;
}

//Conversion de hex to rgb
function hexToRgb( colour ) {
    var r,g,b;
    if ( colour.charAt(0) == '#' ) {
        colour = colour.substr(1);
    }
    if ( colour.length == 3 ) {
        colour = colour.substr(0,1) + colour.substr(0,1) + colour.substr(1,2) + colour.substr(1,2) + colour.substr(2,3) + colour.substr(2,3);
    }
    r = colour.charAt(0) + '' + colour.charAt(1);
    g = colour.charAt(2) + '' + colour.charAt(3);
    b = colour.charAt(4) + '' + colour.charAt(5);
    r = parseInt( r,16 );
    g = parseInt( g,16 );
    b = parseInt( b ,16);
    return [r/255,g/255,b/255];

}
