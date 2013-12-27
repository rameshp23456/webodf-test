var currentPath,
overridePath,
overridePathPrefix = "odf:",
data,
globalreadfunction,
globalfilesizefunction,
odfcanvas,
zoom = 1,
dom,
canvasListeners = [],
view;



function init() {
	$("#odf-container").show();

	dom = document.getElementById("odf");
      odfcanvas = new odf.OdfCanvas(dom);
  	//odfcanvas.load("somedude.odt");
}


function getSelected(e){
	initCanvas()
	var file= e.files[0];
	var reader= new FileReader();
	
	reader.onloadend=function(e){
		data = e.target.result;
		odfcanvas.load(overridePath);
	}
	
	currentPath = file.name;
    overridePath = overridePathPrefix + currentPath;
    data=null;
	reader.readAsArrayBuffer(file)
}








function initCanvas() {
    var cmp;
    if (globalreadfunction === undefined) {
        // overload the global read function with one that only reads
        // the data from this canvas
        globalreadfunction = runtime.read;
        globalfilesizefunction = runtime.getFileSize;
        runtime.read = function (path, offset, length, callback) {
            if (path !== overridePath) {
                globalreadfunction.apply(runtime,
                    [path, offset, length, callback]);
            } else {
                callback(null, data.slice(offset, offset + length));
            }
        };
        runtime.getFileSize = function (path, callback) {
            if (path !== overridePath) {
                globalfilesizefunction.apply(runtime, [path, callback]);
            } else {
                callback(data.length);
            }
        };
        init();
        odfcanvas.addListener("statereadychange", signalCanvasChange);
    }
}

function signalCanvasChange(){
	var i;
    for (i = 0; i < canvasListeners.length; i += 1) {
        canvasListeners[i](odfcanvas);
    }
}