import {MainFrame, Vector} from "vectorplay"


const mf = new MainFrame();


let v1 = new Vector(2,1,0);
let v2 = new Vector(3,-1,2);


// mf.plotSum(v1, v2);
// mf.plotProjection(v1, v2);
mf.plotDifference(v1, v2);
// mf.plotCross(v1, v2);



mf.runInloop();
