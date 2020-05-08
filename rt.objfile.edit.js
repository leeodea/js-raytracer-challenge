/*
function ofentry()	{
	
	this.h = "";
	this.b = [];
}
*/
function convert2()	{
	
	var triangles = group()
	var k = 0;
	for (var j = 0; j<ofData.f.length; j++)	{
		
		var t = triangle(
			point(ofData.v[ofData.f[j][0]-1][0], ofData.v[ofData.f[j][0]-1][1], ofData.v[ofData.f[j][0]-1][2]),
			point(ofData.v[ofData.f[j][1]-1][0], ofData.v[ofData.f[j][1]-1][1], ofData.v[ofData.f[j][1]-1][2]),
			point(ofData.v[ofData.f[j][2]-1][0], ofData.v[ofData.f[j][2]-1][1], ofData.v[ofData.f[j][2]-1][2]),
			//- v  | f     v[f][1-3]
			/*
			point(ofData[ofData[j].b[1]-1].b[0], ofData[ofData[j].b[1]-1].b[1], ofData[ofData[j].b[1]-1].b[2]), 
			point(ofData[ofData[j].b[2]-1].b[0], ofData[ofData[j].b[2]-1].b[1], ofData[ofData[j].b[2]-1].b[2]), */
			k++
		);
		
		t.material.color = colour(0,0,1);
		//debugger;
		
		triangles.addChild(t)
	}
	
	triangles.transform = translation(0,0,0)
	
	return triangles;
}

function convert3(vertices, k)	{

	var o = [], v2 = [], vn2;
	var x, y, z;
	
	for (var m = 0; m < vertices.length; m++)	{
		
		
		//if(vertices[m]=="")
			//break;
		var vdata = ofData["v"][vertices[m][0]-1]
		var vndata =ofData["vn"][vertices[m][1]-1]
		
		if(!vdata)
			break;
		
		x = vdata[0]
		y = vdata[1]
		z = vdata[2]

		var _point = point(x,y,z)
		v2.push(_point)
		
		if(vndata)
			x = vndata[0], y = vndata[1], z = vndata[2];
	}
	vn2 = vector(x,y,z)

	var ts = [], ts2 = fan_triangulation(v2)
	
	for (var i = 0; i < ts2.length; i++)
		if (ts2[i])
			ts.push(ts2[i])
	
	for (var j = 0; j<ts.length; j++)	{
		
		ts[j].material.color = colour(0,0,1)
		o.push([ts[j], vn2])
	}
	
	return o
}

function ro2()	{

	var o = group()
	for (var i = 0; i < ofData.f.length; i++)	{
	
		var f = [], k = 0;
		
		for (var j = 0; j < ofData["f"][i].length; j++)
		
			f.push([ofData["f"][i][j].split("/")[0], ofData["f"][i][j].split("/")[2]])
	
		//console.log("f = " + i + ", f[0] = " + f[0] + ", f[1] = " + f[1] + "f[2] = " + f[2] + ", f[3] = " + f[3])
		var s = convert3(f, k);
		
		for (var j = 0; j < s.length; j++)	{

			o.addChild(s[j]);
		}
	}
		
	//clearInterval(loop)
	ctx.fillStyle = "#cccccc"
	ctx.fillRect(0, 0, 500, 281)	
	
	var c = new camera(WIDTH, HEIGHT, Math.PI/2)
	var w = new world();
	
	w.light = new point_light(point(-20, 20, 40), colour(1,1,1))
	
	c.transform = view_transform(point(10,0, 10), // from
								point(0,0,0),   // to
								vector(0,1,0)); // up
								
	
	
	//debugger
	ofData.o = o
	w.objects.push(o)
	
	//debugger
	render(c,w,1)
}

function ro()	{

	var s = convert2();
		
	clearInterval(loop);
	ctx.fillStyle = "#cc2222";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);	
	
	var c = new camera(WIDTH, HEIGHT, Math.PI/2);
	var w = new world();
	
	w.light = new point_light(point(-20, 20, 40), colour(1,1,1));
	
	c.transform = view_transform(point(25,0, 25), // from
								point(0,0,0),   // to
								vector(0,1,0)); // up
								
	
	
	//debugger;
	w.objects.push(s)
	
	//debugger;
	console.time("render bear.")
	render(c,w,1);
	console.timeEnd("render bear.")
}


function parse_obj_file()	{
	
	// use global OBJFILECONTENTS
	if (!OBJFILECONTENTS)
		throw new Error("No obj file contents available!")
	
	var ignored_lines = 0;
	var lines = OBJFILECONTENTS.split("\n")
	
	for (var l = 0; l<lines.length;l++)	{
		
		var line = lines[l]
		var str = line.substring(0, 2)
		
		var curr_e = "";
		
		if (str=="f ")	{
			
			curr_e = "f";
			if(!ofDataR.f_begins)
				ofDataR.f_begins = l;
			
		}
		else if (str=="g ")	{
		
			curr_e = "g";
			
		}
		else if (str=="v ")	{
		
			if(!ofDataR.v_begins)
				ofDataR.v_begins = l;
			
			curr_e = "v";
		}
		else if (str=="vn")	{
		
			curr_e = "vn";
			if(!ofDataR.vn_begins)
				ofDataR.vn_begins = l;
		}
		else	{
		
			curr_e = "";
			ignored_lines++;
			// ignore line
			// 3351-1508-6959-0290-1969-4871-4238-88 expand!2 key
		}
		
		if (curr_e)	{
			
			var body2 = line.substring(2,line.length).split(" ");
			var body = [];
			
			for (var g = 0; g < body2.length; g++)
				if(body2[g]!=="")
					body.push(body2[g])
			
			ofData[curr_e].push(body);
			
			if(curr_e=="v")	{
				if(body[0]==0)
					body[0]=0
				
				if(body[1]==0)
					body[1]=0
				
				if(body[2]==0)
					body[2]=0
				
				if (body[0] < ofDataR.x_min)
					ofDataR.x_min = body[0]
				else if(body[0] > ofDataR.x_max)
					ofDataR.x_max = body[0]
				
				if (body[1] < ofDataR.y_min)
					ofDataR.y_min = body[1]
				else if(body[1] > ofDataR.y_max)
					ofDataR.y_max = body[1]
				
				if (body[2] < ofDataR.z_min)
					ofDataR.z_min = body[2]
				else if(body[2] > ofDataR.z_max)
					ofDataR.z_max = body[2]
			}
		}
	}
	console.log("Parsed Object File: " + ignored_lines + " lines ignored.")
}