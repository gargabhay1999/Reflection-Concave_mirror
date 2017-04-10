function loadExperiment(){

	var c = document.getElementById("myCanvas");
	var R = 6 * parseInt(document.getElementById("roc").value);
	var ctx = c.getContext("2d");	//context of circle
	var lineWidth_default = 1;
	ctx_i = ctx;	//context of reflected ray
	ctx_r = ctx;	//context of reflected ray
	ctx_PA = ctx;	//context of PA
	ctx_pole = ctx; //context of pole
	ctx_C = ctx;	//context of COR
	ctx_focus = ctx;	//context of focus
	
	//destroy / reload the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	var X_can = document.getElementById("myCanvas").width;
	var Y_can = document.getElementById("myCanvas").height;
    	ctx.clearRect(0, 0, X_can, Y_can);
   	// Restore the transform
    	ctx.restore();
    	
    	//draw concave mirror
	//setting up coordinates of pole to (px1, py1) ...this is taken according to the nature of our canvas
    	var px1 = 1100;
	var py1 = Y_can/2;
    	
    	ctx.beginPath();
	//coordinate of Center of Curvature = (x1, y1)
	//default R = 300, so (x1, y1) = (800, py1)
	var x1 = 800 + (300 - R);
	var y1 = py1;
	
	var theta_A = 1.9 * Math.PI, theta_B = ( 2 * Math.PI + (2 * Math.PI - theta_A) );
	//magnitude of acute angle formed while drawing concave mirror
	var mag_theta = 2 * Math.PI - theta_A;			//(2*PI - theta_A)
	ctx.lineWidth = 10;
	ctx.strokeStyle = 'grey';
	ctx.arc(x1, y1, R, theta_A, theta_B);  //circle
	ctx.stroke();
	ctx.lineWidth = lineWidth_default;
    	
    	//pole of concave mirror
	ctx_pole.beginPath();
	ctx_pole.strokeStyle = 'red';
	ctx_pole.lineWidth = 5;
	ctx_pole.arc(px1, py1, 2, 0 * Math.PI, 2 * Math.PI);
	ctx_pole.font = "20px Arial";
	ctx_pole.fillStyle = 'white';
	ctx_pole.fillText("P (Pole)",px1,py1+20);
	ctx_pole.stroke();
	ctx_pole.lineWidth = lineWidth_default;
	
	
	//principle axis		
	ctx_PA.beginPath();
	ctx_PA.strokeStyle = 'red';
	ctx_PA.moveTo(0,py1);
	ctx_PA.lineTo(X_can,py1);
	ctx_PA.stroke();
	
	//center of curvature	
	ctx_C.beginPath();
	ctx_C.strokeStyle = 'red';
	ctx_C.lineWidth = 5;
	ctx_C.arc(x1, y1, 2, 0 * Math.PI, 2 * Math.PI);	//cor point
	ctx_C.font = "20px Arial";
	ctx_C.fillStyle = 'white';
	ctx_C.fillText("C",x1,y1+20);
	ctx_C.stroke();
	ctx_C.lineWidth = lineWidth_default;
	
	//coordinate of starting point of incidence ray (x,y) = (0,y)
	var x = 0;
	var y;
	
	//coordinate of incidence point = (Xi, Yi)
	//coordinate of point on reflected ray = (Xr, Yr)
	var Xi, Yi;
	var Xr, Yr;
	
	//theta is an angle of slope
	var theta;
	
	//coordinates of intersection point of reflected ray and PA = (Fx, Fy) which we call as focus.
	var Fx, Fy;
	var f;	//focal length
	var arr = new Array();

	
	//if lines are parallel to PA
	n = num_lines(R, mag_theta)/2 - 1;
	for(i=( (-1)*n ); i<=n; i++)
	{
		y = y1 - document.getElementById("line_space").value*i;
		//coordinate of incident point(Xi, Yi)
		Xi=(x_val(x1,y1,R,y));	//mathematically calculating intersection point of incident ray and mirror
		Yi=y;
		
		//draw ray of incidence
		ctx_i.beginPath();
		ctx_i.strokeStyle = 'cyan';
		ctx_i.moveTo(x, y);	
		ctx_i.lineTo(Xi, Yi);
		ctx_i.stroke();
		
		//after rotating by two times theta (in radian)
		tan_theta = ( (y1-y) / (Xi -x1) ) ;
		tan_2theta = ( 2 * tan_theta ) / ( 1 - Math.pow( tan_theta, 2) );		//tan(2X) = 2tan(X) / (1 - ( tan(X) )^2 )

		//perpendicular to tangent at point of incidence
		ctx.beginPath();
		ctx_r.strokeStyle = 'white';
		ctx.moveTo(x1,y1);
		ctx.lineTo( Xi, Yi);
		ctx.stroke();
		//currently ctx is at (Xi, Yi). For making a line towards (Xr, Yr)
		ctx_r.beginPath();
		ctx_r.strokeStyle = 'yellow';
		ctx_r.moveTo(Xi, Yi);
		//taking Xr = 0 to get a reflected line
		Xr = 0;
		if ( tan_theta > 1 && Yi < y1)
			tan_theta = (-1) * tan_theta ;
		Yr = ( ( (-1) * tan_2theta ) ) * ( Xr - Xi ) + Yi ;
		ctx_r.lineTo(Xr, Yr);

		//coordinates of intersection point of reflected ray and PA = (Xp, Yp)
		Yp = y1;
		Xp = ( ( Yp - Yi ) / ( (-1) * tan_2theta ) ) + Xi ;
		ctx_r.stroke();
		
		//x-cordinate of intersection point (Xp) on PA provided that Yp = y1
		Xp = Xi + ( (Xr - Xi) / (Yr - Yi) ) * (Yp - Yi) ;
		f = ( (px1 - Xp) / 6 );
		f = Number(Math.round(f+'e4')+'e-4');
		arr.push( f );	//converting to cm. since here for our canvas 1cm = 6.16 unit 
		
		//rays meet 
		ctx_focus.beginPath();
		ctx_focus.strokeStyle = 'red';
		ctx_focus.lineWidth = 5;
		ctx_focus.arc(Xp, Yp, 2, 0 * Math.PI, 2 * Math.PI);
		ctx_focus.font = "20px Arial";
		ctx_focus.fillStyle = 'white';
		ctx_focus.fillText("F",Xp, Yp+20);
		ctx_focus.stroke();
		ctx_focus.lineWidth = lineWidth_default;
	}
	document.getElementById("focal_len").value= f ;
		
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

//for lines parallel to PA, mathematically find the intersection point of circle(mirror) and straight line (ray of light)
function x_val(x1,y1,R,y)
{
	var x_cord=Math.pow((Math.pow(R,2)-Math.pow((y1-y),2)),1/2)+x1 ;
	return x_cord;
}

//proportions of lines falling on the mirror
function num_lines(R, mag_theta)
{
	var aparture_len,total_lines,line_space;
	line_space = document.getElementById("line_space").value;
	aparture_len = 2 * R * Math.sin(mag_theta) ;
	/*if ( line_space < 1 )
		line_space = 1;	//set to its minimum value*/
	total_lines = aparture_len / line_space;
	return Math.ceil(total_lines);
}

//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//
//--------------------------------------------------------------//
var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Reflection through concave mirror</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows that in a concave mirror, how principles of reflection follow and how does focus get affected when some change happens in its radius of curvature(R).</p>";
    helpContent = helpContent + "<h3>The setup page: -</h3>";
    helpContent = helpContent + "<p>Initially the radius of curvature is set to 40. And rays of light pass through concave mirror, get reflected and meet with each other on the principle axis at a point, which we named as 'focus(F)'.</p>";
    helpContent = helpContent + "<p>The ray which is passing through center of curvature to the incidence point of each ray actually divides the angle between incident and reflected ray into two equal parts. Thst proves that angle of incidence is always equal to angle of reflection.</p>";
    helpContent = helpContent + "<h3>Colour coding: -</h3>";
    helpContent = helpContent + "<ul> <li> Asume the whole setup  is kept in a dark room (black). </li>";
    helpContent = helpContent + "<li> Incident ray is represented by cyan colour. </li>";
    helpContent = helpContent + "<li> Reflected ray is represented by yellow colour. </li>";
    helpContent = helpContent + "<li> Angle bisector is represented by white colour. </li>";
    helpContent = helpContent + "<li> Concave mirror is kept with well coated reflective material(grey colour). </li>";
    helpContent = helpContent + "<li> C, F, and P are three main points of the whole setup (dotted in red colour), termed as centre of curvature, focus and pole of the concave mirror. </li> </ul>";
	//helpContent = helpContent + "</div>";
    document.getElementById("Help").innerHTML = helpContent;
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Reflection through concave mirror</h2>";
    infoContent = infoContent + "<h2>Objective</h2>";
    infoContent = infoContent + "<p>Show a concave mirror. Show principle axis and the center. Successively draw rays parallel to principle axis. For each ray, show incidence and reflection angle. Draw the reflected ray. The rays meet at a point called focus. State that focus is midpoint between pole and center.Allow student to change the radius of curvature. Draw the rays again. Show how they meet at a new focus.</p>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment shows that in a concave mirror, how principles of reflection follow and how does focus get affected when some change happens in its radius of curvature(R).</p>";
    infoContent = infoContent + "<h3>Reflection through concave mirror</h3>";
    infoContent = infoContent + "<p>The experiment <b> mathematically and practically </b> proves when the rays parallel to the principle axis fall on the concave mirror, after reflection they intersect (meet) each other at a point on the principle axis (PA) , that point is known as focus (F) of the concave mirror.</p>";
    infoContent = infoContent + "<h3>Angle between incidence ray and reflected ray</h3>";
    infoContent = infoContent + "<p>the ray from centre of curvature to the point of incidence, it bisects the angle made between incidence and reflected ray.</p>";
    infoContent = infoContent + "<p>As incident angle(i) = reflected angle(r)</p>";
    infoContent = infoContent + "<h3>Radius of curvature: -</h3>";
    infoContent = infoContent + "<p>the horizontal distance between center of curvature and pole of the mirror.</p>";
    infoContent = infoContent + "<h3>Focal distance: -</h3>";
    infoContent = infoContent + "<p>the horizontal distance between focus and pole of the mirror.</p>";
    infoContent = infoContent + "<h3>Relation between R and f: -</h3>";
    infoContent = infoContent + "<p>Mathematically, we are now able to prove that focal distance of a concave mirror is approximately half of its radius of curvature.</p>";
    infoContent = infoContent + "<h3>Why Approximately: -</h3>";
    infoContent = infoContent + "<ul> <li> while calculating angle of incidence using geometry, there is trigonometry Tangent term which leads to some approximation in calculation. </li>";
    infoContent = infoContent + "<li> <b> For a mirror that is large compared with its radius of curvature, we see that the reflected rays do not cross at the same point, and the mirror does not have a well-defined focal point.</b> </li>";
    infoContent = infoContent + "<li> <b>If the mirror had the shape of a parabola, the rays would all cross at a single point, and the mirror would have a well-defined focal point.</b> </li> </ul>";
    infoContent = infoContent + "<h3>Change in ROC: -</h3>";
    infoContent = infoContent + "<p>For every change in radius of curvature, it has new focus. (user can see this effect by sliding the handler)</p>";
    infoContent = infoContent + "<h2>Uses of concave mirrors</h2>";
    infoContent = infoContent + "<ul> <li> Concave mirrors are commonly used in torches, search-lights and vehicles headlights to get powerful parallel beams of light. </li>";
    infoContent = infoContent + "<li> They are often used as shaving mirrors to see a larger image of the face. </li>";
    infoContent = infoContent + "<li> The dentists use concave mirrors to see large images of the teeth of patients. </li>";
    infoContent = infoContent + "<li> Large concave mirrors are used to concentrate sunlight to produce heat in solar furnaces. </li> </ul> ";
    document.getElementById("Info").innerHTML = infoContent;
}

