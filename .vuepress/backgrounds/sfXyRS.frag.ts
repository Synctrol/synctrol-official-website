/*
 * Port of "Graphic Design Experiment 31" by yasuo
 * https://www.shadertoy.com/view/sfXyRS (reference copy: ./sfXyRS.glsl)
 *
 * The isometric tiling and cell vocabulary follow the original, without the
 * digit cells. Tones are reduced to a small palette so fills sit well below
 * strokes, and the opaque dark base becomes transparent: the pattern tone
 * drives the alpha of a single ink colour.
 */

const BODY = /* glsl */ `
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uInk;
uniform float uOpacity;

#define S(d) smoothstep(1.,-1., (d)/min(.05,fwidth(d)) )
#define B(p,s) max(abs(p).x-s.x,abs(p).y-s.y)
#define deg45 .707
#define R45(p) (( p + vec2(p.y,-p.x) ) *deg45)
#define Tri(p,s) max(R45(p).x,max(R45(p).y,B(p,s)))
#define DF(a,b) length(a) * cos( mod( atan(a.y,a.x)+6.28/(b*8.0), 6.28/((b*8.0)*0.5))+(b-1.)*6.28/(b*8.0) + vec2(0,11) )

// Tone palette (0 = transparent, 1 = full ink). Fills stay well under strokes.
#define T_CUT    0.04
#define T_SHADE  0.12
#define T_FILL   0.22
#define T_PANEL  0.30
#define T_MARK   0.42
#define T_STROKE 0.62

mat2 Rot(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }

float random(vec2 p){
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Mechanical time: hold on each integer, then a short eased move to the next.
float tick(float t){
  return floor(t) + smoothstep(0.85, 1.0, fract(t));
}

// Hard snap of a continuous phase onto multiples of q.
float snap(float x, float q){
  return floor(x / q) * q;
}

float halfPlane(vec2 p, float deg){
  float a = radians(deg);
  return dot(p, vec2(cos(a), sin(a)));
}

float truchetShape(vec2 p, float spin){
  vec2 prevP = p;
  p*=Rot(radians(45.));
  p.x = abs(p.x)-0.695;
  float d = abs(length(p)-0.49)-0.07;
  p = prevP;
  p*=Rot(radians(45.));
  p.x = abs(p.x)-0.47;
  p*=Rot(radians(15.*tick(iTime*1.2)*spin));
  float d2 = min(B(p,vec2(0.012,0.07)),B(p,vec2(0.07,0.012)));
  return min(d,d2);
}

float stripe(vec2 p){
  p.x+=snap(iTime*0.1, 0.035);
  p = mod(p,0.14)-0.07;
  return abs(p.x)-0.025;
}

float arrow(vec2 p){
  p.y -= 0.06;
  float d = Tri(p,vec2(0.12));
  p-=vec2(0.,-0.08);
  float d2 = Tri(p,vec2(0.12));
  return max(-d2,d);
}

float arrows(vec2 p, float n){
  p = DF(p,2.);
  p-=0.1;
  p*=Rot(radians(45.));
  p.y-=1.+n+n*0.075*tick(iTime*1.333);
  p.y = mod(p.y,0.15)-0.075;
  return arrow(p);
}

float grids(vec2 p){
  p.x-=snap(iTime*0.05, 0.025);
  p = mod(p,0.1)-0.05;
  return length(p)-0.018;
}

float grids2(vec2 p){
  p.x+=snap(iTime*0.1, 0.025);
  p = mod(p,0.1)-0.05;
  return min(B(p,vec2(0.008,0.1)),B(p,vec2(0.1,0.008)));
}

// Punch card: a 6x4 slot field; each slot is punched or blank and the
// punch layout re-rolls on every mechanical tick.
float punchSlots(vec2 p, vec2 id, out float blank){
  vec2 cs = vec2(0.12, 0.18);
  vec2 pc = p + 0.36;
  vec2 ci = floor(pc / cs);
  vec2 cl = mod(pc, cs) - cs * 0.5;
  float inside = B(p, vec2(0.36));
  float slot = max(B(cl, vec2(0.03, 0.055)), inside);
  float punched = step(0.45, random(ci + id * 7.0 + floor(iTime * 1.5)));
  blank = mix(max(B(cl, vec2(0.03, 0.008)), inside), 1e5, punched);
  return mix(1e5, slot, punched);
}

// Bolted plate: four L-brackets in the corners with slotted bolts.
float brackets(vec2 p){
  vec2 a = abs(p);
  return min(B(a - vec2(0.31, 0.385), vec2(0.105, 0.035)),
             B(a - vec2(0.385, 0.31), vec2(0.035, 0.105)));
}

float bolts(vec2 p, float spin){
  vec2 a = abs(p) - vec2(0.27);
  float head = length(a) - 0.04;
  a *= Rot(radians(45. * tick(iTime * 1.2) * spin));
  float slot = B(a, vec2(0.032, 0.008));
  return max(head, -slot);
}

float hatchPlate(vec2 p){
  float h = abs(mod(p.x + p.y + snap(iTime * 0.1, 0.035), 0.07) - 0.035) - 0.012;
  return max(h, B(p, vec2(0.17)));
}

float pattern(vec2 fragCoord){
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  uv.y -= iTime * 0.1;
  uv.x += iTime * 0.04;

  const float k = 0.57735027;
  vec2 p = vec2(uv.y + uv.x * k, uv.y - uv.x * k);

  float scale = 9.;
  vec2 gp = p * scale;
  vec2 id = floor(gp);
  vec2 gr = fract(gp) - 0.5;

  float gridNum = 3.0;
  int column = int(mod(id.x, gridNum));
  int row = int(mod(id.y, gridNum));

  float n = random(id);
  float n2 = random(id - vec2(float(column), float(row)));

  float line = abs(B(gr,vec2(0.495)))-0.006;
  float col = mix(0., T_SHADE, S(line));

  vec2 q = gr;
  if(n<0.5) q.x*=-1.;
  col = mix(col, T_STROKE, S(truchetShape(q, n<0.5 ? 1. : -1.)));

  float d2;

  if(row == 0 && column == 0){
    float mask = halfPlane(gr,-225.);
    col = mix(col, T_SHADE, S(mask));
    col = mix(col, T_MARK, S(max(-mask, grids(gr))));
  }
  if(row == 0 && column == 1){
    float mask = halfPlane(gr,-45.);
    col = mix(col, T_SHADE, S(mask));
    col = mix(col, T_MARK, S(max(mask, grids(gr))));
  }
  if(row == 1 && column == 0){
    float mask = halfPlane(gr,-225.);
    col = mix(col, T_FILL, S(mask));
    col = mix(col, T_CUT, S(max(mask, grids(gr))));
  }
  if(row == 1 && column == 1){
    col = mix(col, T_PANEL, S(B(gr,vec2(0.5))));
    col = mix(col, T_CUT, S(arrows(gr,n)));
    col = mix(col, T_MARK, S(abs(B(gr,vec2(0.45)))-0.03));
  }

  if(n2<0.2){
    if(row == 1 && column == 2){
      col = mix(col, T_PANEL, S(B(gr,vec2(0.5))));
      float blank;
      d2 = punchSlots(gr, id, blank);
      col = mix(col, T_SHADE, S(blank));
      col = mix(col, T_CUT, S(d2));
      col = mix(col, T_MARK, S(abs(B(gr,vec2(0.45)))-0.03));
      col = mix(col, T_CUT, S(halfPlane(gr, 45.) - 0.56));
    }
    if(row == 0 && column == 2){
      col = mix(col, T_SHADE, S(halfPlane(gr,-45.)));
    }
  }

  if(n2>=0.5 && n2<0.7){
    if(row == 2 && column == 1){
      col = mix(col, T_PANEL, S(B(gr,vec2(0.5))));
      col = mix(col, T_STROKE, S(brackets(gr)));
      col = mix(col, T_CUT, S(bolts(gr, n<0.5 ? 1. : -1.)));
      col = mix(col, T_CUT, S(hatchPlate(gr)));
      col = mix(col, T_MARK, S(abs(B(gr,vec2(0.17)))-0.012));
    }
    if(row == 2 && column == 0){
      float mask = halfPlane(gr,-225.);
      col = mix(col, T_FILL, S(mask));
      col = mix(col, T_CUT, S(max(mask, grids2(gr))));
    }
  }

  if(n2>=0.8){
    if(row == 1 && column == 2){
      float mask = halfPlane(gr,-45.);
      col = mix(col, T_SHADE, S(mask));
      d2 = max(mask, B(gr-vec2(0.0,0.7),vec2(0.5)));
      col = mix(col, T_FILL, S(d2));
      col = mix(col, T_SHADE, S(max(d2,stripe(gr))));
    }
    if(row == 2 && column == 2){
      col = mix(col, T_FILL, S(B(gr,vec2(0.5))));
      col = mix(col, T_CUT, S(stripe(gr*Rot(radians(45.)))));
    }
  }
  return col;
}

// Screen-space vertical grade: toward the top, cell fills lift and strokes fade.
float gradeTone(float t, float top){
  float isStroke = smoothstep(0.32, 0.48, t);
  float isFill = smoothstep(0.04, 0.22, t) * (1.0 - isStroke);
  float lift = mix(1.0, 1.25, top * isFill);
  float fade = mix(1.0, 0.45, top * isStroke);
  return clamp(t * lift * fade, 0.0, 1.0);
}

vec4 shade(vec2 fragCoord){
  // gl_FragCoord.y is 0 at the bottom — top of the viewport approaches 1.
  float top = smoothstep(0.25, 0.9, fragCoord.y / iResolution.y);
  float tone = gradeTone(clamp(pattern(fragCoord), 0.0, 1.0), top);
  float alpha = tone * uOpacity;
  return vec4(uInk * alpha, alpha);
}
`

export const FRAGMENT_WEBGL2 = `#version 300 es
precision highp float;
out vec4 fragColor;
${BODY}
void main(){ fragColor = shade(gl_FragCoord.xy); }
`

export const FRAGMENT_WEBGL1 = `#extension GL_OES_standard_derivatives : enable
precision highp float;
${BODY}
void main(){ gl_FragColor = shade(gl_FragCoord.xy); }
`

export const VERTEX_WEBGL2 = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

export const VERTEX_WEBGL1 = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`
