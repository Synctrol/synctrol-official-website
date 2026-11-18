// Source: https://www.shadertoy.com/view/sfXyRS
// Name: Graphic Design Experiment 31
// Author: yasuo
// For adaptation into Synctrol BackgroundModule — keep as reference.

#define S(d) smoothstep(1.,-1., (d)/min(.05,fwidth(d)) )
#define B(p,s) max(abs(p).x-s.x,abs(p).y-s.y)
#define deg45 .707
#define R45(p) (( p + vec2(p.y,-p.x) ) *deg45)
#define Tri(p,s) max(R45(p).x,max(R45(p).y,B(p,s)))
#define DF(a,b) length(a) * cos( mod( atan(a.y,a.x)+6.28/(b*8.0), 6.28/((b*8.0)*0.5))+(b-1.)*6.28/(b*8.0) + vec2(0,11) )

mat2 Rot(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }

float random(vec2 p){
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float c0(vec2 p){
    vec2 prevP = p;
    p.x = abs(p.x)-0.3;
    float d = B(p,vec2(0.1,0.2));
    p = prevP;
    p.y = abs(p.y)-0.4;
    float d2 = B(p,vec2(0.4,0.1));
    d = min(d,d2);
    return d;
}

float c1(vec2 p){
    float d = B(p,vec2(0.1,0.5));
    return d;
}

float c2(vec2 p){
    vec2 prevP = p;
    p.y-=0.2;
    p.y = abs(p.y)-0.2;
    
    float d = B(p,vec2(0.4,0.1));
    p = prevP;
    p-=vec2(-0.3,-0.2);
    float d2 = B(p,vec2(0.1,0.3));
    d = min(d,d2);
    p = prevP;
    p.x-=0.15;
    p.y+=0.4;
    d2 = B(p,vec2(0.25,0.1));
    d = min(d,d2);
    p = prevP;
    return d;
}

float c3(vec2 p){
    vec2 prevP = p;
    p.y = abs(p.y)-0.4;
    
    float d = B(p,vec2(0.4,0.1));
    p = prevP;
    float d2 = B(p,vec2(0.4,0.1));
    d = min(d,d2);
    p.x-=0.3;
    d2 = B(p,vec2(0.1,0.4));
    d = min(d,d2);
    return d;
}

float c4(vec2 p){
    vec2 prevP = p;

    p.x-=0.3;
    float d = B(p,vec2(0.1,0.5));
    p = prevP;
    p.x+=0.15;
    float d2 = B(p,vec2(0.25,0.1));
    d = min(d,d2);
    p = prevP;
    p.x+=0.3;
    p.y-=0.3;
    d2 = B(p,vec2(0.1,0.3));
    d = min(d,d2);
    return d;
}

float c5(vec2 p){
    vec2 prevP = p;
    p.y*=-1.;
    float d = c2(p);
    p = prevP;
    p-=vec2(0.3,-0.2);
    float d2 = B(p,vec2(0.1,0.3));
    d = min(d,d2);
    return d;
}

float c6(vec2 p){
    vec2 prevP = p;
    p.y*=-1.;
    float d = c2(p);
    p = prevP;
    p.y += 0.2;
    p.x = abs(p.x)-0.3;
    float d2 = B(p,vec2(0.1,0.3));
    d = min(d,d2);
    return d;
}

float c7(vec2 p){
    vec2 prevP = p;

    p.x-=0.3;
    float d = B(p,vec2(0.1,0.5));
    p = prevP;
    p.x+=0.15;
    p.y-=0.4;
    float d2 = B(p,vec2(0.25,0.1));
    d = min(d,d2);

    return d;
}

float c8(vec2 p){
    vec2 prevP = p;
    p.x = abs(p.x)-0.3;
    float d = B(p,vec2(0.1,0.5));
    p = prevP;
    p.y = abs(p.y)-0.4;
    float d2 = B(p,vec2(0.4,0.1));
    d = min(d,d2);
    p = prevP;
    d2 = B(p,vec2(0.4,0.1));
    d = min(d,d2);
    return d;
}

float c9(vec2 p){
    p*=-1.;
    float d = c6(p);
    return d;
}

float drawNumber(vec2 p, int num){
    vec2 prevP = p;
    float d = 10.;
    float s = 6.;
    p*=s;
    if(num == 0){
        d = c0(p);
    } else if(num == 1){
        d = c1(p);
    } else if(num == 2){
        d = c2(p);
    } else if(num == 3){
        d = c3(p);
    } else if(num == 4){
        d = c4(p);
    } else if(num == 5){
        d = c5(p);
    } else if(num == 6){
        d = c6(p);
    } else if(num == 7){
        d = c7(p);
    } else if(num == 8){
        d = c8(p);
    } else if(num == 9){
        d = c9(p);
    }

    return d / s;
}

float drawNumbers(vec2 p, int num, int num2){
    p+=vec2(-0.3,0.35);
    float d = drawNumber(p-vec2(0.08,0.),num);
    float d2 = drawNumber(p-vec2(-0.08,0.),num2);
    d = min(d,d2);
    return d;
}

float truchetShape(vec2 p){
    vec2 prevP = p;
    p*=Rot(radians(45.));
    p.x = abs(p.x)-0.695;
    float d = abs(length(p)-0.49)-0.1;
    p = prevP;
    
    p*=Rot(radians(45.));
    p.x = abs(p.x)-0.47;
    p*=Rot(radians(30.*iTime));
    
    float d2 = min(B(p,vec2(0.015,0.08)),B(p,vec2(0.08,0.015)));
    d = min(d,d2);
    return d;
}

float stripe(vec2 p){
    p.x+=iTime*0.1;
    p = mod(p,0.14)-0.07;
    float d = abs(p.x)-0.03;
    return d;
}

float arrow(vec2 p){
    p.y -= 0.06;
    float d = Tri(p,vec2(0.12));
    p-=vec2(0.,-0.08);
    float d2 = Tri(p,vec2(0.12));
    d = max(-d2,d);
    return d;
}

float arrows(vec2 p, float n){
    vec2 prevP = p;
    p = DF(p,2.);
    p-=0.1;
    p*=Rot(radians(45.));
    p.y-=1.+n+n*iTime*0.1;
    p.y = mod(p.y,0.15)-0.075;
    float d = arrow(p);
    return d;
}

float grids(vec2 p){
    p.x-=iTime*0.05;
    p = mod(p,0.1)-0.05;
    float s = 0.02;
    float d = length(p)-s;
    return d;
}

float grids2(vec2 p){
    p.x+=iTime*0.1;
    p = mod(p,0.1)-0.05;
    float d = min(B(p,vec2(0.01,0.1)),B(p,vec2(0.1,0.01)));
    return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    uv.y -= iTime * 0.1;

    const float k = 0.57735027;
    vec2 p = vec2(uv.y + uv.x * k,
                  uv.y - uv.x * k);

    float scale = 9.;
    vec2 gp = p * scale;
    vec2 id = floor(gp);
    vec2 gr = fract(gp) - 0.5;

    float gridNum = 3.0;
    int column = int(mod(id.x, gridNum));
    int row = int(mod(id.y, gridNum));

    float line = abs(B(gr,vec2(0.495)))-0.01;

    float n = random(id);
    float d = 10.;

    if(n<0.5)d = drawNumbers(gr,int(mod(float(column)+n+iTime*n*30.,10.)),int(mod(float(row)+n+iTime*n,10.)));
    
    vec3 col = mix(vec3(0.05), vec3(1.), S(line));
    col = mix(col, vec3(1.), S(d));
    
    vec2 q = gr;
    if(n<0.5)q.x*=-1.;
    d = truchetShape(q);
    col = mix(col, vec3(0.9), S(d));
    
    float n2 = random(id - vec2(column, row));
    
    float d2 = B(gr,vec2(0.5));
    float a = radians(-225.); //-45. or -225.
    d2 = 10.;
    if(n2<1.){
        if(row == 0 && column == 0){
            a = radians(-45.);
            d2 = dot(gr,vec2(cos(a),sin(a)));
            col = mix(col, vec3(0.5), S(d2));
            a = radians(-225.);
            d2 = dot(gr,vec2(cos(a),sin(a)));
            col = mix(col, vec3(0.2), S(d2));
            
            float mask = d2;
            d2 = grids(gr);
            d2 = max(mask,d2);
            col = mix(col, vec3(0.4), S(d2));
            
            d2 = grids(gr);
            d2 = max(-mask,d2);
            col = mix(col, vec3(0.3), S(d2));
        }
        if(row == 0 && column == 1){
            a = radians(-45.);
            d2 = dot(gr,vec2(cos(a),sin(a)));
            col = mix(col, vec3(0.2), S(d2));
            
            float mask = d2;
            d2 = grids(gr);
            d2 = max(mask,d2);
            col = mix(col, vec3(0.4), S(d2));
        }
        if(row == 1 && column == 0){
            d2 = dot(gr,vec2(cos(a),sin(a)));
            col = mix(col, vec3(0.5), S(d2));
            
            float mask = d2;
            d2 = grids(gr);
            d2 = max(mask,d2);
            col = mix(col, vec3(0.3), S(d2));
        }
        if(row == 1 && column == 1){
            d2 = B(gr,vec2(0.5));
            col = mix(col, vec3(0.8), S(d2));
            
            d2 = arrows(gr,n);
            col = mix(col, vec3(0.3), S(d2));
            
            d2 = abs(B(gr,vec2(0.45)))-0.05;
            col = mix(col, vec3(0.7), S(d2));
        }
        
        if(n2<0.2){
            if(row == 1 && column == 2){
                d2 = B(gr,vec2(0.5));
                col = mix(col, vec3(0.8), S(d2));
                
                float z = length(gr) - n+n*iTime*-0.1;
                float q = mod(z, 0.1) - 0.05;
                d2 = abs(q) - 0.03;
                col = mix(col, vec3(0.3), S(d2));
                
                d2 = abs(B(gr,vec2(0.45)))-0.05;
                col = mix(col, vec3(0.6), S(d2));
            }
            if(row == 0 && column == 2){
                a = radians(-45.);
                d2 = dot(gr,vec2(cos(a),sin(a)));
                col = mix(col, vec3(0.2), S(d2));
            }
            if(row == 0 && column == 1){
                a = radians(-225.);
                d2 = dot(gr,vec2(cos(a),sin(a)));
                col = mix(col, vec3(0.2), S(d2));
            }
        }
        
        if(n2>=0.5 && n2<0.7){
            if(row == 2 && column == 1){
                d2 = B(gr,vec2(0.5));
                col = mix(col, vec3(0.8), S(d2));
                
                float z = B(gr,vec2(0.5)) - n+n*iTime*-0.1;
                float q = mod(z, 0.1) - 0.05;
                d2 = abs(q) - 0.03;
                
                col = mix(col, vec3(0.3), S(d2));
            }
            if(row == 2 && column == 0){
                a = radians(-225.);
                d2 = dot(gr,vec2(cos(a),sin(a)));
                col = mix(col, vec3(0.5), S(d2));
                
                float mask = d2;
                d2 = grids2(gr);
                d2 = max(mask,d2);
                col = mix(col, vec3(0.1), S(d2));
            }
            if(row == 1 && column == 0){
                a = radians(-45.);
                d2 = dot(gr,vec2(cos(a),sin(a)));
                col = mix(col, vec3(0.5), S(d2));
                
                float mask = d2;
                d2 = grids2(gr);
                d2 = max(mask,d2);
                col = mix(col, vec3(0.1), S(d2));
            }
        }
        
        if(n2>=0.8){
            if(row == 1 && column == 2){
                a = radians(-45.);
                d2 = dot(gr,vec2(cos(a),sin(a)));
                col = mix(col, vec3(0.2), S(d2));
                
                d2 = B(gr-vec2(0.0,0.7),vec2(0.5));
                a = radians(-45.);
                float mask = dot(gr,vec2(cos(a),sin(a)));
                d2 = max(mask,d2);
                
                col = mix(col, vec3(0.3), S(d2));
                d2 = max(d2,stripe(gr));
                col = mix(col, vec3(0.2), S(d2));
            }
            if(row == 2 && column == 2){
                d2 = B(gr,vec2(0.5));
                col = mix(col, vec3(0.7), S(d2));
                d2 = stripe(gr*Rot(radians(45.)));
                col = mix(col, vec3(0.3), S(d2));
            }
            if(row == 2 && column == 1){
                a = radians(-225.);
                d2 = dot(gr,vec2(cos(a),sin(a)));
                col = mix(col, vec3(0.4), S(d2));
                
                d2 = B(gr-vec2(0.7,0.0),vec2(0.5));
                a = radians(-45.);
                float mask = dot(gr,vec2(cos(a),sin(a)));
                d2 = max(-mask,d2);
                col = mix(col, vec3(0.6), S(d2));
                d2 = max(d2,stripe(gr));
                col = mix(col, vec3(0.3), S(d2));
            }
        }
    }

    fragColor = vec4(col, 1.0);
}
